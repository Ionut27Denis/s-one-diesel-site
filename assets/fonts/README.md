# assets/fonts/

Fonturile site-ului, găzduite local. Înainte veneau de la `fonts.googleapis.com`
printr-un `<link rel="stylesheet">` care **bloca randarea**: primul paint aștepta
un DNS + TCP + TLS complet către o origine străină (~180 ms măsurat pe desktop,
mult mai mult pe mobil), iar CSS-ul Google avea `Cache-Control: private,
max-age=86400`, deci costul se plătea din nou zilnic, la fiecare vizitator.

Rezultat: **5 fișiere, 92 KB** în loc de 14 cereri și 259 KB către două origini
străine. Ca bonus, IP-urile vizitatorilor nu mai ajung la Google.

| Fișier | Greutate | Unde se folosește |
|---|---|---|
| `barlow-400.v1.woff2` | Barlow 400 | implicit pe `body` — tot textul curent |
| `barlow-600.v1.woff2` | Barlow 600 | nav, `<strong>` din hero, linkuri, autor recenzie, etichetele benzii |
| `barlow-700.v1.woff2` | Barlow 700 | butoanele flotante, `<strong>` din bannere |
| `barlow-condensed-700.v1.woff2` | Barlow Condensed 700 | titluri `h1`–`h4`, butoane, prețuri, statistici, chip-uri, FAQ |
| `jetbrains-mono-400.v1.woff2` | JetBrains Mono 400 | textele mici decorative (`.eyebrow`, `.hero__badge`, etichete contact) |

Nu livrăm Barlow 500 și nici Barlow Condensed 600: erau folosite de câte una–două
reguli, iar acelea au fost urcate la 600 respectiv 700 în `css/styles.css`.

## Versionarea din nume

`.v1` din numele fișierelor face sigur headerul `immutable, max-age=31536000` din
`.htaccess`. **Dacă regenerezi fonturile cu alt charset, incrementează la `.v2` în
trei locuri**, altfel vizitatorii revin cu fontul vechi din cache timp de un an:

1. numele fișierelor de aici
2. blocul `@font-face` din `css/styles.css`
3. cele două `<link rel="preload">` din `index.html`

## Regenerare

Sursele sunt TTF-urile OFL originale din `assets/_originals/fonts/` — folderul e
`.gitignore`-uit și nu se urcă pe server. Descarcă-le din
`https://raw.githubusercontent.com/google/fonts/main/ofl/{barlow,barlowcondensed,jetbrainsmono}/`.

```bash
pip install fonttools brotli
```

JetBrains Mono e font variabil — se instanțiază întâi la 400, ca să scape de
mecanismul de variație:

```bash
python -m fontTools.varLib.instancer \
  "assets/_originals/fonts/JetBrainsMono-VF.ttf" wght=400 \
  -o assets/_originals/fonts/JetBrainsMono-400.ttf
```

Charset (Latin-1 + română, ~200 codepoints):

```
U+0020-007E,U+00A0-00FF,U+0102-0103,U+0131,U+0152-0153,U+015E-0163,U+0178,
U+0218-021B,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0304,U+0306-0308,U+030C,
U+0326-0327,U+0329,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,
U+2030,U+2039-203A,U+20AC,U+2122,U+2212
```

Trei bucăți sunt obligatorii și ușor de omis din greșeală:

- **`U+015E-0163`** — Ş ş Ţ ţ *cu sedilă*, formele vechi românești, distincte de
  Șș Țț cu virgulă (`U+0218-021B`). Orice text lipit dintr-un email de client sau
  de pe un Windows mai vechi le folosește; fără ele apar pătrățele.
- **`U+0300-0329`** — semne combinante, pentru text introdus descompus.
- **`U+0131`, `U+0152-0153`, `U+02BB-02BC`, `U+02C6`, `U+02DA`, `U+02DC`** — sunt
  în subsetul `latin` al Google; ieftine, păstrează paritatea.

Comanda per font (Barlow și Barlow Condensed):

```bash
python -m fontTools.subset assets/_originals/fonts/Barlow-Regular.ttf \
  --output-file=assets/fonts/barlow-400.v1.woff2 --flavor=woff2 \
  --unicodes="<charset-ul de mai sus, pe un singur rând>" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk"
```

**Păstrează `locl`.** Pagina e `<html lang="ro">`, iar `locl` mapează formele cu
sedilă pe cele cu virgulă. Fără el, ș și ț apar cu sedilă — regresie tipografică
pe care doar un cititor român o observă. `ccmp,mark,mkmk` poziționează accentele.

**Pentru JetBrains Mono, scoate `liga,calt`:**

```bash
python -m fontTools.subset assets/_originals/fonts/JetBrainsMono-400.ttf \
  --output-file=assets/fonts/jetbrains-mono-400.v1.woff2 --flavor=woff2 \
  --unicodes="<același charset>" \
  --layout-features="kern,ccmp,locl,mark,mkmk"
```

Acelea sunt ligaturile de programare (`->`, `=>`, `!=`), inutile pe un site de
prezentare — și scad fișierul de la 20,3 KB la 9,4 KB, mai mult de jumătate.

## Hinting

Fonturile sunt generate **cu** hinting. `--no-hinting` ar tăia încă ~31% din
fonturile Barlow (20,9 → 14,3 KB), dar hinting-ul ajută claritatea la 13–15 px pe
Windows, unde e cel mai mult trafic. Fiindcă fișierele nu blochează randarea
(`font-display: swap`), cei ~27 KB nu afectează FCP-ul — deci am ales calitatea.
Dacă vrei totuși varianta mai mică, adaugă `--no-hinting` la comenzile Barlow.

## Verificare după orice editare de text

Subsetarea are un risc: dacă textul paginii capătă un caracter din afara
charset-ului, acesta apare ca pătrățel. Rulează după orice modificare de conținut:

```bash
PYTHONUTF8=1 python -c "
from fontTools.ttLib import TTFont
import io, re
cmap = set(TTFont('assets/fonts/barlow-400.v1.woff2').getBestCmap())
html = io.open('index.html', encoding='utf-8').read()
html = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', html, flags=re.S)
html = re.sub(r'<[^>]+>', ' ', html)
js = ' '.join(re.findall(r'[\"\'']([^\"\'']*)[\"\'']', io.open('js/main.js', encoding='utf-8').read()))
missing = sorted({c for c in html + js if c.strip() and ord(c) not in cmap})
print('lipsesc din subset:', ' '.join('U+%04X %s' % (ord(c), c) for c in missing) or 'niciunul')
"
```

Azi raportează doar simboluri și emoji: `ℹ → ⏱ ★ ♪ ⚙ ✆ ✕ ✓ 📦 🛡`. **E corect
așa** — niciunul nu există în Barlow, Barlow Condensed sau JetBrains Mono, nici
înainte de subsetare. Se desenează din fonturile de sistem, exact ca până acum.
Nu încerca să le adaugi în charset.

## Licențe

`OFL-Barlow.txt` acoperă Barlow și Barlow Condensed (aceiași autori), iar
`OFL-JetBrainsMono.txt` fontul mono. Niciuna dintre familii nu declară Reserved
Font Name în nota de copyright, deci subsetarea cu păstrarea numelui e permisă.
OFL 1.1 §2 cere ca licența să însoțească fontul — de aceea fișierele stau aici,
lângă woff2-uri, și se urcă pe server odată cu ele.
