from behave   import given, when, then
from hamcrest import assert_that, equal_to
import os

SITE_HTML = "index.html"
ARQUIVO_A = "Cnaes.zip"
ARQUIVO_B = "Empresas0.zip"
ARQUIVO_C = "Empresas1.zip"

REQ_SITE = "GET site/index.html"
REQ_HEAD_ARQ_A = "HEAD site/Cnaes.zip"
REQ_HEAD_ARQ_B = "HEAD site/Empresas0.zip"
REQ_HEAD_ARQ_C = "HEAD site/Empresas1.zip"
REQ_GET_ARQ_A = "GET site/Cnaes.zip"
REQ_GET_ARQ_B = "GET site/Empresas0.zip"
REQ_GET_ARQ_C = "GET site/Empresas1.zip"

ARQUIVO_A_S3 = "path/Cnaes.csv"
ARQUIVO_B_S3 = "path/Empresas0.csv"
ARQUIVO_C_S3 = "path/Empresas1.csv"

ESTADO_DESATUALIZADO = {}
ESTADO_INCOMPLETO = {}
ESTADO_BAIXADO = {}
ESTADO_TRANSFERIDO = {}

@given('que o site está "<estado_do_site>"')
def definir_status_site(context, estado_do_site):
    # disponivel, indisponivel
    servidor = object()
    if estado_do_site == "disponivel":
        context.arquivos_servidos = [SITE_HTML]
    elif estado_do_site == "indisponivel":
        context.arquivos_servidos = []


@given('que os arquivos estão "<estado_dos_arquivos>"')
def definir_status_arquivos(context, estado_dos_arquivos):
    # disponiveis, indisponiveis, parcialmente_disponiveis, faltantes_disponiveis
    estado = estado_dos_arquivos
    if estado == "disponiveis":
        context.arquivos_servidos.append(ARQUIVO_A)
        context.arquivos_servidos.append(ARQUIVO_B)
        context.arquivos_servidos.append(ARQUIVO_C)
    elif estado == "indisponiveis":
        return
    elif estado == "parcialmente_disponiveis":
        context.arquivos_servidos.append(ARQUIVO_A)
    elif estado == "faltantes_disponiveis":
        context.arquivos_servidos.append(ARQUIVO_B)
        context.arquivos_servidos.append(ARQUIVO_C)

@given('que a ultima execução tenha "<estado_do_processamento>"')
def definir_status_ultima_exec(context, estado_do_processamento):
    # inexistente, desatualizado, incompleto, baixado, transferido
    estado = estado_do_processamento
    if estado == "inexistente":
        return
    elif estado == "desatualizado":
        context.estado_anterior = ESTADO_DESATUALIZADO
    elif estado == "incompleto":
        context.estado_anterior = ESTADO_INCOMPLETO
    elif estado == "baixado":
        context.estado_anterior = ESTADO_BAIXADO
    elif estado == "transferido":
        context.estado_anterior = ESTADO_TRANSFERIDO

@when('eu executo o consumidorbatch')
def executar_o_consumidorbatch(context):
    _deletar_ps()
    _limpar_s3()
    server = object
    server.enqueue(context.arquivos_servidos)
    server.start()
    _salvar_ps_estado_anterior(context.estado_anterior)
    # main()
    server.stop()
    context.requisicoes_feitas = server.requests_list()
    context.s3_uploads = {
        ARQUIVO_A: _esta_no_s3(ARQUIVO_A_S3),
        ARQUIVO_B: _esta_no_s3(ARQUIVO_B_S3),
        ARQUIVO_C: _esta_no_s3(ARQUIVO_C_S3),
    }
    context.estado_final = _recuperar_ps_estado_final()

@then('a requisição de "<requisicoes>" deve ser feita')
def conferir_requisicoes(context, requisicoes):
    # nada, site, site_e_todos_arquivos ,site_e_arquvis_faltantes
    if requisicoes == "nada":
        assert context.requisicoes_feitas == []
    elif requisicoes == "site":
        assert context.requisicoes_feitas == [REQ_SITE]
    elif requisicoes == "site_e_todos_arquivos":
        assert context.requisicoes_feitas == [REQ_SITE, REQ_HEAD_ARQ_A, REQ_GET_ARQ_A, REQ_HEAD_ARQ_B, REQ_GET_ARQ_B, REQ_HEAD_ARQ_C, REQ_GET_ARQ_C]
    elif requisicoes == "site_e_arquvis_faltantes":
        assert context.requisicoes_feitas == [REQ_SITE, REQ_HEAD_ARQ_B, REQ_GET_ARQ_B, REQ_HEAD_ARQ_C, REQ_GET_ARQ_C]


@then('"<upload_s3>" deve ser salvo no bucket')
def conferir_arquivos_s3(context, upload_s3):
    # nada, todos_os_arquivos, arquivos_sem_erro, os_arquivos_faltantes
    uploads = context.s3_uploads
    if upload_s3 == "nada":
        assert uploads[ARQUIVO_A] == False
        assert uploads[ARQUIVO_B] == False
        assert uploads[ARQUIVO_C] == False
    if upload_s3 == "todos_os_arquivos":
        assert uploads[ARQUIVO_A] == True
        assert uploads[ARQUIVO_B] == True
        assert uploads[ARQUIVO_C] == True
    elif upload_s3 == "arquivos_sem_erro":
        assert uploads[ARQUIVO_A] == True
        assert uploads[ARQUIVO_B] == False
        assert uploads[ARQUIVO_C] == False
    elif upload_s3 == "os_arquivos_faltantes":
        assert uploads[ARQUIVO_A] == False
        assert uploads[ARQUIVO_B] == True
        assert uploads[ARQUIVO_C] == True

@then('o job do glue deve "<condicao_glue_esperada>"')
def conferir_exec_glue(context, condicao_glue_esperada):
    # ser_chamado, nao_ser_chamado
    pass

@then('o estado salvo no PS deve ser "<estado_final>"')
def conferir_estado_final_salvo(context, estado_final):
    # baixado, incompleto, transferido
    if estado_final == "baixado":
        assert context.estado_final == ESTADO_BAIXADO
    elif estado_final == "incompleto":
        assert context.estado_final == ESTADO_INCOMPLETO
    elif estado_final == "transferido":
        assert context.estado_final == ESTADO_TRANSFERIDO

def _salvar_ps_estado_anterior(arquivo_payload):
    pass

def _recuperar_ps_estado_final():
    pass

def _esta_no_s3(arquivo):
    pass

def _deletar_ps():
    pass

def _limpar_s3():
    pass

