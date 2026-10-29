"""Preview settings must preserve secrets and accept only Cloudflare's generated hostnames."""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, Mock

import compartir


class SharingTests(unittest.TestCase):
    def setUp(self):
        compartir.DATA.mkdir(parents=True, exist_ok=True)
        directory = tempfile.TemporaryDirectory(prefix="test-publicar-", dir=compartir.DATA)
        self.addCleanup(directory.cleanup)
        self.path = Path(directory.name)

    def test_new_settings_use_distinct_random_credentials(self):
        with patch.object(compartir, "ENV_FILE", self.path / "preview.env"):
            first = compartir.load_settings()
            second = compartir.load_settings()
        self.assertNotEqual(first["JWT_SECRET"], second["JWT_SECRET"])
        self.assertNotEqual(first["DB_PASSWORD"], first["MYSQL_ROOT_PASSWORD"])
        self.assertGreaterEqual(len(first["ADMIN_PASSWORD"]), 24)
        self.assertNotIn(first["ADMIN_PASSWORD"], ("LirioDemo2026!", "ClienteDemo2026!"))

    def test_settings_survive_restart_without_replacing_passwords(self):
        with patch.object(compartir, "ENV_FILE", self.path / "preview.env"), \
             patch.object(compartir, "ADMIN_FILE", self.path / "admin.txt"):
            original = compartir.load_settings()
            compartir.save_settings(original)
            self.assertEqual(original, compartir.load_settings())

    def test_only_official_quick_tunnel_urls_are_accepted(self):
        valid = "https://ejemplo-tienda.trycloudflare.com"
        self.assertEqual([valid], compartir.TUNNEL_PATTERN.findall("| " + valid + " |"))
        self.assertEqual([], compartir.TUNNEL_PATTERN.findall(valid + ".ejemplo.com"))
        self.assertEqual([], compartir.TUNNEL_PATTERN.findall("http://ejemplo-tienda.trycloudflare.com"))

    def test_temporary_cloudflare_failure_is_retried(self):
        child = Mock()
        child.poll.return_value = 1
        with patch.object(compartir, "DATA", self.path), patch.object(compartir.iniciar, "check_stop"), \
             patch.object(compartir.iniciar, "start", return_value=child) as start, \
             patch.object(compartir, "tunnel_url", side_effect=[RuntimeError("timeout"), "https://nuevo.trycloudflare.com"]), \
             patch.object(compartir.time, "sleep"):
            _, url = compartir.open_tunnel("cloudflared", self.path / "config.yml")
        self.assertEqual("https://nuevo.trycloudflare.com", url)
        self.assertEqual(2, start.call_count)

    def test_stop_request_is_not_retried(self):
        with patch.object(compartir.iniciar, "check_stop", side_effect=compartir.StopRequested), \
             patch.object(compartir.iniciar, "start") as start:
            with self.assertRaises(compartir.StopRequested):
                compartir.open_tunnel("cloudflared", self.path / "config.yml")
            start.assert_not_called()


if __name__ == "__main__":
    unittest.main()
