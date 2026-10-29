import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import direccion_fija as bridge


class FixedAddressTests(unittest.TestCase):
    def setUp(self):
        bridge.DATA.mkdir(parents=True, exist_ok=True)
        directory = tempfile.TemporaryDirectory(prefix="test-direccion-", dir=bridge.DATA)
        self.addCleanup(directory.cleanup)
        self.settings = Path(directory.name) / "address.json"
        self.settings.write_text(json.dumps({"url":"https://lirio-tienda.daniel-olivos.workers.dev"}))
        self.patcher = patch.object(bridge, "SETTINGS", self.settings)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def test_fixed_address_requires_https_and_the_workers_domain(self):
        self.assertTrue(bridge.fixed_url().endswith(".workers.dev"))
        self.settings.write_text(json.dumps({"url":"https://workers.dev.ejemplo.com"}))
        with self.assertRaises(RuntimeError): bridge.fixed_url()

    def test_only_the_assigned_tunnel_can_become_an_origin(self):
        with patch.object(bridge, "_save") as save:
            with self.assertRaises(RuntimeError): bridge.connect("http://localhost:8080", "run-1")
            save.assert_not_called()

    def test_older_execution_cannot_disconnect_a_newer_one(self):
        with patch.object(bridge, "_wrangler", return_value='{"origin":"https://prueba.trycloudflare.com","runId":"new"}'), patch.object(bridge, "_save") as save:
            bridge.disconnect("old")
            save.assert_not_called()

    def test_current_execution_can_switch_to_maintenance(self):
        with patch.object(bridge, "_wrangler", return_value='{"origin":"https://prueba.trycloudflare.com","runId":"same"}'), patch.object(bridge, "_save") as save:
            bridge.disconnect("same")
            save.assert_called_once_with({"origin":None,"runId":"same"})
