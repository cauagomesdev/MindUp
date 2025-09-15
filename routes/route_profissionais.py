# Importa modelos
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import uuid
from db.extensions import db
from models import Profissional

profissionais_bp = Blueprint("profissionais", __name__)

# Rotas
@profissionais_bp.route("/listar", methods=["GET"])
def listar_profissionais():
    profissionais = Profissional.query.all()
    return {"profissionais": [p.to_dict() for p in profissionais]}


@profissionais_bp.route("/", methods=["POST"])
def cadastrar_profissional():
    data = request.json
    try:
        profissional = Profissional(
            id=uuid.uuid4(),
            nome=data["nome"],
            email=data["email"],
            senha_hash=generate_password_hash(data["senha"]),
            especialidade=data["especialidade"]
        )
        db.session.add(profissional)
        db.session.commit()
        return jsonify({"message": "Profissional cadastrado com sucesso!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400