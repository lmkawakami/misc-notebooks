import wget
import os
from zipfile import ZipFile

def process_batch_request():

    def run():
        url_base = "https://dadosabertos.rfb.gov.br/CNPJ/"
        parameters = get_parameters()
        files_to_be_downloaded = get_files_to_be_downloaded(parameters['files'], url_base)

        download_folder = "/tmp"
        download_path = create_download_folder_path(download_folder)
        download_files(files_to_be_downloaded[24:26], download_path)

        return "OK", 200

    class CrapFile():
        name: str
        status: str
        url: str

        def __init__(self, file, base_url) -> None:
            file_name, file_info = list(file.items())[0]
            file_status = file_info['status']
            self.name = file_name
            self.status = file_status
            self.url = base_url + file_name

    def get_parameters():
        return {
            "date": "2023-01-19 15:07:10",
            "files": [
                { "Cnaes.zip": { "status": "pending" } },
                { "Empresas0.zip": { "status": "pending" } },
                { "Empresas1.zip": { "status": "pending" } },
                { "Empresas2.zip": { "status": "pending" } },
                { "Empresas3.zip": { "status": "pending" } },
                { "Empresas4.zip": { "status": "pending" } },
                { "Empresas5.zip": { "status": "pending" } },
                { "Empresas6.zip": { "status": "pending" } },
                { "Empresas7.zip": { "status": "pending" } },
                { "Empresas8.zip": { "status": "pending" } },
                { "Empresas9.zip": { "status": "pending" } },
                { "Estabelecimentos0.zip": { "status": "pending" } },
                { "Estabelecimentos1.zip": { "status": "pending" } },
                { "Estabelecimentos2.zip": { "status": "pending" } },
                { "Estabelecimentos3.zip": { "status": "pending" } },
                { "Estabelecimentos4.zip": { "status": "pending" } },
                { "Estabelecimentos5.zip": { "status": "pending" } },
                { "Estabelecimentos6.zip": { "status": "pending" } },
                { "Estabelecimentos7.zip": { "status": "pending" } },
                { "Estabelecimentos8.zip": { "status": "pending" } },
                { "Estabelecimentos9.zip": { "status": "pending" } },
                { "Motivos.zip": { "status": "pending" } },
                { "Municipios.zip": { "status": "pending" } },
                { "Naturezas.zip": { "status": "pending" } },
                { "Paises.zip": { "status": "pending" } },
                { "Qualificacoes.zip": { "status": "pending" } },
                { "Simples.zip": { "status": "pending" } },
                { "Socios0.zip": { "status": "pending" } },
                { "Socios1.zip": { "status": "pending" } },
                { "Socios2.zip": { "status": "pending" } },
                { "Socios3.zip": { "status": "pending" } },
                { "Socios4.zip": { "status": "pending" } },
                { "Socios5.zip": { "status": "pending" } },
                { "Socios6.zip": { "status": "pending" } },
                { "Socios7.zip": { "status": "pending" } },
                { "Socios8.zip": { "status": "pending" } },
                { "Socios9.zip": { "status": "pending" } },
            ],
            "quantity_file": 37
        }

    def create_download_folder_path(dir="/tmp"):
        print("create_download_folder_path")
    run()


process_batch_request()
print("done")