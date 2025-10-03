from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from core.models import Usuario

class Command(BaseCommand):
    help = 'Cria usuário admin inicial'

    def handle(self, *args, **options):
        try:
            admin_user = Usuario.objects.get(nome_login='admin')
            self.stdout.write(
                self.style.WARNING('Usuário admin já existe.')
            )
        except Usuario.DoesNotExist:
            Usuario.objects.create(
                nome_login='admin',
                email='admin@mindup.com',
                senha_hash=make_password('admin123'),
                nivel_acesso='admin'
            )
            self.stdout.write(
                self.style.SUCCESS('Usuário admin criado com sucesso!')
            )
            self.stdout.write('Login: admin')
            self.stdout.write('Senha: admin123')