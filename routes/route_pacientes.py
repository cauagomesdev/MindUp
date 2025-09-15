from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import uuid
from db.extensions import db
from models import Paciente

pacientes_bp = Blueprint("pacientes", __name__)

# Rotas
@pacientes_bp.route("/listar", methods=["GET"])
def listar_pacientes():
    pacientes = Paciente.query.all()
    return {"pacientes": [p.to_dict() for p in pacientes]}


@pacientes_bp.route("/", methods=["POST"])
def cadastrar_paciente():
    data = request.json
    try:
        paciente = Paciente(
            id=uuid.uuid4(),
            nome=data["nome"],
            email=data["email"],
            senha_hash=generate_password_hash(data["senha"]),
            data_nascimento=data["data_nascimento"],
            comunidade=data["comunidade"]
        )
        db.session.add(paciente)
        db.session.commit()
        return jsonify({"message": "Paciente cadastrado com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400