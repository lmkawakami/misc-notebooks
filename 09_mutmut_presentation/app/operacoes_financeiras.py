# contas = {
#     "client_id_123": {
#         "saldo": 1000,
#         "historico": []
#     },
#     "client_id_abc": {
#         "saldo": 500,
#         "historico": []
#     }
# }

from app.utils import pegar_conta, registrar_historico

def depositar(contas, client_id, valor):
    conta = pegar_conta(contas, client_id)
    conta["saldo"] += valor
    registrar_historico(conta, {
        "operacao": "deposito",
        "valor": valor
    })

def sacar(contas, client_id, valor):
    conta = pegar_conta(contas, client_id)
    if conta["saldo"] < valor:
        raise Exception("Saldo insuficiente")
    conta["saldo"] -= valor
    registrar_historico(conta, {
        "operacao": "saque",
        "valor": valor
    })

def transferir(contas, client_id_origem, client_id_destino, valor):
    conta_origem = pegar_conta(contas, client_id_origem)
    conta_destino = pegar_conta(contas, client_id_destino)
    if conta_origem["saldo"] < valor:
        raise Exception("Saldo insuficiente")
    conta_origem["saldo"] -= valor
    conta_destino["saldo"] += valor
    registro = {
        "operacao": "transferencia",
        "conta_origem": client_id_origem,
        "conta_destino": client_id_destino,
        "valor": valor
    }
    registrar_historico(conta_origem, registro)
    registrar_historico(conta_destino, registro)