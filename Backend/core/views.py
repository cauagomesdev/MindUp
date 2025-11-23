from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Comunidade, EspacoComunitario, Paciente, Colaborador,
    Disponibilidade, Voluntario, Usuario, Atendimento,
    Participar, Acompanhamento
)
from datetime import datetime,timedelta
from .serializers import (
    UsuarioRegisterSerializer, LoginSerializer, UsuarioSerializer,
    PacienteSerializer, VoluntarioSerializer, ComunidadeSerializer,
    EspacoComunitarioSerializer, ColaboradorSerializer, DisponibilidadeSerializer,
    AtendimentoSerializer, ParticiparSerializer, AcompanhamentoSerializer
)
from rest_framework.pagination import PageNumberPagination

# ===================================================================
# 1. AUTENTICAÇÃO E REGISTRO
# ===================================================================

class LoginUsuario(APIView):
    """
    View para login de usuários.
    Recebe 'email' e 'password', retorna dados do usuário e token JWT.
    """
    permission_classes = [AllowAny] # Qualquer um pode tentar logar

    def post(self, request):
        # Passa o 'request' para o contexto do serializer (necessário para o 'authenticate')
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user'] # type: ignore
        
        # Gera os tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Serializa os dados do usuário para retornar no login
        user_data = UsuarioSerializer(user).data
        
        return Response({
            "message": "Login realizado com sucesso!",
            "user": user_data,
            "token": access_token
        }, status=status.HTTP_200_OK)

class RegisterUsuario(generics.CreateAPIView):
    """
    View para registro de *novos usuários*.
    Usa o UsuarioRegisterSerializer que lida com a criação
    do Usuário e do perfil (Paciente ou Voluntário) de forma atômica.
    """
    permission_classes = [AllowAny] # Qualquer um pode se registrar
    serializer_class = UsuarioRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # Chama o método create() do serializer
        
        # Loga o usuário automaticamente após o registro
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        user_data = UsuarioSerializer(user).data
        
        headers = self.get_success_headers(serializer.data)
        
        return Response({
            "message": "Usuário cadastrado com sucesso!",
            "user": user_data,
            "token": access_token
        }, status=status.HTTP_201_CREATED, headers=headers)

# ===================================================================
# 2. PAGINAÇÃO (Opcional, mas bom para performance)
# ===================================================================

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# ===================================================================
# 3. VIEWS DE DADOS (CRUD)
# ===================================================================

# Views para Paciente (Agora apenas Leitura, pois o registro é centralizado)
class PacienteList(generics.ListAPIView):
    queryset = Paciente.objects.all().order_by('usuario__nome')
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated] # Apenas logados podem ver
    pagination_class = CustomPagination

# Views para Voluntário (Agora apenas Leitura)
class VoluntarioList(generics.ListAPIView):
    queryset = Voluntario.objects.all().order_by('usuario__nome')
    serializer_class = VoluntarioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

# Views para Comunidade
class ComunidadeListCreate(generics.ListCreateAPIView):
    queryset = Comunidade.objects.all().order_by('nome')
    serializer_class = ComunidadeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Todos podem ver, só logados podem criar
    pagination_class = CustomPagination

# Views para Espaço Comunitário
class EspacoComunitarioListCreate(generics.ListCreateAPIView):
    queryset = EspacoComunitario.objects.all().order_by('nome')
    serializer_class = EspacoComunitarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPagination

# Views para Atendimento
class AtendimentoListCreate(generics.ListCreateAPIView):
    queryset = Atendimento.objects.all().order_by('-data', '-horario')
    serializer_class = AtendimentoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

class AtendimentoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Atendimento.objects.all()
    serializer_class = AtendimentoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_atendimento'
    lookup_url_kwarg = 'id'

# Views para Acompanhamento
class AcompanhamentoListCreate(generics.ListCreateAPIView):
    queryset = Acompanhamento.objects.all().order_by('-data_inicio')
    serializer_class = AcompanhamentoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

class AcompanhamentoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Acompanhamento.objects.all()
    serializer_class = AcompanhamentoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_acompanhamento'
    lookup_url_kwarg = 'id'

# Views para Colaborador
class ColaboradorListCreate(generics.ListCreateAPIView):
    queryset = Colaborador.objects.all().order_by('nome')
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated] # Geralmente só admin/logados veem
    pagination_class = CustomPagination

# Views para Disponibilidade
class DisponibilidadeListCreate(generics.ListCreateAPIView):
    queryset = Disponibilidade.objects.all().order_by('dia_semana', 'hora_inicio')
    serializer_class = DisponibilidadeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

