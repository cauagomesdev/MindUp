# core/urls.py

from django.urls import path
from .views import (
    PacienteList, 
    VoluntarioList, 
    UsuarioList,
    ComunidadeListCreate, 
    AtendimentoListCreate,
    LoginUsuario, 
    RegisterUsuario,
    EspacoComunitarioListCreate,
    AcompanhamentoListCreate, 
    AcompanhamentoDetail, 
    AtendimentoDetail,
    ColaboradorListCreate, 
    DisponibilidadeListCreate,
    VagasDisponiveisView,
    MeusDiasAgendadosView,
    DashboardVoluntarioView,
    PacienteDetail,
    VoluntarioDetail,
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
    path('pacientes/listar', PacienteList.as_view(), name='listar_pacientes'),
    
    # Comunidades
    path('comunidades/', ComunidadeListCreate.as_view(), name='listar_criar_comunidades'),
    
    # Atendimentos (CRUD Geral)
    path('atendimentos/', AtendimentoListCreate.as_view(), name='listar_criar_atendimentos'),
    path('atendimentos/<uuid:id>/', AtendimentoDetail.as_view(), name='atendimento_detail'),
    
    # Acompanhamentos
    path('acompanhamentos/', AcompanhamentoListCreate.as_view(), name='listar_criar_acompanhamentos'),
    path('acompanhamentos/<uuid:id>/', AcompanhamentoDetail.as_view(), name='acompanhamento_detail'),
    
    # Usuários (Profissionais)
    path('usuarios/', UsuarioList.as_view(), name='listar_usuarios'),
    
    # Espaços Comunitários
    path('espacos/', EspacoComunitarioListCreate.as_view(), name='listar_criar_espacos'),
    
    # Colaboradores
    path('colaboradores/', ColaboradorListCreate.as_view(), name='listar_criar_colaboradores'),
    
    # Voluntários
    path('voluntarios/', VoluntarioList.as_view(), name='listar_voluntarios'),
    
    # Disponibilidades
    path('disponibilidades/', DisponibilidadeListCreate.as_view(), name='listar_criar_disponibilidades'),

    # Rota para o calendário buscar vagas livres
    path('vagas/', VagasDisponiveisView.as_view(), name='buscar_vagas_disponiveis'),

    # Dias agendados
    path('meus-dias-agendados/', MeusDiasAgendadosView.as_view(), name='meus_dias_agendados'),

    # Dashborad
    path('dashboard/voluntario/', DashboardVoluntarioView.as_view(), name='dashboard_voluntario'),

    # Rotas de Pacientes
    path('pacientes/listar', PacienteList.as_view(), name='listar_pacientes'),
    path('pacientes/<uuid:id>/', PacienteDetail.as_view(), name='paciente_detail'),

    # Rotas de Voluntários
    path('voluntarios/', VoluntarioList.as_view(), name='listar_voluntarios'),
    path('voluntarios/<uuid:id>/', VoluntarioDetail.as_view(), name='voluntario_detail'),
]