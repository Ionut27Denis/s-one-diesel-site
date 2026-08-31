# assets/brands/

Siglele pentru marquee-ul „Mărci de injectoare cu care lucrăm":

```
bosch.png  delphi.png  denso.png  siemens-vdo.png  continental.png
zexel.png  cummins.png  caterpillar.png  stanadyne.png
```

„Piezo CR" rămâne text — nu e o siglă de marcă, e un tip generic de injector.

Fișierele sunt redimensionate ca să încapă într-un dreptunghi de 400×260 px
(tile-ul din marquee are 200×96 px, deci acoperă și ecranele 2×) și quantizate pe
256 de culori. Originalele sunt în `../\_originals/brands/` — vezi
[../README.md](../README.md) pentru comanda de reprocesare.

Atributele `width`/`height` din `index.html` trebuie să corespundă dimensiunilor
reale ale fișierelor, altfel reapare saltul de layout (CLS) la încărcare.
