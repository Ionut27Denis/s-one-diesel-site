# assets/hero/

Poza de fundal a secțiunii hero. Sursa e
`assets/_originals/photos/sesiune-anterioara/IMG_7672.jpg` (3648×4864, 17,7 MP) —
folderul `_originals/` e `.gitignore`-uit și nu se urcă pe server.

## Aranjamentul: poza nu ocupă toată lățimea

Pe **ecrane late**, poza ocupă **80% din lățime, lipită dreapta**
(`.hero__bg { left: 20% }`). Fâșia din stânga rămâne fundalul închis al paginii,
deci titlul stă practic pe plat. Pe **ecrane înalte** (mobil) poza revine la tot
ecranul, fiindcă nu e loc pentru două zone.

Pragul e `(min-aspect-ratio: 1/1)`, același cu al lui `<source media=…>` din
`index.html`, ca tăietura lată să meargă mereu cu acest aranjament.

| Fișier | Dimensiune | Când se folosește |
|---|---|---|
| `hero-banc-injector-wide.v5.webp` | 1500×1000 (~53 KB) | fereastră lată — cutia e 80% din lățime, deci raport ~1,5 |
| `hero-banc-injector-tall.v5.webp` | 1080×1440 (~62 KB) | fereastră înaltă — poza pe tot ecranul |

Fiecare are și `.jpg` ca rezervă. **Browserul descarcă un singur fișier.**

## Regenerare

```python
from PIL import Image
src = Image.open('assets/_originals/photos/sesiune-anterioara/IMG_7672.jpg')
W, H = src.size

# Lat: raportul cutiei (80% latime x toata inaltimea) e ~1.5. Taietura la 30% de sus.
ch = round(W / 1.5)
wide = src.crop((0, round((H-ch)*0.30), W, round((H-ch)*0.30)+ch)).resize((1500, 1000), Image.LANCZOS)

# Inalt: raport 3:4 pentru mobil.
chh = round(W / 0.75)
tall = src.crop((0, round((H-chh)*0.20), W, round((H-chh)*0.20)+chh)).resize((1080, 1440), Image.LANCZOS)

for name, im in (('hero-banc-injector-wide.v5', wide), ('hero-banc-injector-tall.v5', tall)):
    im.save(f'assets/hero/{name}.jpg',  'JPEG', quality=78, optimize=True, progressive=True)
    im.save(f'assets/hero/{name}.webp', 'WEBP', quality=74, method=6)
```

## Contrastul textului — de remăsurat la orice schimbare

Overlay-ul are **două forme**:

- ecrane late → gradient orizontal, cu **platou opac până la 68%** din lățime,
  apoi cădere rapidă la 0,22;
- ecrane înalte → gradient vertical care nu coboară sub 0,82, fiindcă acolo
  textul se întinde pe toată lățimea.

**Platoul până la 68% nu e arbitrar și nu-l scurta fără să remăsori.** Coloana de
text are lățime fixă (`max-width: 900px`), deci pe un ecran mai îngust se întinde
proporțional mai spre dreapta, unde poza e luminoasă. Cu un gradient care se
limpezea de la 45%, contrastul măsura 6,28:1 la 1920px dar cădea la **4,10:1 la
1440px** și **2,57:1 la 1280px** — sub pragul de 4,5:1. Verifică întotdeauna la
**1280px**, nu doar la rezoluția ta.

Valorile cu poza și gradientul actuale (cel mai slab caz, 1280×646): **5,69:1**.

| | titlu (prag 3,0) | text lead (prag 4,5) |
|---|---|---|
| Desktop 1920×1006 | 10,09:1 | 6,28:1 |
| Desktop 1280×646 (cel mai slab) | — | 5,69:1 |
| Mobil 390×770 | 10,82:1 | 6,74:1 |

Procedura: compune poza cu gradientul la mai multe lățimi (1280, 1440, 1920,
2560), ia cel mai deschis pixel din zona textului și verifică raportul față de
`#b9c1c9` — trebuie ≥ 4,5:1 la toate.

## Ce face o poză bună de hero aici

Stânga fără detalii importante (e sub partea opacă), dreapta cu subiectul. Toate
cele 20 de fotografii au fost compuse cu overlay-ul real și măsurate: contrastul
trece la toate, deci decide compoziția, nu contrastul.

## Versionarea din nume

`.v5` permite cache lung fără ca vizitatorii vechi să rămână cu poza precedentă.
Dacă regenerezi cu altă tăietură sau altă sursă, incrementează la `.v6` în numele
fișierelor **și** în cele patru referințe din `index.html`.
