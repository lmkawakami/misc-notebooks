## Criar e ativar o venv
python -m venv venv
cd venv
cd Scripts Scripts
activate
cd..
cd..

## Instalar pacotes
python -m pip install pytest
python -m pip install pytest-cov

## Rodar os testes e checar o coverage
python -m pytest --cov-report term-missing --cov=./app -vv

## Instalar e rodar o mutmut sem patch
python -m pip install mutmut
DEL .mutmut-cache
mutmut run --paths-to-mutate app
mutmut html
mutmut junitxml > mutmut.xml
python mutmut_score.py

## Rodar o mutmut com patch
python -m pip install bs4
python -m pip install pandas
python -m pip install lxml
python mutmut_enrich_html.py

## Instalar e rodar o cosmic-ray
pip install cosmic-ray
cosmic-ray new-config cosmic-ray-config.toml
[?] Top-level module path: app
[?] Test execution timeout (seconds): 10
[?] Test command: python -m pytest
-- MENU: Distributor --
  (0) http
  (1) local
[?] Enter menu selection: 1
cosmic-ray init cosmic-ray-config.toml cosmic-ray.sqlite
cosmic-ray --verbosity=INFO baseline cosmic-ray-config.toml
cosmic-ray exec cosmic-ray-config.toml cosmic-ray.sqlite
cr-report cosmic-ray.sqlite --show-pending
cr-html cosmic-ray.sqlite > cosmic-ray-report.html