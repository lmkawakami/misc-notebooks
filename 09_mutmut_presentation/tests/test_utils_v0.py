# from app.utils import pegar_conta, registrar_historico
# import unittest

# class TestContas(unittest.TestCase):
#     def setUp(self):
#         self.contas = {
#             "client_id_123": {
#                 "saldo": 1000,
#                 "historico": []
#             },
#             "client_id_abc": {
#                 "saldo": 500,
#                 "historico": []
#             }
#         }

#     def test_pegar_conta(self):
#         pegar_conta(self.contas, "client_id_123")
#         with self.assertRaises(Exception):
#             pegar_conta(self.contas, "cliente_inexistente")

#     def test_registrar_historico(self):
#         conta = self.contas["client_id_123"]
#         registro = {
#             "operacao": "deposito",
#             "valor": 100
#         }
#         registrar_historico(conta, registro)