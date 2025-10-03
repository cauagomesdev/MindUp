from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *

# Views para Paciente (mantendo compatibilidade com frontend)
@method_decorator(csrf_exempt, name='dispatch')
class PacienteListCreate(generics.ListCreateAPIView):
    queryset = Paciente.objects.all().order_by('nome')
    serializer_class = PacienteSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({"pacientes": serializer.data})

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        senha = data.pop('senha', None)
        if not senha:
            return Response({"error": "Senha é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        Paciente.objects.create(
            nome=serializer.validated_data['nome'],
            email=serializer.validated_data['email'],
            senha_hash=make_password(senha),
            endereco=serializer.validated_data.get('endereco', ''),
            id_comunidade=serializer.validated_data.get('id_comunidade'),
        )
        return Response({"message": "Paciente cadastrado com sucesso!"}, status=status.HTTP_201_CREATED)

# Views para Comunidade
@method_decorator(csrf_exempt, name='dispatch')
class ComunidadeListCreate(generics.ListCreateAPIView):
    queryset = Comunidade.objects.all().order_by('nome')
    serializer_class = ComunidadeSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({"comunidades": serializer.data})

# Views para Atendimento
@method_decorator(csrf_exempt, name='dispatch')
class AtendimentoListCreate(generics.ListCreateAPIView):
    queryset = Atendimento.objects.all().order_by('-data', '-horario')
    serializer_class = AtendimentoSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response({"atendimentos": serializer.data})

# Login usando nova tabela Usuario
@method_decorator(csrf_exempt, name='dispatch')
class LoginUsuario(APIView):
    def post(self, request):
        nome_login = request.data.get('nome_login') or request.data.get('email')
        senha = request.data.get('senha')
        
        if not nome_login or not senha:
            return Response({"error": "Login e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Primeiro tentar na tabela Usuario
        try:
            usuario = Usuario.objects.get(nome_login=nome_login)
            if check_password(senha, usuario.senha_hash):
                return Response({
                    "message": "Login realizado com sucesso!",
                    "id": str(usuario.id_usuario),
                    "nome": usuario.nome_login,
                    "nivel_acesso": usuario.nivel_acesso
                }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            pass
        
        # Se não encontrou, tentar por email na tabela Usuario
        try:
            usuario = Usuario.objects.get(email=nome_login)
            if check_password(senha, usuario.senha_hash):
                return Response({
                    "message": "Login realizado com sucesso!",
                    "id": str(usuario.id_usuario),
                    "nome": usuario.nome_login,
                    "nivel_acesso": usuario.nivel_acesso
                }, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            pass
        
        # Se não encontrou na tabela Usuario, tentar na tabela Paciente
        try:
            paciente = Paciente.objects.get(email=nome_login)
            if check_password(senha, paciente.senha_hash):
                return Response({
                    "message": "Login realizado com sucesso!",
                    "id": str(paciente.id_paciente),
                    "nome": paciente.nome,
                    "nivel_acesso": "paciente"
                }, status=status.HTTP_200_OK)
        except Paciente.DoesNotExist:
            pass
        
        return Response({"error": "Usuário ou senha inválidos"}, status=status.HTTP_401_UNAUTHORIZED)
    
# Views para Usuario
@method_decorator(csrf_exempt, name='dispatch')
class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all().order_by('nome_login')
    serializer_class = UsuarioSerializer

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)  # Retorna lista direta para ProfissionaisList

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        senha = data.pop('senha', None)
        if not senha:
            return Response({"error": "Senha é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        Usuario.objects.create(
            nome_login=serializer.validated_data['nome_login'],
            email=serializer.validated_data['email'],
            senha_hash=make_password(senha),
            nivel_acesso=serializer.validated_data.get('nivel_acesso', 'colaborador'),
        )
        return Response({"message": "Usuário cadastrado com sucesso!"}, status=status.HTTP_201_CREATED)