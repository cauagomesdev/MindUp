# core/urls.py

from django.urls import path
from .views import (
    # --- CORREÇÃO AQUI ---
    # Importe os nomes novos (List), não os antigos (ListCreate)
    PacienteList, 
    VoluntarioList, 
    UsuarioList,
    # --- O resto dos imports ---
    ComunidadeListCreate, 
    AtendimentoListCreate,
    LoginUsuario, 
    RegisterUsuario, # A nova view de registro
    EspacoComunitarioListCreate,
    AcompanhamentoListCreate, 
    AcompanhamentoDetail, 
    AtendimentoDetail,
    ColaboradorListCreate, 
    DisponibilidadeListCreate
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Autenticação
    path('auth/login/', LoginUsuario.as_view(), name='login_usuario'),
    path('auth/register/', RegisterUsuario.as_view(), name='register_usuario'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Pacientes
    # --- CORREÇÃO AQUI ---
    path('pacientes/listar', PacienteList.as_view(), name='listar_pacientes'),
    # A rota 'pacientes/' de cadastro foi removida (agora é 'auth/register/')
    
    # Comunidades
    path('comunidades/', ComunidadeListCreate.as_view(), name='listar_criar_comunidades'),
    
    # Atendimentos
    path('atendimentos/', AtendimentoListCreate.as_view(), name='listar_criar_atendimentos'),
    path('atendimentos/<uuid:id>/', AtendimentoDetail.as_view(), name='atendimento_detail'),
    
    # Acompanhamentos
    path('acompanhamentos/', AcompanhamentoListCreate.as_view(), name='listar_criar_acompanhamentos'),
    path('acompanhamentos/<uuid:id>/', AcompanhamentoDetail.as_view(), name='acompanhamento_detail'),
    
    # Usuários (Profissionais)
    # --- CORREÇÃO AQUI ---
    path('usuarios/', UsuarioList.as_view(), name='listar_usuarios'),
    
    # Espaços Comunitários
    path('espacos/', EspacoComunitarioListCreate.as_view(), name='listar_criar_espacos'),
    
    # Colaboradores
    path('colaboradores/', ColaboradorListCreate.as_view(), name='listar_criar_colaboradores'),
    
    # Voluntários
    # --- CORREÇÃO AQUI ---
    path('voluntarios/', VoluntarioList.as_view(), name='listar_voluntarios'),
    
    # Disponibilidades
    path('disponibilidades/', DisponibilidadeListCreate.as_view(), name='listar_criar_disponibilidades'),
]