# assets/

Toate imaginile publicate de site.

```
assets/
  logo-sone-diesel.png      sigla (header, footer, favicon, JSON-LD "logo")
  og-cover.v1.jpg           previzualizarea de link (WhatsApp/Facebook), 1200×630
  brands/                   siglele mărcilor din marquee      → brands/README.md
  fonts/                    fonturile subsetate               → fonts/README.md
  hero/                     fundalul secțiunii hero           → hero/README.md
  servicii/                 pozele celor 3 carduri de servicii
  contact/                  poza de la stradă, lângă hartă
  _originals/               sursele la rezoluție mare — GITIGNORAT, nu se urcă
```

## Fotografii

Sursele stau în `_originals/photos/`, cu nume descriptive (`banc-proba-…`,
`tehnician-…`, `atelier-…`, `exterior-…`), 20 MP fiecare. Folderul e gitignorat:
în repo și pe server ajung doar variantele redimensionate de mai jos.

| Fișier publicat | Sursă | Unde apare |
|---|---|---|
| `servicii/injectoare.v1` | `masa-de-lucru-injectoare-scule` | cardul „Diagnosticare & reparații injectoare" |
| `servicii/pompe.v1` | `tehnician-repara-pompa` | cardul „Pompe de înaltă presiune" |
| `servicii/banc-proba.v1` | `testare-injector-software-banc` | cardul „Testare pe bancul de probă" |
| `contact/exterior-firma.v1` | `exterior-firma-panou-strada` | deasupra hărții, în Contact |
| `og-cover.v1.jpg` | `exterior-firma-panou-strada` | `og:image`, `twitter:image`, JSON-LD `image` |

Fiecare are `.webp` (servit implicit) și `.jpg` (rezervă). **Excepție:
`og-cover.v1.jpg` e doar JPEG** — scraperele de social media nu acceptă toate
WebP, iar o previzualizare ruptă e mai rea decât 79 KB în plus.

### Regenerare

```python
from PIL import Image
def banda(sursa, raport, sus, latime):
    im = Image.open('assets/_originals/photos/'+sursa); W,H = im.size
    ch = round(W/raport); top = round((H-ch)*sus)
    return im.crop((0, top, W, top+ch)).resize((latime, round(latime/raport)), Image.LANCZOS)

im = banda('masa-de-lucru-injectoare-scule.jpg', 2.25, 0.25, 900)
im.save('assets/servicii/injectoare.v1.jpg', quality=78, optimize=True, progressive=True)
im.save('assets/servicii/injectoare.v1.webp', quality=74, method=6)
```

Parametrii folosiți: servicii `raport=2.25, latime=900` (cutia din CSS e
`height:168px` pe toată lățimea cardului, iar `object-fit:cover` taie restul);
contact `2.37 / 900`; og `1.905 / 1200`. Pozițiile verticale (`sus`) sunt
`0.25` / `0.20` / `0.20` / `0.10` / `0.05` — alese comparând mai multe variante,
nu la întâmplare.

## Sigla și siglele de mărci

PNG quantizat pe 256 de culori. Dacă înlocuiești una:

```python
from PIL import Image
im = Image.open('assets/_originals/NUME.png').convert('RGBA')
im.thumbnail((400, 260), Image.LANCZOS)          # doar pentru siglele din brands/
im.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save('assets/NUME.png', optimize=True)
```

`logo-sone-diesel.png` rămâne la 925×417 — nu o micșora, e folosită și în
JSON-LD ca `logo`.

## Versionarea din nume

Sufixul `.v1` permite cache lung fără riscul ca vizitatorii să rămână cu varianta
veche. Dacă regenerezi un fișier cu alt conținut, incrementează la `.v2` **și în
`index.html`** — altfel schimbarea nu ajunge la cine a vizitat deja site-ul.

## Ce lipsește încă

Secțiunea „Înainte / după" are în continuare placeholder-e text. Niciuna dintre
cele 20 de fotografii nu arată starea „înainte" — un injector cocsat, o duză
înfundată. Sunt toate poze curate de atelier și echipament. Ca să se completeze
onest, e nevoie de perechi fotografiate anume: aceeași piesă înainte de curățare
și după reparație.
