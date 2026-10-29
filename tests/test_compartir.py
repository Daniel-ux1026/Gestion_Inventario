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

    def test_running_process_with_lost_tunnel_is_reconnected(self):
        child = Mock()
        child.poll.return_value = None
        reconnect = Mock(return_value=(child, "https://nuevo.trycloudflare.com"))
        with patch.object(compartir, "pause", side_effect=[None, None, None, compartir.StopRequested]), \
             patch.object(compartir.iniciar, "ready", side_effect=[True, False] * 3):
            with self.assertRaises(compartir.StopRequested):
                compartir.monitor_tunnel(child, "https://perdido.trycloudflare.com", reconnect)
        reconnect.assert_called_once_with(child)

    def test_nonconsecutive_failures_do_not_replace_a_healthy_tunnel(self):
        child = Mock()
        child.poll.return_value = None
        reconnect = Mock()
        with patch.object(compartir, "pause", side_effect=[None] * 5 + [compartir.StopRequested]), \
             patch.object(compartir.iniciar, "ready", side_effect=[True, False, True, True] * 2 + [True, False]):
            with self.assertRaises(compartir.StopRequested):
                compartir.monitor_tunnel(child, "https://activo.trycloudflare.com", reconnect)
        reconnect.assert_not_called()

    def test_local_server_failure_does_not_rotate_the_tunnel(self):
        child = Mock()
        child.poll.return_value = None
        reconnect = Mock()
        with patch.object(compartir, "pause", side_effect=[None, None, None, compartir.StopRequested]), \
             patch.object(compartir.iniciar, "ready", return_value=False):
            with self.assertRaises(compartir.StopRequested):
                compartir.monitor_tunnel(child, "https://activo.trycloudflare.com", reconnect)
        reconnect.assert_not_called()

    def test_failed_reconnection_backs_off_and_can_be_stopped(self):
        child = Mock()
        child.poll.return_value = 1
        reconnect = Mock(side_effect=RuntimeError("sin red"))
        with patch.object(compartir, "pause", side_effect=[None, compartir.StopRequested]) as pause, \
             patch.object(compartir.iniciar, "ready") as ready:
            with self.assertRaises(compartir.StopRequested):
                compartir.monitor_tunnel(child, "https://anterior.trycloudflare.com", reconnect)
        self.assertEqual([((20,), {}), ((60,), {})], pause.call_args_list)
        ready.assert_not_called()
        reconnect.assert_called_once_with(child)

    def test_reconnection_recovers_after_a_temporary_network_failure(self):
        child, replacement = Mock(), Mock()
        child.poll.return_value = 1
        replacement.poll.return_value = None
        reconnect = Mock(side_effect=[RuntimeError("sin red"), (replacement, "https://nuevo.trycloudflare.com")])
        with patch.object(compartir, "pause", side_effect=[None, None, compartir.StopRequested]) as pause:
            with self.assertRaises(compartir.StopRequested):
                compartir.monitor_tunnel(child, "https://anterior.trycloudflare.com", reconnect)
        self.assertEqual([((20,), {}), ((60,), {}), ((20,), {})], pause.call_args_list)
        self.assertEqual([((child,), {}), ((None,), {})], reconnect.call_args_list)

    def test_replacing_a_tunnel_closes_only_its_own_process_and_log(self):
        child, other, log, other_log = Mock(), Mock(), Mock(), Mock()
        child.poll.return_value = None
        children = [("cloudflare", child, log), ("otro", other, other_log)]
        with patch.object(compartir.iniciar, "CHILDREN", children):
            compartir.stop_tunnel(child)
        child.terminate.assert_called_once()
        child.wait.assert_called_once_with(timeout=10)
        log.close.assert_called_once()
        other.terminate.assert_not_called()
        other_log.close.assert_not_called()
        self.assertEqual([("otro", other, other_log)], children)


if __name__ == "__main__":
    unittest.main()
