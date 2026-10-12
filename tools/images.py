"""Kuvien optimointi: assets/**/*.png|jpg -> .jpg (laatu 82) + .webp + @800.webp, ja mitat assets/images.json:iin.

Ajo:  npm run images   (vaatii Python 3 + Pillow: pip install pillow)
- PNG muutetaan JPG:ksi (alkuperäinen PNG poistetaan, paitsi logo-kansiossa).
- Olemassa olevaa JPG:tä ei pakata uudelleen (paitsi jos leveys > 2400 px).
- assets/logo/, assets/favicon/ ja assets/og/ jätetään rauhaan.
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SKIP_DIRS = {"logo", "favicon", "og"}
MAX_W = 2400
manifest = {}

for src in sorted(ASSETS.rglob("*")):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue
    rel = src.relative_to(ASSETS)
    if rel.parts[0] in SKIP_DIRS or src.stem.endswith("@800"):
        continue
    im = Image.open(src)
    im.load()
    if im.mode not in ("RGB",):
        bg = Image.new("RGB", im.size, (235, 229, 220))
        bg.paste(im, mask=im.split()[-1] if im.mode in ("RGBA", "LA") else None)
        im = bg
    resized = im.width > MAX_W
    if resized:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    jpg = src.with_suffix(".jpg")
    # JPG pakataan uudelleen vain, jos lähde on PNG/JPEG tai kuvaa pienennettiin (ei laatuhäviötä joka ajolla)
    if src.suffix.lower() != ".jpg" or resized:
        im.save(jpg, "JPEG", quality=82, optimize=True, progressive=True)
        if src != jpg:
            src.unlink()
    im.save(jpg.with_suffix(".webp"), "WEBP", quality=78, method=6)
    if im.width > 1000:
        small = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
        small.save(jpg.with_name(jpg.stem + "@800.webp"), "WEBP", quality=78, method=6)
    manifest[str(jpg.relative_to(ASSETS))] = {"width": im.width, "height": im.height}
    print("ok", jpg.relative_to(ASSETS), f"{im.width}x{im.height}")

(ASSETS / "images.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print(f"{len(manifest)} kuvaa, mitat: assets/images.json")
sys.exit(0)
