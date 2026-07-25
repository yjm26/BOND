from PIL import Image
from pathlib import Path

root = Path(r"C:\Users\rival\src\BOND\sketches\shots")
im = Image.open(root / "landing-full.png")
w, h = im.size
print("size", w, h)

crops = {
    "01-hero.png": (0, 0, w, 1000),
    "02-who.png": (0, 980, w, 1850),
    "03-lifecycle.png": (0, 1680, w, 2520),
    "04-endings-close.png": (0, 2450, w, h),
}
for name, box in crops.items():
    im.crop(box).save(root / name)
    print("wrote", name, box)
