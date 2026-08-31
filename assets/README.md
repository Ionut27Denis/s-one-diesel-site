# assets/

Imaginile publicate de site. Toate referințele din `index.html` (header, footer,
favicon, `og:image`, JSON-LD) indică spre `logo-sone-diesel.png`.

## Optimizare

Fișierele de aici sunt variantele **optimizate** (PNG quantizat pe 256 de culori),
nu originalele. Originalele la rezoluție mare stau în `_originals/`, care e
`.gitignore`-uit și **nu se urcă pe server**.

Dacă înlocuiești o imagine, pune originalul în `_originals/` și rulează:

```bash
python -c "
from PIL import Image
im = Image.open('assets/_originals/NUME.png').convert('RGBA')
im.thumbnail((400, 260), Image.LANCZOS)          # doar pentru siglele din brands/
im.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save('assets/NUME.png', optimize=True)
"
```

Sigla principală (`logo-sone-diesel.png`) se păstrează la 925×417 — e folosită și
ca `og:image` la partajarea pe rețele sociale, deci nu o micșora.
