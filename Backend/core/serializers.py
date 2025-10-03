from rest_framework import serializers
from .models import (
    Comunidade, EspacoComunitario, Paciente, Colaborador,
    Disponibilidade, Voluntario, Usuario, Atendimento,
    Participar, Acompanhamento
)

class ComunidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidade
        fields = ['id_comunidade', 'nome', 'localizacao', 'descricao']

class EspacoComunitarioSerializer(serializers.ModelSerializer):
    comunidade_nome = serializers.CharField(source='id_comunidade.nome', read_only=True)
    
    class Meta:
        model = EspacoComunitario
        fields = ['id_espaco_comunitario', 'nome', 'endereco', 'capacidade', 'responsavel', 'id_comunidade', 'comunidade_nome']

class PacienteSerializer(serializers.ModelSerializer):
    comunidade_nome = serializers.CharField(source='id_comunidade.nome', read_only=True)
    
    class Meta:
        model = Paciente
        fields = ['id_paciente', 'nome', 'email', 'endereco', 'id_comunidade', 'comunidade_nome', 'criado_em']

class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = ['id_colaborador', 'nome', 'cpf', 'endereco', 'contato', 'criado_em']

class DisponibilidadeSerializer(serializers.ModelSerializer):
    colaborador_nome = serializers.CharField(source='id_colaborador.nome', read_only=True)
    
    class Meta:
        model = Disponibilidade
        fields = ['id_disponibilidade', 'dia_semana', 'hora_inicio', 'hora_fim', 'id_colaborador', 'colaborador_nome']

class VoluntarioSerializer(serializers.ModelSerializer):
    colaborador_nome = serializers.CharField(source='id_colaborador.nome', read_only=True)
    
    class Meta:
        model = Voluntario
        fields = ['id_voluntario', 'nome', 'contato', 'universidade', 'especialidade', 'id_colaborador', 'colaborador_nome']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome_login', 'email', 'nivel_acesso', 'criado_em']

class AtendimentoSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='id_paciente.nome', read_only=True)
    espaco_nome = serializers.CharField(source='id_espaco_comunitario.nome', read_only=True)
    
    class Meta:
        model = Atendimento
        fields = ['id_atendimento', 'data', 'horario', 'tipo_atendimento', 'status', 'id_espaco_comunitario', 'id_paciente', 'paciente_nome', 'espaco_nome', 'criado_em']

class AcompanhamentoSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='id_paciente.nome', read_only=True)
    
    class Meta:
        model = Acompanhamento
        fields = ['id_acompanhamento', 'data_inicio', 'descricao', 'situacao', 'id_paciente', 'paciente_nome', 'criado_em']