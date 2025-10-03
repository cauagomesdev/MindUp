from django.contrib import admin
from django import forms
from django.contrib.auth.hashers import make_password
from .models import (
    Comunidade, EspacoComunitario, Paciente, Colaborador,
    Disponibilidade, Voluntario, Usuario, Atendimento,
    Participar, Acompanhamento
)

# Admin para Comunidade
@admin.register(Comunidade)
class ComunidadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'localizacao', 'descricao')
    search_fields = ('nome', 'localizacao')
    ordering = ('nome',)

# Admin para EspacoComunitario
@admin.register(EspacoComunitario)
class EspacoComunitarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'endereco', 'capacidade', 'responsavel', 'id_comunidade')
    list_filter = ('id_comunidade',)
    search_fields = ('nome', 'endereco', 'responsavel')
    ordering = ('nome',)

# Form customizado para Paciente
class PacienteAdminForm(forms.ModelForm):
    senha = forms.CharField(
        required=False, 
        widget=forms.PasswordInput, 
        help_text="Deixe em branco para manter a senha atual. Digite uma nova senha para alterá-la."
    )
    
    class Meta:
        model = Paciente
        fields = ('nome', 'email', 'endereco', 'id_comunidade', 'senha')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Se está editando um objeto existente, não tornar a senha obrigatória
        if self.instance and self.instance.pk:
            self.fields['senha'].required = False
        else:
            self.fields['senha'].required = True
            self.fields['senha'].help_text = "Senha obrigatória para novos pacientes."

    def save(self, commit=True):
        obj = super().save(commit=False)
        senha = self.cleaned_data.get('senha')
        if senha:  # Só atualiza se uma nova senha foi fornecida
            obj.senha_hash = make_password(senha)
        if commit:
            obj.save()
        return obj

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    form = PacienteAdminForm
    list_display = ('nome', 'email', 'endereco', 'id_comunidade', 'criado_em')
    list_filter = ('id_comunidade', 'criado_em')
    search_fields = ('nome', 'email')
    ordering = ('nome',)
    readonly_fields = ('criado_em',)

# Admin para Colaborador
@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'endereco', 'contato', 'criado_em')
    search_fields = ('nome', 'cpf', 'contato')
    ordering = ('nome',)
    readonly_fields = ('criado_em',)

# Admin para Disponibilidade
@admin.register(Disponibilidade)
class DisponibilidadeAdmin(admin.ModelAdmin):
    list_display = ('id_colaborador', 'dia_semana', 'hora_inicio', 'hora_fim')
    list_filter = ('dia_semana', 'id_colaborador')
    ordering = ('id_colaborador', 'dia_semana', 'hora_inicio')

# Admin para Voluntario
@admin.register(Voluntario)
class VoluntarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'contato', 'universidade', 'especialidade', 'id_colaborador')
    list_filter = ('especialidade', 'universidade')
    search_fields = ('nome', 'contato', 'especialidade')
    ordering = ('nome',)

# Form customizado para Usuario
class UsuarioAdminForm(forms.ModelForm):
    senha = forms.CharField(
        required=False, 
        widget=forms.PasswordInput, 
        help_text="Deixe em branco para manter a senha atual. Digite uma nova senha para alterá-la."
    )
    
    class Meta:
        model = Usuario
        fields = ('nome_login', 'email', 'nivel_acesso', 'senha')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Se está editando um objeto existente, não tornar a senha obrigatória
        if self.instance and self.instance.pk:
            self.fields['senha'].required = False
        else:
            self.fields['senha'].required = True
            self.fields['senha'].help_text = "Senha obrigatória para novos usuários."

    def save(self, commit=True):
        obj = super().save(commit=False)
        senha = self.cleaned_data.get('senha')
        if senha:  # Só atualiza se uma nova senha foi fornecida
            obj.senha_hash = make_password(senha)
        if commit:
            obj.save()
        return obj

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    form = UsuarioAdminForm
    list_display = ('nome_login', 'email', 'nivel_acesso', 'criado_em')
    list_filter = ('nivel_acesso', 'criado_em')
    search_fields = ('nome_login', 'email')
    ordering = ('nome_login',)
    readonly_fields = ('criado_em',)

# Admin para Atendimento
@admin.register(Atendimento)
class AtendimentoAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'data', 'horario', 'tipo_atendimento', 'status', 'id_espaco_comunitario')
    list_filter = ('status', 'data', 'tipo_atendimento')
    search_fields = ('id_paciente__nome', 'tipo_atendimento')
    ordering = ('-data', '-horario')
    date_hierarchy = 'data'
    readonly_fields = ('criado_em',)

# Admin para Participar
@admin.register(Participar)
class ParticiparAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'id_atendimento')
    search_fields = ('id_paciente__nome', 'id_atendimento__tipo_atendimento')

# Admin para Acompanhamento
@admin.register(Acompanhamento)
class AcompanhamentoAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'data_inicio', 'situacao', 'criado_em')
    list_filter = ('situacao', 'data_inicio')
    search_fields = ('id_paciente__nome', 'situacao')
    ordering = ('-data_inicio',)
    date_hierarchy = 'data_inicio'
    readonly_fields = ('criado_em',)