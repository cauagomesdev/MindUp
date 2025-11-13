from django.urls import path
from .views import (
    PacienteListCreate, ComunidadeListCreate, AtendimentoListCreate,
    LoginUsuario, UsuarioListCreate, EspacoComunitarioListCreate,
    AcompanhamentoListCreate, AcompanhamentoDetail, AtendimentoDetail,
    ColaboradorListCreate, VoluntarioListCreate, DisponibilidadeListCreate
)

urlpatterns = [
    # Autenticação
    path('auth/login/', LoginUsuario.as_view(), name='login_usuario'),
    
    # Pacientes
    path('pacientes/listar', PacienteListCreate.as_view(), name='listar_pacientes'),
    path('pacientes/', PacienteListCreate.as_view(), name='cadastrar_paciente'),
    
    # Comunidades
    path('comunidades/', ComunidadeListCreate.as_view(), name='listar_criar_comunidades'),
    
    # Atendimentos
    path('atendimentos/', AtendimentoListCreate.as_view(), name='listar_criar_atendimentos'),
    path('atendimentos/<uuid:id>/', AtendimentoDetail.as_view(), name='atendimento_detail'),
    
    # Acompanhamentos
    path('acompanhamentos/', AcompanhamentoListCreate.as_view(), name='listar_criar_acompanhamentos'),
    path('acompanhamentos/<uuid:id>/', AcompanhamentoDetail.as_view(), name='acompanhamento_detail'),
    
    # Usuários (Profissionais)
    path('usuarios/', UsuarioListCreate.as_view(), name='listar_criar_usuarios'),
    
    # Espaços Comunitários
    path('espacos/', EspacoComunitarioListCreate.as_view(), name='listar_criar_espacos'),
    
    # Colaboradores
    path('colaboradores/', ColaboradorListCreate.as_view(), name='listar_criar_colaboradores'),
    
    # Voluntários
    path('voluntarios/', VoluntarioListCreate.as_view(), name='listar_criar_voluntarios'),
    
    # Disponibilidades
    path('disponibilidades/', DisponibilidadeListCreate.as_view(), name='listar_criar_disponibilidades'),
]