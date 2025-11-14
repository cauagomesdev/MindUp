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
    # Define 'password' como um campo de "apenas escrita" (não será retornado na resposta)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    # Adicionamos os campos específicos do perfil (que são opcionais no registro base)
    endereco = serializers.CharField(write_only=True, required=False, allow_blank=True)
    id_comunidade = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    universidade = serializers.CharField(write_only=True, required=False, allow_blank=True)
    especialidade = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        # Campos que o frontend deve enviar
        fields = [
            'nome', 'email', 'password', 'nivel_acesso', 
            'endereco', 'id_comunidade', 'universidade', 'especialidade'
        ]
        
    def create(self, validated_data):
        # 1. Separa os dados do Usuário dos dados de Perfil
        # Dados do Usuário
        nome = validated_data.pop('nome')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        nivel_acesso = validated_data.pop('nivel_acesso')
        
        # Dados de Perfil (o que sobrou)
        profile_data = validated_data 

        # 2. Cria o Usuário base
        user = Usuario.objects.create_user( # type: ignore
            email=email,
            password=password,
            nome=nome,
            nivel_acesso=nivel_acesso
        )

        # 3. Cria o Perfil Específico (Paciente ou Voluntário)
        if nivel_acesso == 'paciente':
            Paciente.objects.create(
                usuario=user,
                endereco=profile_data.get('endereco', ''),
                id_comunidade_id=profile_data.get('id_comunidade') # Pega o UUID da comunidade
            )
        elif nivel_acesso == 'voluntario':
            Voluntario.objects.create(
                usuario=user,
                universidade=profile_data.get('universidade', ''),
                especialidade=profile_data.get('especialidade', '')
            )
            
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer para o *login*. Não está ligado a um modelo.
    Apenas valida o email e a senha.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            # Tenta autenticar usando o 'email' como username_field
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
        # Campos que o frontend receberá
        fields = ['id_usuario', 'nome', 'email', 'nivel_acesso', 'criado_em']
        read_only_fields = fields # Apenas para leitura

class PacienteSerializer(serializers.ModelSerializer):
    """ Serializer para ler/listar Pacientes """
    # Puxa campos do modelo 'Usuario' relacionado
    nome = serializers.CharField(source='usuario.nome', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    # Puxa o nome da Comunidade
    comunidade_nome = serializers.CharField(source='id_comunidade.nome', read_only=True)
    
    class Meta:
        model = Paciente
        fields = [
            'id_paciente', 'usuario', 'nome', 'email', 
            'endereco', 'id_comunidade', 'comunidade_nome', 'criado_em'
        ]

class VoluntarioSerializer(serializers.ModelSerializer):
    """ Serializer para ler/listar Voluntários """
    # Puxa campos do modelo 'Usuario' relacionado
    nome = serializers.CharField(source='usuario.nome', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    
    class Meta:
        model = Voluntario
        fields = [
            'id_voluntario', 'usuario', 'nome', 'email', 
            'universidade', 'especialidade'
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
    # Puxa o nome do Voluntário (através do Usuario)
    voluntario_nome = serializers.CharField(source='id_voluntario.usuario.nome', read_only=True)
    
    class Meta:
        model = Disponibilidade
        fields = [
            'id_disponibilidade', 'dia_semana', 'hora_inicio', 'hora_fim', 
            'id_voluntario', 'voluntario_nome'
        ]

class AtendimentoSerializer(serializers.ModelSerializer):
    # Puxa o nome do Paciente (através do Usuario)
    paciente_nome = serializers.CharField(source='id_paciente.usuario.nome', read_only=True)
    espaco_nome = serializers.CharField(source='id_espaco_comunitario.nome', read_only=True)
    
    class Meta:
        model = Atendimento
        fields = [
            'id_atendimento', 'data', 'horario', 'tipo_atendimento', 'status', 
            'id_espaco_comunitario', 'id_paciente', 'paciente_nome', 'espaco_nome', 'criado_em'
        ]

class AcompanhamentoSerializer(serializers.ModelSerializer):
    # Puxa o nome do Paciente (através do Usuario)
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