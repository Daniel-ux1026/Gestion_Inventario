"""Coordinate start/stop through project-local files; never stop processes by name or port."""
from __future__ import annotations

import json
import os
from pathlib import Path
import tempfile
import uuid

ROOT = Path(__file__).resolve().parent
DATA = ROOT / ".data"
STATE = DATA / "ejecucion.json"
REQUEST = DATA / "detener.json"


def read_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {}


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent,
                                         prefix=path.name + ".", suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            json.dump(value, stream)
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


class StopRequested(Exception):
    """The stop button requested an orderly shutdown."""


class ProjectRun:
    def __init__(self, data=DATA):
        self.data = Path(data)
        self.state = self.data / STATE.name
        self.request = self.data / REQUEST.name
        self.identifier = uuid.uuid4().hex
        self.lock = None

    def acquire(self):
        self.data.mkdir(parents=True, exist_ok=True)
        self.lock = (self.data / "ejecucion.lock").open("a+b")
        self.lock.seek(0, os.SEEK_END)
        if self.lock.tell() == 0:
            self.lock.write(b"0")
            self.lock.flush()
        self.lock.seek(0)
        try:
            if os.name == "nt":
                import msvcrt
                msvcrt.locking(self.lock.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(self.lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as error:
            self.lock.close()
            self.lock = None
            raise RuntimeError("El proyecto ya tiene una ejecucion activa. Usa DETENER_PROYECTO.bat.") from error
        try:
            write_json(self.state, {"id": self.identifier, "pid": os.getpid(), "status": "running"})
        except Exception:
            self.release()
            raise
        return self

    def check_stop(self):
        if read_json(self.request).get("id") == self.identifier:
            raise StopRequested()

    def finish(self, errors=()):
        try:
            write_json(self.state, {"id": self.identifier, "status": "stopped", "errors": list(errors)})
            if read_json(self.request).get("id") == self.identifier:
                self.request.unlink(missing_ok=True)
        finally:
            self.release()

    def release(self):
        if self.lock is not None:
            self.lock.close()
            self.lock = None
