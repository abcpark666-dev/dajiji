"""Regenerate launch images from the original 大肌肌 icon SVG.

Run after changing resources/icon.svg. Requires Pillow only for regeneration;
the generated PNGs are committed and the app build does not need Python.
"""

from pathlib import Path
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ICON = ROOT / "resources" / "icon.svg"
RES = ROOT / "android" / "app" / "src" / "main" / "res"
IOS_SPLASH = ROOT / "ios" / "App" / "App" / "Assets.xcassets" / "Splash.imageset"
WATCH_ICON = ROOT / "ios" / "App" / "Watch" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon-1024.png"


def icon_image(size: int) -> Image.Image:
    tree = ET.parse(ICON)
    root = tree.getroot()
    ns = "{http://www.w3.org/2000/svg}"
    image = Image.new("RGB", (512, 512), "#211a42")
    draw = ImageDraw.Draw(image)
    for rect in root.find(f"{ns}g"):
        x, y = int(rect.get("x")), int(rect.get("y"))
        w, h = int(rect.get("width")), int(rect.get("height"))
        draw.rectangle((x, y, x + w - 1, y + h - 1), fill="#ff8a58")
    return image.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    files = sorted(RES.glob("drawable*/splash.png")) + sorted(IOS_SPLASH.glob("*.png"))
    for path in files:
        with Image.open(path) as existing:
            width, height = existing.size
        canvas = Image.new("RGB", (width, height), "#211a42")
        glyph_size = round(min(width, height) * 0.36)
        glyph = icon_image(glyph_size)
        canvas.paste(glyph, ((width - glyph_size) // 2, (height - glyph_size) // 2))
        canvas.save(path, optimize=True)
    if WATCH_ICON.exists():
        icon_image(1024).save(WATCH_ICON, optimize=True)
    print(f"Wrote {len(files)} splash images and {int(WATCH_ICON.exists())} watch icon")


if __name__ == "__main__":
    main()
