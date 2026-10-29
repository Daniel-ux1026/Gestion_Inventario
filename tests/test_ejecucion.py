"""Lifecycle checks: exclusive launch, stale requests, acknowledgement and repeat stop."""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import detener
from ejecucion import DATA, ProjectRun, StopRequested, read_json, write_json


class LifecycleTests(unittest.TestCase):
    def setUp(self):
        DATA.mkdir(parents=True, exist_ok=True)
        self.temporary = tempfile.TemporaryDirectory(prefix="test-ejecucion-", dir=DATA)
        self.addCleanup(self.temporary.cleanup)
        self.run = ProjectRun(Path(self.temporary.name)).acquire()
        self.addCleanup(self.run.release)

    def test_second_launcher_cannot_replace_active_run(self):
        with self.assertRaisesRegex(RuntimeError, "ejecucion activa"):
            ProjectRun(self.run.data).acquire()
        self.assertEqual(self.run.identifier, read_json(self.run.state)["id"])

    def test_stale_stop_cannot_stop_a_new_run(self):
        write_json(self.run.request, {"id": "previous-run"})
        self.run.check_stop()
        self.run.finish()
        another = ProjectRun(self.run.data).acquire()
        try:
            another.check_stop()
        finally:
            another.finish()

    def test_shutdown_acknowledges_request_and_preserves_errors(self):
        write_json(self.run.request, {"id": self.run.identifier})
        with self.assertRaises(StopRequested):
            self.run.check_stop()
        self.run.finish(["No se pudo cerrar el servicio de prueba"])
        self.assertFalse(self.run.request.exists())
        state = read_json(self.run.state)
        self.assertEqual("stopped", state["status"])
        self.assertEqual(["No se pudo cerrar el servicio de prueba"], state["errors"])

    def test_stopping_again_is_harmless(self):
        self.run.finish()
        with patch.object(detener, "STATE", self.run.state), patch.object(detener, "REQUEST", self.run.request):
            self.assertEqual(0, detener.main())
        self.assertFalse(self.run.request.exists())

    def test_incomplete_shutdown_is_not_reported_as_success(self):
        self.run.finish(["Servicio de prueba pendiente"])
        with patch.object(detener, "STATE", self.run.state), patch("sys.stderr"):
            self.assertEqual(1, detener.main())


if __name__ == "__main__":
    unittest.main()
