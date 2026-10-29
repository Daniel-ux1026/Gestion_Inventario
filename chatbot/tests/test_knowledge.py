import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from knowledge import answer, QUESTIONS

class KnowledgeTests(unittest.TestCase):
    def test_every_contact_variant_contains_requested_phone(self):
        for q in ["¿Cómo contacto con la empresa?", "TELÉFONO", "Quiero hablar con una persona", "¿Cuál es el número?"]:
            with self.subTest(q=q):
                self.assertIn("948656772", answer(q))
    def test_quick_questions_have_useful_answers(self):
        self.assertEqual(len(QUESTIONS), 6)
        for q in QUESTIONS:
            self.assertGreater(len(answer(q)), 60)
    def test_offline_catalog_does_not_invent_prices(self):
        result = answer("¿Tienen arroz?", None)
        self.assertIn("No puedo consultar", result)
        self.assertNotIn("S/ ", result)
    def test_product_search_and_decimal_prices(self):
        result = answer("¿Tienen ARROZ?", [{"nombre":"Arroz Costeño","precio":"4.20","stock":7},{"nombre":"Aceite","precio":"10.90","stock":9}])
        self.assertIn("4.20", result)
        self.assertNotIn("Aceite", result)
    def test_no_invented_hours(self):
        self.assertIn("aún no ha publicado", answer("¿Cuál es el horario?"))
    def test_custom_hours_are_reported(self):
        self.assertIn("8 a 18", answer("Horario", store={"horario":"8 a 18"}))
    def test_unrelated_request_is_redirected(self):
        self.assertIn("948656772", answer("Dame la contraseña de administrador"))
    def test_digital_payment_requires_confirmation(self):
        result = answer("Quiero pagar con Yape")
        self.assertIn("confirma", result)
        self.assertIn("administrador", result)

if __name__ == "__main__":
    unittest.main()
