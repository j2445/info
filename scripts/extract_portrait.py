"""Extract embedded portrait JPEG from assets/joy-hero-portrait.svg."""
from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]
svg_path = root / "assets" / "joy-hero-portrait.svg"
site_img = root / "site" / "assets" / "img"
readme_img = root / "assets" / "joy-portrait.jpg"

svg = svg_path.read_text(encoding="utf-8")
m = re.search(r'href="data:image/jpeg;base64,([^"]+)"', svg)
if not m:
    raise SystemExit("Embedded JPEG not found")

b64 = m.group(1).lstrip("\ufeff")
data = base64.b64decode(b64)
site_img.mkdir(parents=True, exist_ok=True)
for path in (site_img / "joy-portrait.jpg", site_img / "joy-portrait-640.jpg", readme_img):
    path.write_bytes(data)
    print(f"Wrote {path} ({len(data)} bytes)")
