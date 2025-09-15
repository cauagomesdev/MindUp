from db.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Paciente(db.Model):
    __tablename__ = "pacientes"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.Text, nullable=False)
    data_nascimento = db.Column(db.Date, nullable=False)
    comunidade = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "nome": self.nome,
            "email": self.email,
            "senha_hash": self.senha_hash,
            "data_nascimento": self.data_nascimento,
            "comunidade": self.comunidade
        }

class Profissional(db.Model):
    __tablename__ = "profissionais"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.Text, nullable=False)
    especialidade = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": str(self.id),
            "nome": self.nome,
            "email": self.email,
            "senha_hash": self.senha_hash,
            "especialidade": self.especialidade,
        }