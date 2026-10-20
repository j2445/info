"""Extract embedded portrait JPEG from assets/joy-hero-portrait.svg."""
from pathlib import Path
import base64
import re

root = Path(__file__).resolve().parents[1]
svg_path = root / "assets" / "joy-hero-portrait.svg"
out_dir = root / "site" / "assets" / "img"

svg = svg_path.read_text(encoding="utf-8")
m = re.search(r'href="data:image/jpeg;base64,([^"]+)"', svg)
if not m:
    raise SystemExit("Embedded JPEG not found")

b64 = m.group(1).lstrip("\ufeff")
data = base64.b64decode(b64)
out_dir.mkdir(parents=True, exist_ok=True)
full = out_dir / "joy-portrait.jpg"
full.write_bytes(data)
(out_dir / "joy-portrait-640.jpg").write_bytes(data)
print(f"Wrote {full} ({len(data)} bytes)")
