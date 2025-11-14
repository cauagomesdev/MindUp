from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Comunidade, EspacoComunitario, Paciente, Colaborador,
    Disponibilidade, Voluntario, Usuario, Atendimento,
    Participar, Acompanhamento
)

# --- INLINES: Para editar Paciente/Voluntário dentro do Usuário ---

# Isso permite que, ao editar um Usuário, você veja/edite o perfil
# de Paciente associado a ele na mesma tela.
class PacienteInline(admin.StackedInline):
    model = Paciente
    can_delete = False # Não permitir deletar o perfil sem deletar o usuário
    verbose_name_plural = 'Perfil de Paciente'
    fk_name = 'usuario' # Especifica a chave estrangeira usada

# O mesmo para Voluntário
class VoluntarioInline(admin.StackedInline):
    model = Voluntario
    can_delete = False
    verbose_name_plural = 'Perfil de Voluntário'
    fk_name = 'usuario'

# --- Admin para o Modelo USUÁRIO (Corrigido) ---

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Campos que aparecem na lista de usuários
    list_display = ('email', 'nome', 'nivel_acesso', 'is_staff', 'is_active', 'criado_em')
    list_filter = ('nivel_acesso', 'is_staff', 'is_active', 'criado_em')
    search_fields = ('email', 'nome')
    ordering = ('email',)
    
    # Campos que aparecem ao *editar* um usuário
    # (Sobrescrevendo o UserAdmin padrão para usar nossos campos customizados)
    fieldsets = (
        (None, {'fields': ('email', 'password')}), # O 'password' será tratado pelo UserAdmin
        ('Informações Pessoais', {'fields': ('nome', 'nivel_acesso')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'criado_em')}),
    )
    
    # Campos que aparecem ao *adicionar* um usuário (no /admin/)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('nome', 'email', 'password', 'password2', 'nivel_acesso', 'is_staff', 'is_superuser'),
        }),
    )
    
    # Campos que não podem ser editados
    readonly_fields = ('last_login', 'criado_em')
    
    # Adiciona os perfis de Paciente e Voluntário na mesma página
    inlines = (PacienteInline, VoluntarioInline)
    
    # Necessário para o AbstractBaseUser
    filter_horizontal = ('groups', 'user_permissions',)

    # Sobrescreve para usar o modelo customizado
    model = Usuario
    

# --- Admins Simples (Comunidade, Espaco, Colaborador) ---

@admin.register(Comunidade)
class ComunidadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'localizacao', 'descricao')
    search_fields = ('nome', 'localizacao')
    ordering = ('nome',)

@admin.register(EspacoComunitario)
class EspacoComunitarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'endereco', 'capacidade', 'responsavel', 'id_comunidade')
    list_filter = ('id_comunidade',)
    search_fields = ('nome', 'endereco', 'responsavel')
    ordering = ('nome',)

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'endereco', 'contato', 'criado_em')
    search_fields = ('nome', 'cpf', 'contato')
    ordering = ('nome',)
    readonly_fields = ('criado_em',)

# --- Admin para Disponibilidade (Corrigido) ---
@admin.register(Disponibilidade)
class DisponibilidadeAdmin(admin.ModelAdmin):
    # CORREÇÃO: Mostra 'id_voluntario'
    list_display = ('id_voluntario', 'dia_semana', 'hora_inicio', 'hora_fim')
    list_filter = ('dia_semana', 'id_voluntario')
    ordering = ('id_voluntario', 'dia_semana', 'hora_inicio')

# --- Admin para Atendimento (Corrigido) ---
@admin.register(Atendimento)
class AtendimentoAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'data', 'horario', 'tipo_atendimento', 'status', 'id_espaco_comunitario')
    list_filter = ('status', 'data', 'tipo_atendimento')
    # CORREÇÃO: O caminho da busca agora é 'id_paciente__usuario__nome'
    search_fields = ('id_paciente__usuario__nome', 'tipo_atendimento')
    ordering = ('-data', '-horario')
    date_hierarchy = 'data'
    readonly_fields = ('criado_em',)

# --- Admin para Participar (Corrigido) ---
@admin.register(Participar)
class ParticiparAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'id_atendimento')
    # CORREÇÃO: O caminho da busca
    search_fields = ('id_paciente__usuario__nome', 'id_atendimento__tipo_atendimento')

# --- Admin para Acompanhamento (Corrigido) ---
@admin.register(Acompanhamento)
class AcompanhamentoAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'data_inicio', 'situacao', 'criado_em')
    list_filter = ('situacao', 'data_inicio')
    # CORREÇÃO: O caminho da busca
    search_fields = ('id_paciente__usuario__nome', 'situacao')
    ordering = ('-data_inicio',)
    date_hierarchy = 'data_inicio'
    readonly_fields = ('criado_em',)

# --- REMOVIDO ---
# Não precisamos mais registrar Paciente e Voluntario separadamente,
# pois eles agora são 'inlines' do UsuarioAdmin.
# @admin.register(Paciente) ...
# @admin.register(Voluntario) ...