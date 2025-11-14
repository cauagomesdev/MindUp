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