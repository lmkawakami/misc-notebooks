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
#         with self.assertRaises(Exception) as ctx:
#             sacar(self.contas, "client_id_123", 1100)
#         self.assertEqual("Saldo insuficiente", str(ctx.exception))
#         sacar(self.contas, "client_id_123", 1000)
#         self.assertEqual(self.contas["client_id_123"]["saldo"], 0)
#         self.assertEqual(len(self.contas["client_id_123"]["historico"]), 1)
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["operacao"], "saque")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["valor"], 1000)

#     def test_transferir(self):
#         with self.assertRaises(Exception) as ctx:
#             transferir(self.contas, "client_id_123", "client_id_abc", 1100)
#         self.assertEqual("Saldo insuficiente", str(ctx.exception))
#         transferir(self.contas, "client_id_123", "client_id_abc", 1000)
#         self.assertEqual(self.contas["client_id_123"]["saldo"], 0)
#         self.assertEqual(self.contas["client_id_abc"]["saldo"], 1500)
#         self.assertEqual(len(self.contas["client_id_123"]["historico"]), 1)
#         self.assertEqual(len(self.contas["client_id_abc"]["historico"]), 1)
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["operacao"], "transferencia")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["conta_origem"], "client_id_123")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["conta_destino"], "client_id_abc")
#         self.assertEqual(self.contas["client_id_123"]["historico"][0]["valor"], 1000)
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["operacao"], "transferencia")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["conta_origem"], "client_id_123")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["conta_destino"], "client_id_abc")
#         self.assertEqual(self.contas["client_id_abc"]["historico"][0]["valor"], 1000)
