from django.urls import path
from .views import (
    PacienteListCreate, ComunidadeListCreate, AtendimentoListCreate,
    LoginUsuario, UsuarioListCreate
)

urlpatterns = [
    # Endpoints existentes (compatibilidade)
    path('pacientes/listar', PacienteListCreate.as_view(), name='listar_pacientes'),
    path('pacientes/', PacienteListCreate.as_view(), name='cadastrar_paciente'),
    
    # Novos endpoints
    path('comunidades/', ComunidadeListCreate.as_view(), name='listar_comunidades'),
    path('atendimentos/', AtendimentoListCreate.as_view(), name='listar_atendimentos'),
    path('usuarios/', UsuarioListCreate.as_view(), name='cadastrar_usuario'),
    path('auth/login/', LoginUsuario.as_view(), name='login_usuario'),
]