# Views para Usuario (Listar usuários existentes - geralmente para Admins)
class UsuarioList(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('nome')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated] # Idealmente [IsAdminUser]
    pagination_class = CustomPagination

from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, timedelta
from .models import Disponibilidade, Atendimento

class VagasDisponiveisView(APIView):
    """
    Retorna horários livres fatiados de 1 em 1 hora.
    Versão corrigida com tratamento para atendimentos antigos (sem voluntário).
    """
    def get(self, request):
        data_str = request.query_params.get('data') 
        
        if not data_str:
            return Response({"error": "Data é obrigatória"}, status=400)

        try:
            # 1. Converter data
            data_obj = datetime.strptime(data_str, '%Y-%m-%d').date()
            dias_map = {
                0: 'segunda', 1: 'terca', 2: 'quarta', 3: 'quinta', 
                4: 'sexta', 5: 'sabado', 6: 'domingo'
            }
            dia_semana_str = dias_map[data_obj.weekday()]

            # 2. Buscar disponibilidades
            disponibilidades = Disponibilidade.objects.filter(dia_semana=dia_semana_str)
            
            # 3. BUSCAR OCUPADOS
            atendimentos_ocupados = Atendimento.objects.filter(
                data=data_obj, 
                status__in=['agendado', 'realizado']
            )

            ocupados_set = set()
            for at in atendimentos_ocupados:
                # --- CORREÇÃO AQUI ---
                # Verifica se existe um voluntário vinculado. Se for None (antigo), pula.
                if at.id_voluntario:
                    hora_str = at.horario.strftime('%H:%M:%S') 
                    vol_id_str = str(at.id_voluntario.id_voluntario)
                    chave = f"{hora_str}|{vol_id_str}"
                    ocupados_set.add(chave)

            vagas_livres = []
            DURACAO_CONSULTA = 1 # horas

            # 4. LOOP DE GERAÇÃO
            for disp in disponibilidades:
                inicio_dt = datetime.combine(data_obj, disp.hora_inicio)
                fim_dt = datetime.combine(data_obj, disp.hora_fim)
                
                cursor = inicio_dt

                while (cursor + timedelta(hours=DURACAO_CONSULTA)) <= fim_dt:
                    horario_atual = cursor.time()
                    
                    hora_atual_str = horario_atual.strftime('%H:%M:%S')
                    
                    # Verifica se id_voluntario existe no objeto de disponibilidade (segurança extra)
                    if disp.id_voluntario:
                        vol_atual_id_str = str(disp.id_voluntario.id_voluntario)
                        chave_atual = f"{hora_atual_str}|{vol_atual_id_str}"

                        # SE NÃO ESTIVER NO SET DE STRINGS, ESTÁ LIVRE
                        if chave_atual not in ocupados_set:
                            
                            vagas_livres.append({
                                "id_disponibilidade": disp.id_disponibilidade,
                                "horario": hora_atual_str, 
                                "voluntario": {
                                    "id": disp.id_voluntario.id_voluntario,
                                    "nome": disp.id_voluntario.usuario.nome,
                                    "universidade": disp.id_voluntario.universidade,
                                    "especialidade": disp.id_voluntario.especialidade
                                }
                            })
                    
                    cursor += timedelta(hours=DURACAO_CONSULTA)

            # Ordenar
            vagas_livres.sort(key=lambda x: x['horario'])

            return Response(vagas_livres)
        
        except ValueError:
            return Response({"error": "Formato de data inválido."}, status=400)
        
class MeusDiasAgendadosView(APIView):
    """
    Retorna uma lista de datas (YYYY-MM-DD) onde o usuário (Paciente ou Voluntário)
    possui agendamentos marcados ou realizados.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        datas = []

        if user.nivel_acesso == 'paciente':
            # Busca datas onde o paciente tem consulta
            if hasattr(user, 'paciente_perfil'):
                datas = Atendimento.objects.filter(
                    id_paciente=user.paciente_perfil,
                    status__in=['agendado', 'realizado']
                ).values_list('data', flat=True)

        elif user.nivel_acesso == 'voluntario':
            # Busca datas onde o voluntário vai atender
            if hasattr(user, 'voluntario_perfil'):
                datas = Atendimento.objects.filter(
                    id_voluntario=user.voluntario_perfil,
                    status__in=['agendado', 'realizado']
                ).values_list('data', flat=True)
        
        # Remove duplicatas e converte para string
        datas_unicas = sorted(list(set(datas)))
        return Response(datas_unicas)