from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
from urllib.parse import unquote, urlsplit

PORT = int(os.environ.get("PORT", "8231"))
DIST = Path(__file__).resolve().parent / "dist"


class AstroHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = unquote(urlsplit(path).path)
        relative = Path(path.lstrip("/"))
        candidate = DIST / relative

        if candidate.is_file():
            return str(candidate)

        html_candidate = candidate.with_suffix(".html")
        if html_candidate.is_file():
            return str(html_candidate)

        index_candidate = candidate / "index.html"
        if index_candidate.is_file():
            return str(index_candidate)

        return str(candidate)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")


os.chdir(DIST)

server = ThreadingHTTPServer(("127.0.0.1", PORT), AstroHandler)

print()
print("====================================")
print(f"Serveur demarre sur le port {PORT}")
print("====================================")
print()
print(f"URL: http://localhost:{PORT}")
print()
print("Routes:")
print(f"  http://localhost:{PORT}/accommodation")
print(f"  http://localhost:{PORT}/packages")
print(f"  http://localhost:{PORT}/booking")
print()

try:
    server.serve_forever()
except KeyboardInterrupt:
    print("\nServeur arrete.")
finally:
    server.server_close()
