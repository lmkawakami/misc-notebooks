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

def pegar_conta(contas, client_id):
    conta = contas.get(client_id)
    if conta is None:
        raise Exception("Conta inexistente")
    return conta

def registrar_historico(conta, historico):
    conta["historico"].append(historico)