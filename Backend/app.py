from flask import Flask
from config import Config
from db.extensions import db
from flask_cors import CORS
from routes.route_profissionais import profissionais_bp
from routes.route_pacientes import pacientes_bp
from routes.route_auth import auth_bp

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)

app.register_blueprint(profissionais_bp, url_prefix="/profissionais")
app.register_blueprint(pacientes_bp, url_prefix="/pacientes")
app.register_blueprint(auth_bp, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True)