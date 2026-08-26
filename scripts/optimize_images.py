"""One-off script: resize and recompress oversized portfolio screenshots in place.
Run once with `python scripts/optimize_images.py`, then delete or keep for future images."""
from PIL import Image
import os

MAX_WIDTH = 1200

TARGETS = [
    "images/airbnb.jpg",
    "images/foodprice.jpg",
    "images/pic03.png",
    "images/pic04.png",
    "images/pic05.png",
]

for path in TARGETS:
    img = Image.open(path)
    real_format = img.format  # 'JPEG' or 'PNG', based on actual content, not filename
    if img.width > MAX_WIDTH:
        new_height = round(img.height * (MAX_WIDTH / img.width))
        img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

    before = os.path.getsize(path)
    if real_format == "JPEG":
        img.convert("RGB").save(path, "JPEG", quality=80, optimize=True)
    else:
        img.save(path, "PNG", optimize=True)
    after = os.path.getsize(path)

    print(f"{path}: {img.width}x{img.height}, {before} -> {after} bytes")
