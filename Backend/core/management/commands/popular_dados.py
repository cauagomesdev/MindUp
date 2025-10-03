from django.core.management.base import BaseCommand
from core.models import Comunidade

class Command(BaseCommand):
    help = 'Popula banco com dados iniciais'

    def handle(self, *args, **options):
        # Criar comunidades iniciais
        comunidades = [
            {
                'nome': 'Comunidade Vila Nova',
                'localizacao': 'Zona Norte - São Paulo',
                'descricao': 'Comunidade focada em atendimento psicológico familiar'
            },
            {
                'nome': 'Centro Comunitário Esperança',
                'localizacao': 'Zona Sul - São Paulo', 
                'descricao': 'Atendimento especializado em jovens e adolescentes'
            },
            {
                'nome': 'Associação Vida Plena',
                'localizacao': 'Zona Leste - São Paulo',
                'descricao': 'Foco em terapia comunitária e grupos de apoio'
            }
        ]

        for com_data in comunidades:
            comunidade, created = Comunidade.objects.get_or_create(
                nome=com_data['nome'],
                defaults={
                    'localizacao': com_data['localizacao'],
                    'descricao': com_data['descricao']
                }
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Comunidade "{comunidade.nome}" criada!')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Comunidade "{comunidade.nome}" já existe.')
                )

        self.stdout.write(
            self.style.SUCCESS('Dados iniciais carregados com sucesso!')
        )