from django.contrib import admin
from django import forms
from django.contrib.auth.hashers import make_password
from .models import *

@admin.register(Comunidade)
class ComunidadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'localizacao')
    search_fields = ('nome', 'localizacao')

@admin.register(EspacoComunitario)
class EspacoComunitarioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'id_comunidade', 'responsavel', 'capacidade')
    list_filter = ('id_comunidade',)
    search_fields = ('nome', 'responsavel')

class PacienteAdminForm(forms.ModelForm):
    senha = forms.CharField(required=False, widget=forms.PasswordInput, help_text="Se preenchida, substituirá a senha atual.")
    
    class Meta:
        model = Paciente
        fields = ('nome', 'email', 'endereco', 'id_comunidade', 'senha')

    def save(self, commit=True):
        obj = super().save(commit=False)
        senha = self.cleaned_data.get('senha')
        if senha:
            obj.senha_hash = make_password(senha)
        if commit:
            obj.save()
        return obj

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    form = PacienteAdminForm
    list_display = ('nome', 'email', 'id_comunidade', 'criado_em')
    list_filter = ('id_comunidade', 'criado_em')
    search_fields = ('nome', 'email')

@admin.register(Colaborador)
class ColaboradorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'contato', 'criado_em')
    search_fields = ('nome', 'cpf')

@admin.register(Atendimento)
class AtendimentoAdmin(admin.ModelAdmin):
    list_display = ('id_paciente', 'data', 'horario', 'status', 'tipo_atendimento')
    list_filter = ('status', 'data', 'tipo_atendimento')
    search_fields = ('id_paciente__nome',)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nome_login', 'email', 'nivel_acesso', 'criado_em')
    list_filter = ('nivel_acesso', 'criado_em')
    search_fields = ('nome_login', 'email')