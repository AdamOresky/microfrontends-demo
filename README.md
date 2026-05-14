# Návrh a implementácia jednoduchého mikrofrontendu

Bakalárska práca, Adam Oreský, FMFI UK, 2026

Repozitár obsahuje implementáciu jednoduchého e-shopu na predaj mobilných telefónov pomocou štyroch rôznych integračných techník mikrofrontendovej architektúry: **HTML odkazy**, **Iframe**, **Ajax** a **Web Components**.

---

## Požiadavky

- **Node.js** verzia 18+
- **npm** (súčasť inštalácie Node.js)
- Moderný webový prehliadač (odporúčaný Google Chrome alebo Mozilla Firefox)

---

## Inštalácia

```bash
git clone 
cd 
npm install
```

---

## Spustenie

Každý príkaz spustí všetky potrebné servery (vrátane zdieľaného úložiska na porte 3030) a automaticky otvorí prehliadač.

```bash
npm run 01_pages_links
```
```bash
npm run 02_iframe
```
```bash
npm run 03_ajax
```
```bash
npm run 04_web_components
```


Ukončenie všetkých serverov: `Ctrl+C` v termináli.

>⚠️ **Upozornenie:** Príkazy spúšťajte vždy len po jednom. Súbežné spustenie vedie ku konfliktu na protoch a k nesprávnemu správaniu programu.

---

## Rozdelenie portov

| Služba | Port |
|---|---|
| Tím Domov | `localhost:3001` |
| Tím Produkt | `localhost:3002` |
| Tím Košík | `localhost:3003` |
| Zdieľané úložisko | `localhost:3030` |

---

## Zvýraznenie mikrofrontendov

V pätičke stránky sa nachádza tlačidlo, ktoré farebne zvýrazní hranice jednotlivých mikrofrontendov podľa tímu, ktorý ich spravuje.