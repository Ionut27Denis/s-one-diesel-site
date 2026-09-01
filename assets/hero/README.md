# assets/hero/

Poza de fundal a secțiunii hero. Sursa e `assets/_originals/photos/sesiune-anterioara/IMG_7672.jpg`
(3648×4864, 17,7 MP) — folderul e `.gitignore`-uit și nu se urcă pe server.

## De ce două tăieturi

Originalele sunt **portret**, iar heroul e panoramic pe desktop și înalt pe mobil.
Cu o singură imagine, `object-fit: cover` ar fi tăiat ~70% din înălțime pe
desktop — s-ar fi văzut doar o fâșie prin mijloc.

Așa că se generează două variante, alese în `index.html` după **forma ferestrei**,
nu după lățime (`media="(min-aspect-ratio: 1/1)"`) — heroul ocupă toată înălțimea
ecranului, deci ce contează e dacă fereastra e lată sau înaltă:

| Fișier | Dimensiune | Când se folosește |
|---|---|---|
| `hero-banc-wide.v1.webp` | 2000×1053 (~68 KB) | fereastră lată (desktop, telefon în peisaj) |
| `hero-banc-tall.v1.webp` | 1080×1440 (~62 KB) | fereastră înaltă (telefon, tabletă portret) |

Fiecare are și un `.jpg` ca rezervă pentru browserele fără WebP. **Browserul
descarcă un singur fișier din tot blocul `<picture>`.**

## Regenerare

```python
from PIL import Image
src = Image.open('assets/_originals/photos/sesiune-anterioara/IMG_7672.jpg')
W, H = src.size
CH = round(W / 1.9)                       # raportul heroului pe desktop

wide = src.crop((0, 900, W, 900 + CH)).resize((2000, round(2000*CH/W)), Image.LANCZOS)
tall = src.resize((1080, round(1080*H/W)), Image.LANCZOS)

for name, im in (('hero-banc-wide.v1', wide), ('hero-banc-tall.v1', tall)):
    im.save(f'assets/hero/{name}.jpg',  'JPEG', quality=78, optimize=True, progressive=True)
    im.save(f'assets/hero/{name}.webp', 'WEBP', quality=74, method=6)
```

`top=900` e ales dintre mai multe variante: e singura care prinde în același
cadru mâna cu mănușă, corpul injectorului și tot panoul verde cu etichetele
„RAIL PRESSURE SENSOR" și „CRIN 4.2". Treimea din stânga rămâne închisă și
neclară — convenabil, fiindcă acolo stă textul, sub partea opacă a overlay-ului.

Calitatea `74` pentru WebP a fost aleasă prin comparație directă cu `80`: la 100%
zoom, în zona cea mai luminoasă a overlay-ului, sunt indistinctibile — dar
fișierul scade de la 125 KB la 68 KB.

## Contrastul textului — de verificat la orice schimbare de poză

Overlay-ul are **două forme**, iar asta nu e opțional:

- pe ecrane late, gradient orizontal (`0,96 → 0,35`), fiindcă textul stă în stânga;
- pe ecrane înalte, gradient vertical care nu coboară sub `0,82`, fiindcă acolo
  textul se întinde pe toată lățimea.

Fără al doilea, textul ajunge peste partea transparentă a gradientului orizontal,
exact unde poza e luminoasă. Măsurat pe poza asta: contrastul cădea la **1,65:1**,
la un prag necesar de 4,5:1. Cel mai deschis pixel al pozei sub text e alb pur,
ceea ce cere minimum `0,72` opacitate; ținem `0,82` ca marjă.

**Dacă schimbi poza, remăsoară.** O poză mai luminoasă poate cere mai mult.
Regula: compune poza cu gradientul, ia cel mai deschis pixel din zona textului și
verifică raportul de contrast față de `#b9c1c9` (textul lead) — trebuie ≥ 4,5:1.

## Versionarea din nume

`.v1` permite cache lung. Dacă regenerezi cu altă tăietură, incrementează la
`.v2` în numele fișierelor **și** în cele patru referințe din `index.html`.
