# from app.operacoes_financeiras import depositar, sacar, transferir
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

#     def test_depositar(self):
#         depositar(self.contas, "client_id_123", 100)
#         self.assertEqual(self.contas["client_id_123"]["saldo"], 1100)
#         self.assertEqual(len(self.contas["client_id_123"]["historico"]), 1)
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["operacao"], "deposito")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["valor"], 100)

#     def test_sacar(self):
#         with self.assertRaises(Exception):
#             sacar(self.contas, "client_id_123", 1100)
#         sacar(self.contas, "client_id_123", 100)
#         self.assertEqual(self.contas["client_id_123"]["saldo"], 900)
#         self.assertEqual(len(self.contas["client_id_123"]["historico"]), 1)
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["operacao"], "saque")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["valor"], 100)

#     def test_transferir(self):
#         with self.assertRaises(Exception):
#             transferir(self.contas, "client_id_123", "client_id_abc", 1100)
#         transferir(self.contas, "client_id_123", "client_id_abc", 100)
#         self.assertEqual(self.contas["client_id_123"]["saldo"], 900)
#         self.assertEqual(self.contas["client_id_abc"]["saldo"], 600)
#         self.assertEqual(len(self.contas["client_id_123"]["historico"]), 1)
#         self.assertEqual(len(self.contas["client_id_abc"]["historico"]), 1)
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["operacao"], "transferencia")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["conta_origem"], "client_id_123")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["conta_destino"], "client_id_abc")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["valor"], 100)
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["operacao"], "transferencia")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["conta_origem"], "client_id_123")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["conta_destino"], "client_id_abc")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["valor"], 100)
