from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    Usuario, Paciente, Voluntario, Comunidade, EspacoComunitario,
    Colaborador, Disponibilidade, Atendimento, Participar, Acompanhamento
)

# ===================================================================
# 1. SERIALIZERS DE AUTENTICAÇÃO E REGISTRO
# ===================================================================

class UsuarioRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para o *registro* de um novo usuário.
    Recebe 'password' em texto puro e o criptografa.
    """
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    # Campos específicos do perfil (opcionais, "apenas escrita")
    endereco = serializers.CharField(write_only=True, required=False, allow_blank=True)
    id_comunidade = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    data_nascimento = serializers.DateField(write_only=True, required=False, allow_null=True) # <-- CORRIGIDO
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    universidade = serializers.CharField(write_only=True, required=False, allow_blank=True)
    especialidade = serializers.CharField(write_only=True, required=False, allow_blank=True)
    contato = serializers.CharField(write_only=True, required=False, allow_blank=True) # <-- CORRIGIDO

    class Meta:
        model = Usuario
        # Campos que o frontend deve enviar
        fields = [
            'nome', 'email', 'password', 'nivel_acesso', 
            'endereco', 'id_comunidade', 'data_nascimento', # <-- CORRIGIDO
            'universidade', 'especialidade', 'contato' # <-- CORRIGIDO
        ]
        
    def create(self, validated_data):
        # 1. Separa os dados
        nome = validated_data.pop('nome')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        nivel_acesso = validated_data.pop('nivel_acesso')
        
        profile_data = validated_data # O que sobrou

        # 2. Cria o Usuário base
        user = Usuario.objects.create_user( # type: ignore
            email=email,
            password=password,
            nome=nome,
            nivel_acesso=nivel_acesso
        )

        # 3. Cria o Perfil Específico
        if nivel_acesso == 'paciente':
            Paciente.objects.create(
                usuario=user,
                endereco=profile_data.get('endereco', ''),
                id_comunidade_id=profile_data.get('id_comunidade'),
                data_nascimento=profile_data.get('data_nascimento') # <-- CORRIGIDO
            )
        elif nivel_acesso == 'voluntario':
            Voluntario.objects.create(
                usuario=user,
                universidade=profile_data.get('universidade', ''),
                especialidade=profile_data.get('especialidade', ''),
                contato=profile_data.get('contato', '') # <-- CORRIGIDO
            )
            
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer para o *login*. Não está ligado a um modelo.
    Apenas valida o email e a senha.
    """
    email = serializers.EmailField(required=True)
    # Renomeado de 'password' para 'senha' para bater com o frontend
    password = serializers.CharField(write_only=True, required=True, source='senha')

    def validate(self, data):
        email = data.get('email')
        password = data.get('senha') # Pega o campo renomeado

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            
            if not user:
                raise serializers.ValidationError('Usuário ou senha inválidos.')
        else:
            raise serializers.ValidationError('É necessário informar e-mail e senha.')
        
        data['user'] = user
        return data

# ===================================================================
# 2. SERIALIZERS DE LEITURA (PARA LISTAR/DETALHAR DADOS)
# ===================================================================

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para *ler* os dados de um Usuário.
    Usado para retornar o objeto 'user' no login.
    """
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'email', 'nivel_acesso', 'criado_em']
        read_only_fields = fields

class PacienteSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='usuario.nome', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    comunidade_nome = serializers.CharField(source='id_comunidade.nome', read_only=True)
    
    class Meta:
        model = Paciente
        fields = [
            'id_paciente', 'usuario', 'nome', 'email', 
            'endereco', 'data_nascimento', 'id_comunidade', 'comunidade_nome', 'criado_em'
        ]

class VoluntarioSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='usuario.nome', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Voluntario
        fields = [
            'id_voluntario', 'usuario', 'nome', 'email', 
            'contato', 'universidade', 'especialidade'
        ]

class ComunidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidade
        fields = ['id_comunidade', 'nome', 'localizacao', 'descricao']

class EspacoComunitarioSerializer(serializers.ModelSerializer):
    comunidade_nome = serializers.CharField(source='id_comunidade.nome', read_only=True)
    
    class Meta:
        model = EspacoComunitario
        fields = [
            'id_espaco_comunitario', 'nome', 'endereco', 'capacidade', 
            'responsavel', 'id_comunidade', 'comunidade_nome'
        ]

class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = ['id_colaborador', 'nome', 'cpf', 'endereco', 'contato', 'criado_em']

class DisponibilidadeSerializer(serializers.ModelSerializer):
    voluntario_nome = serializers.CharField(source='id_voluntario.usuario.nome', read_only=True)
    
    class Meta:
        model = Disponibilidade
        fields = [
            'id_disponibilidade', 'dia_semana', 'hora_inicio', 'hora_fim', 
            'id_voluntario', 'voluntario_nome'
        ]

class AtendimentoSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='id_paciente.usuario.nome', read_only=True)
    espaco_nome = serializers.CharField(source='id_espaco_comunitario.nome', read_only=True)
    
    class Meta:
        model = Atendimento
        fields = [
            'id_atendimento', 'data', 'horario', 'tipo_atendimento', 'status', 
            'id_espaco_comunitario', 'id_paciente', 'paciente_nome', 'espaco_nome', 'criado_em'
        ]

class AcompanhamentoSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='id_paciente.usuario.nome', read_only=True)
    
    class Meta:
        model = Acompanhamento
        fields = [
            'id_acompanhamento', 'data_inicio', 'descricao', 'situacao', 
            'id_paciente', 'paciente_nome', 'criado_em'
        ]

class ParticiparSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='id_paciente.usuario.nome', read_only=True)
    atendimento_info = serializers.CharField(source='id_atendimento.__str__', read_only=True)

    class Meta:
        model = Participar
        fields = ['id_participar', 'id_atendimento', 'id_paciente', 'paciente_nome', 'atendimento_info']