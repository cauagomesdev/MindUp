from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import Paciente, Profissional

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login/paciente", methods=["POST"])
def login_paciente():
    data = request.json
    paciente = Paciente.query.filter_by(email=data.get("email")).first()
    if paciente and check_password_hash(paciente.senha_hash, data.get("senha")):
        return jsonify({"message": "Login realizado com sucesso!", "id": str(paciente.id), "nome": paciente.nome}), 200
    return jsonify({"error": "Email ou senha inválidos"}), 401

@auth_bp.route("/login/profissional", methods=["POST"])
def login_profissional():
    data = request.json
    profissional = Profissional.query.filter_by(email=data.get("email")).first()
    if profissional and check_password_hash(profissional.senha_hash, data.get("senha")):
        return jsonify({"message": "Login realizado com sucesso!", "id": str(profissional.id), "nome": profissional.nome}), 200
    return jsonify({"error": "Email ou senha inválidos"}), 401