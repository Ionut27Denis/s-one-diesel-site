# Implementarea paginii de landing S ONE DIESEL ca site static real

## Context

Proiectul Claude Design „S One Diesel Landing Page" conține `S ONE DIESEL Landing.dc.html` — un site de prezentare pe o singură pagină, în limba română, pentru S ONE DIESEL SRL (service specializat pe reparații injectoare și pompe de injecție de înaltă presiune, Decindeni, Dâmbovița). Acest fișier `.dc.html` este scris în formatul „canvas" al Claude Design, nu este o pagină web gata de publicat:

- Este încapsulat în `<x-dc>` și depinde de `support.js`, un runtime generat pe bază de React (`GENERATED from dc-runtime/src/*.ts — do not edit`) care există doar pentru previzualizare/editare în interiorul instrumentului de design.
- Conținutul repetitiv (servicii, chip-uri de mărci, prețuri, motive, perechi înainte/după, recenzii, întrebări frecvente) este scris ca bucle `<sc-for list="{{ x }}">` legate de datele dintr-un bloc `<script data-dc-script>`, iar două secțiuni (`Prețuri`, `Întrebări frecvente`) sunt condiționate de `<sc-if value="{{ showPrices/showFaq }}">`.
- Siglele mărcilor din marquee-ul „Mărci injectoare" folosesc `<image-slot>` (`image-slot.js`), un element custom folosit doar la momentul creării, pentru imagini trase-și-lăsate (drag-and-drop), care persistă doar prin propriul backend al instrumentului de design (`window.omelette.writeFile`) — în afara acelui mediu, nu salvează nimic.
- Efectele de hover sunt scrise printr-un atribut non-standard `style-hover="prop:value"`, pe care browserele obișnuite nu îl recunosc.

Directorul local al proiectului (`D:\SITE s one disele\site`) este momentan gol. Scopul este transformarea acestui design într-un site static real, fără dependențe: `index.html` + CSS + JS + assets, cu tot textul real în română preluat exact, cu toate buclele `sc-for`/`sc-if` „desfășurate" în markup static, cu `style-hover` transformat în reguli CSS `:hover` reale, și cu cele două zone interactive (acordeon FAQ, modale de detaliu pentru servicii/galerie) reimplementate în JavaScript simplu (vanilla).

**Asset-ul cu sigla**: sigla reală `assets/logo-sone-diesel.png` (925×417px, fundal transparent) este mai mare decât limita de 256 KiB pe care instrumentul de design-sync o poate returna într-o singură citire, deci nu poate fi descărcată integral automat. Conform alegerii tale: voi conecta acum fiecare referință `<img>`/favicon/OG la `assets/logo-sone-diesel.png`, iar tu vei adăuga ulterior fișierul real în acel folder — fără nicio modificare de cod necesară după aceea.

## Conținut de preluat identic (din clasa `Component` din scriptul `data-props`)

- **services** (3): Diagnosticare & reparații injectoare Common Rail / pompe de înaltă presiune / Testare pe bancul de probă — fiecare cu `lead`, textul-placeholder pentru `photo`, nota de `price` și 5 `bullets`.
- **gallery pairs** (2): „Injectoare Common Rail — set de 4" și „Pompă de înaltă presiune" — fiecare cu textele-placeholder `beforeLabel`/`afterLabel` și un `caption`.
- **faqs** (6): durată reparație, cost, garanție, curier, mărci, plată — `faqOpen` este implicit pe indexul `0` (prima întrebare deschisă la încărcare, acordeon cu un singur item deschis).
- **brands**, lista implicită (11 chip-uri text): Common Rail (toate mărcile), VW/Audi/Skoda/Seat TDI, Dacia & Renault dCi, Ford TDCi, BMW & Mercedes CDI, Opel CDTI, Fiat JTD/Multijet, Peugeot/Citroën HDi, Hyundai/Kia CRDi, Toyota D-4D, Pompe de înaltă presiune.
- **prices** (3): Diagnosticare pe banc (200 lei), Reparație injectoare (după diagnosticare), Pompe de înaltă presiune (după diagnosticare).
- **reasons** (4): 20+ ani experiență, aparatură nouă, 12 luni garanție, 24h execuție.
- **reviews** (2): Ciobanu Denis, Ionuț Ștefan.
- `showPrices` / `showFaq` sunt implicit `true` amândouă → ambele secțiuni sunt afișate mereu (nu e nevoie de un toggle la runtime în versiunea statică).

Tot conținutul din `<head>` se preia neschimbat: `<title>`, meta description/keywords/OG/geo, fonturile Google (Barlow Condensed, Barlow, JetBrains Mono) și blocul complet JSON-LD `AutoRepair`/`LocalBusiness` + `FAQPage` (se actualizează câmpurile `"logo"`/`"image"` cu aceeași cale `assets/logo-sone-diesel.png`).

## Fișiere de creat

