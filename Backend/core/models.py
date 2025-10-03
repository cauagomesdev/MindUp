from django.db import models
import uuid

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
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha_hash = models.CharField(max_length=255)
    endereco = models.CharField(max_length=200, blank=True)
    id_comunidade = models.ForeignKey(Comunidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='pacientes')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'paciente'

    def __str__(self):
        return self.nome

class Colaborador(models.Model):
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
    id_colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, related_name='disponibilidades')

    class Meta:
        db_table = 'disponibilidade'

    def __str__(self):
        return f"{self.id_colaborador.nome} - {self.dia_semana}"

class Voluntario(models.Model):
    id_voluntario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=100)
    contato = models.CharField(max_length=20, blank=True)
    universidade = models.CharField(max_length=100, blank=True)
    especialidade = models.CharField(max_length=100, blank=True)
    id_colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, related_name='voluntarios')

    class Meta:
        db_table = 'voluntario'

    def __str__(self):
        return self.nome

class Usuario(models.Model):
    NIVEL_ACESSO_CHOICES = [
        ('admin', 'Administrador'),
        ('colaborador', 'Colaborador'),
        ('voluntario', 'Voluntário'),
        ('paciente', 'Paciente'),
    ]
    
    id_usuario = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome_login = models.CharField(max_length=50, unique=True)
    senha_hash = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    nivel_acesso = models.CharField(max_length=20, choices=NIVEL_ACESSO_CHOICES, default='paciente')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.nome_login

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
        return f"Atendimento {self.data} - {self.id_paciente.nome}"

class Participar(models.Model):
    id_participar = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_atendimento = models.ForeignKey(Atendimento, on_delete=models.CASCADE, related_name='participacoes')
    id_paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='participacoes')

    class Meta:
        db_table = 'participar'
        unique_together = ('id_atendimento', 'id_paciente')

    def __str__(self):
        return f"{self.id_paciente.nome} - {self.id_atendimento}"

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
        return f"Acompanhamento {self.id_paciente.nome} - {self.data_inicio}"