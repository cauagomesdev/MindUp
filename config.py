import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:030406@localhost:5432/kanban"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)