- **`index.html`** — pagina completă, adaptată 1:1 după structura vizuală și textul din sursa `.dc.html`:
  - `<head>`: meta/OG/JSON-LD/fonturi ca mai sus, plus `<link rel="icon" href="assets/logo-sone-diesel.png">`.
  - Header/nav fix (sticky), hero (cu fundalul-placeholder în model hașurat diagonal + textul `[ FOTO FUNDAL: ... ]`, neschimbat — nu a fost furnizată o fotografie reală pentru hero), bandă cu 4 puncte forte.
  - Secțiunea Servicii: 3 carduri „desfășurate" din `services`, fiecare cu `onclick` care deschide modalul de serviciu (înlocuiește `srv.open`/`sc-for`).
  - Marquee „Mărci injectoare": pentru că nu există fișiere reale cu siglele mărcilor (și nu e potrivit să folosim sigle ale unor terți fără assets-urile lor), fiecare tile va fi randat ca un **wordmark text** cu chenar (numele mărcii cu fontul Barlow Condensed, în aceleași dimensiuni ca tile-urile `<image-slot>` originale) în loc de `<image-slot>`/`<img>` — consecvent cu lista text de mărci de mai jos, din același design. Se păstrează animația CSS de marquee cu track dublat (`soneMarquee`) și pauza la hover.
  - Lista text cu chip-uri de mărci, cardurile de preț (3), grila „De ce noi" cu motive (4), galeria înainte/după (2 carduri, fiecare cu `onclick` care deschide modalul de galerie) + recenzii (2), acordeon FAQ (6 întrebări, prima deschisă implicit), secțiunea de contact (telefon/adresă/program/plată + linkuri Maps/Waze), CTA final, footer (siglă + linkuri TikTok/Maps/telefon), butoane flotante WhatsApp/Sună acum.
  - Modalul de detaliu pentru servicii și modalul de detaliu pentru galerie: același markup/text ca blocurile `sc-if="{{ serviceOpen }}"` / `sc-if="{{ galleryOpen }}"`, controlate prin clase comutate din JS în loc de starea framework-ului; click pe fundal / buton × / tasta `Escape` — toate închid modalul.
- **`css/styles.css`** — blocul `<style>` de bază existent (reset-uri, fonturi, keyframes: `soneFadeUp`, `sonePulse`, `soneSheen`, `soneMarquee`) plus câte o clasă pentru fiecare componentă (carduri, butoane, linkuri de navigare, chip-uri, modal, tile-urile din marquee etc.) care preia exact culorile/spațierile/tipografia din stilurile inline din sursă, cu fiecare `style-hover="..."` transformat într-o regulă reală `.element:hover { ... }`. Fidel vizual sursei, doar mutat din stiluri inline în CSS real ca hover-ul să funcționeze cu adevărat.
- **`js/main.js`** — JavaScript simplu, fără dependențe:
  - Vectorii de date `services` și `gallery` (oglindind `servicesData()`/`galleryData()`) folosiți pentru a popula cele două modale la click.
  - Logica de deschidere/închidere a modalelor (click pe fundal, buton ×, tasta `Escape`, `stopPropagation` pe panoul interior — oglindește `stop`/`closeModal` din sursă).
  - Acordeon FAQ: click-ul comută un singur item deschis o dată (semnul `+`/`−` se schimbă), prima întrebare deschisă la încărcare.
- **`assets/`** — folder pentru `logo-sone-diesel.png` (vei adăuga tu fișierul real aici); fiecare referință (header, footer, favicon, JSON-LD `logo`/`image`) indică deja spre această singură cale.

## Verificare

- Deschide `index.html` direct în browser (fără niciun pas de build).
- Dă click pe fiecare link din navigare (`#servicii`, `#preturi`, `#contact`) și confirmă scroll lin către secțiunea corectă.
- Dă click pe fiecare dintre cele 3 carduri de servicii → se deschide modalul cu titlul/lead/bullets/preț corecte; se închide prin ×, click pe fundal și `Escape`.
- Dă click pe fiecare dintre cele 2 carduri înainte/după → se deschide modalul de galerie cu etichetele/caption-ul corecte; aceleași trei moduri de închidere.
- Parcurge toate cele 6 întrebări FAQ → acordeonul se deschide/închide câte un item o dată, semnul `+`/`−` se actualizează, prima întrebare deschisă la încărcare.
- Treci cu mouse-ul peste linkurile din navigare, butoane, cardurile de servicii/galerie și marquee (animația trebuie să se oprească) pentru a confirma că stilurile `:hover` convertite corespund valorilor originale din `style-hover`.
- Redimensionează la un viewport îngust (mobil) și confirmă că scala tipografică bazată pe `clamp()` și layout-urile `flex-wrap` se restrâng coerent, iar butoanele flotante WhatsApp/Sună acum rămân utilizabile.
- Confirmă că linkurile `tel:+40738210233`, WhatsApp (`wa.me`), TikTok și Google Maps/Waze sunt toate intacte.
- După ce adaugi PNG-ul real la `assets/logo-sone-diesel.png`, reîncarcă și confirmă că apare corect în header, footer și ca favicon în tab-ul browserului.
