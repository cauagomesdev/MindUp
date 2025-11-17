from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) # set_password já faz o make_password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('nivel_acesso', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

# --- MODIFICADO: Classe Usuario ---
class Usuario(AbstractBaseUser, PermissionsMixin): # Herda de AbstractBaseUser e PermissionsMixin
    NIVEL_ACESSO_CHOICES = [
        ('admin', 'Administrador'),
        ('colaborador', 'Colaborador'),
        ('voluntario', 'Voluntário'),
        ('paciente', 'Paciente'),
    ]

    id_usuario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100) # NOVO: Campo nome
    email = models.EmailField(unique=True) # Agora é o username_field
    # senha_hash agora é gerenciado por set_password e check_password de AbstractBaseUser
    nivel_acesso = models.CharField(max_length=20, choices=NIVEL_ACESSO_CHOICES, default='paciente')
    criado_em = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager() # Usa o manager customizado

    USERNAME_FIELD = 'email' # O campo que será usado para login
    REQUIRED_FIELDS = ['nome'] # Campos obrigatórios além do USERNAME_FIELD

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.email


class Comunidade(models.Model):
    id_comunidade = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    localizacao = models.CharField(max_length=200, blank=True)
    descricao = models.TextField(blank=True)

    class Meta:
        db_table = 'comunidade'

    def __str__(self):
        return self.nome

class EspacoComunitario(models.Model):
    id_espaco_comunitario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200, blank=True)
    capacidade = models.IntegerField(null=True, blank=True)
    responsavel = models.CharField(max_length=100, blank=True)
    id_comunidade = models.ForeignKey(Comunidade, on_delete=models.CASCADE, related_name='espacos')

    class Meta:
        db_table = 'espaco_comunitario'

    def __str__(self):
        return self.nome

class Paciente(models.Model):
    id_paciente = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='paciente_perfil') # Liga ao Usuario
    endereco = models.CharField(max_length=200, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)
    id_comunidade = models.ForeignKey(Comunidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='pacientes')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'paciente'

    def __str__(self):
        return self.usuario.nome # Pega o nome do Usuario associado

class Colaborador(models.Model): # Manter se for um perfil administrativo
    id_colaborador = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=200, blank=True)
    contato = models.CharField(max_length=20, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'colaborador'

    def __str__(self):
        return self.nome

class Voluntario(models.Model):
    id_voluntario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='voluntario_perfil') # Liga ao Usuario
    contato = models.CharField(max_length=20, blank=True)
    universidade = models.CharField(max_length=100, blank=True)
    especialidade = models.CharField(max_length=100, blank=True)


    class Meta:
        db_table = 'voluntario'

    def __str__(self):
        return self.usuario.nome # Pega o nome do Usuario associado

class Disponibilidade(models.Model):
    DIAS_SEMANA = [
        ('segunda', 'Segunda-feira'),
        ('terca', 'Terça-feira'),
        ('quarta', 'Quarta-feira'),
        ('quinta', 'Quinta-feira'),
        ('sexta', 'Sexta-feira'),
        ('sabado', 'Sábado'),
        ('domingo', 'Domingo'),
    ]
    
    id_disponibilidade = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dia_semana = models.CharField(max_length=20, choices=DIAS_SEMANA)
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    id_voluntario = models.ForeignKey(Voluntario, on_delete=models.CASCADE, related_name='disponibilidades')

    class Meta:
        db_table = 'disponibilidade'

    def __str__(self):
        return f"{self.id_voluntario.usuario.nome} - {self.dia_semana}"



class Atendimento(models.Model):
    STATUS_CHOICES = [
        ('agendado', 'Agendado'),
        ('realizado', 'Realizado'),
        ('cancelado', 'Cancelado'),
    ]
    
    id_atendimento = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data = models.DateField()
    horario = models.TimeField()
    tipo_atendimento = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='agendado')
    id_espaco_comunitario = models.ForeignKey(EspacoComunitario, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos')
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='atendimentos')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'atendimento'

    def __str__(self):
        return f"Atendimento {self.data} - {self.id_paciente.usuario.nome}"

class Participar(models.Model):
    id_participar = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_atendimento = models.ForeignKey(Atendimento, on_delete=models.CASCADE, related_name='participacoes')
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='participacoes')

    class Meta:
        db_table = 'participar'
        unique_together = ('id_atendimento', 'id_paciente')

    def __str__(self):
        return f"{self.id_paciente.usuario.nome} - {self.id_atendimento}"

class Acompanhamento(models.Model):
    id_acompanhamento = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    data_inicio = models.DateField()
    descricao = models.TextField(blank=True)
    situacao = models.CharField(max_length=50, blank=True)
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='acompanhamentos')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'acompanhamento'

    def __str__(self):
        return f"Acompanhamento {self.id_paciente.usuario.nome} - {self.data_inicio}"