# assets/hero/

Poza de fundal a secțiunii hero. Sursa e
`assets/_originals/photos/raft-injectoare-sortate.jpg` (5472×3648, 20 MP) —
folderul `_originals/` e `.gitignore`-uit și nu se urcă pe server.

## De ce două tăieturi

Heroul ocupă toată înălțimea ecranului, deci e panoramic pe desktop și înalt pe
mobil. Cu o singură imagine, `object-fit: cover` ar tăia masiv într-unul din
cazuri. Alegerea se face în `index.html` după **forma ferestrei**, nu după
lățime (`media="(min-aspect-ratio: 1/1)"`):

| Fișier | Dimensiune | Când se folosește |
|---|---|---|
| `hero-raft-wide.v3.webp` | 1800×947 (~121 KB) | fereastră lată (desktop, telefon în peisaj) |
| `hero-raft-tall.v3.webp` | 1080×1440 (~106 KB) | fereastră înaltă (telefon, tabletă portret) |

Fiecare are și `.jpg` ca rezervă. **Browserul descarcă un singur fișier** din tot
blocul `<picture>`.

## Regenerare

```python
from PIL import Image
src = Image.open('assets/_originals/photos/raft-injectoare-sortate.jpg')
W, H = src.size

# Desktop: bandă panoramică 1.9:1, la 65% de sus — acolo banda de navete roșii
# cade exact la înălțimea textului, în dreapta unde overlay-ul se limpezește.
ch = round(W / 1.9)
wide = src.crop((0, round((H-ch)*0.65), W, round((H-ch)*0.65)+ch)).resize((1800, 947), Image.LANCZOS)

# Mobil: coloană portret 3:4, decalată la 60% spre dreapta.
cw = round(H * 0.75)
x0 = round((W - cw) * 0.60)
tall = src.crop((x0, 0, x0+cw, H)).resize((1080, 1440), Image.LANCZOS)

for name, im in (('hero-raft-wide.v3', wide), ('hero-raft-tall.v3', tall)):
    im.save(f'assets/hero/{name}.jpg',  'JPEG', quality=70, optimize=True, progressive=True)
    im.save(f'assets/hero/{name}.webp', 'WEBP', quality=58, method=6)
```

**Calitatea e mai mică decât în restul proiectului** (58 față de 74). Poza are
sute de obiecte mici, deci comprimă prost — la q74 ieșea 166 KB. Comparate la
100% zoom în zona cea mai luminoasă a overlay-ului, q58 și q74 sunt
indistinctibile: aici nu există text fin de protejat, spre deosebire de o poză
anterioară unde scăderea calității înmuia vizibil scrisul de pe monitor. Dacă
schimbi poza pe una cu text sau linii fine, **urcă înapoi la 74 și remăsoară**.

## Ce face o poză bună de hero aici

Overlay-ul e aproape negru în stânga (0,96) și se limpezește spre dreapta (0,35).
Deci **nu contează cât de frumoasă e poza, ci dacă are structura potrivită**:
stânga fără detalii importante (se topește sub text), dreapta cu subiectul.

Toate cele 20 de fotografii au fost compuse cu overlay-ul real și măsurate.
Contrastul textului trece la toate (≥6,2:1) — deci nu el decide, ci compoziția.
Poze care umplu tot cadrul cu verdele bancului devin o pastă verde-murdară sub
gradient; cele cu un monitor luminos fix în dreapta îl transformă într-un
dreptunghi ars.

## Contrastul textului — de remăsurat la orice schimbare de poză

Overlay-ul are **două forme**, iar asta nu e opțional:

- ecrane late → gradient orizontal (`0,96 → 0,35`), fiindcă textul stă în stânga;
- ecrane înalte → gradient vertical care nu coboară sub `0,82`, fiindcă acolo
  textul se întinde pe toată lățimea.

Fără al doilea, textul ajunge peste partea transparentă a gradientului
orizontal. Măsurat pe o poză anterioară, contrastul cădea la **1,65:1** față de
pragul de 4,5:1 — ilizibil.

Valorile măsurate cu poza actuală:

| | titlu (prag 3,0) | text lead (prag 4,5) |
|---|---|---|
| Desktop 1920×1006 | 9,17:1 | 5,71:1 |
| Mobil 390×770 | 11,10:1 | 6,91:1 |
| Mobil 360×680 | 11,20:1 | 6,97:1 |

**Dacă schimbi poza, remăsoară.** Una mai luminoasă poate cere mai mult.
Procedura: compune poza cu gradientul, ia cel mai deschis pixel din zona
textului (stânga sus până la 900px lățime pe desktop, toată lățimea pe mobil) și
verifică raportul de contrast față de `#b9c1c9` — trebuie ≥ 4,5:1.

## Versionarea din nume

`.v3` permite cache lung fără ca vizitatorii vechi să rămână cu poza precedentă.
Dacă regenerezi cu altă tăietură sau altă sursă, incrementează la `.v4` în numele
fișierelor **și** în cele patru referințe din `index.html`.
