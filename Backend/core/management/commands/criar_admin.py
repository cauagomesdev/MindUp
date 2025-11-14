from django.core.management.base import BaseCommand
from core.models import Usuario

class Command(BaseCommand):
    help = 'Cria usuário admin inicial para a MindUp'

    def handle(self, *args, **options):
        # Verifica se o admin já existe (pelo email)
        if not Usuario.objects.filter(email='admin@mindup.com').exists():
            # Use o 'create_superuser' que você definiu no CustomUserManager
            Usuario.objects.create_superuser( # type: ignore
                email='admin@mindup.com',
                nome='Admin MindUp', # Fornece o campo 'nome' obrigatório
                password='admin123'
                # 'nivel_acesso' já é definido como 'admin' pelo create_superuser
            )
            self.stdout.write(
                self.style.SUCCESS('Usuário admin criado com sucesso!')
            )
            self.stdout.write('Email: admin@mindup.com')
            self.stdout.write('Senha: admin123')
        else:
            self.stdout.write(
                self.style.WARNING('Usuário admin (admin@mindup.com) já existe.')
            )