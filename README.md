# Návrh a implementácia jednoduchého mikrofrontendu

Bakalárska práca, Adam Oreský, FMFI UK, 2026

Repozitár obsahuje implementáciu jednoduchého e-shopu na predaj mobilných telefónov pomocou štyroch rôznych integračných techník mikrofrontendovej architektúry: **HTML odkazy**, **Iframe**, **Ajax** a **Web Components**.

Každá implementácia je funkčne ekvivalentná a zahŕňa zobrazenie zoznamu produktov, detail produktu, pridanie do košíka a správu košíka.

---

## Požiadavky

- **Node.js** verzia 18+
- **npm** (súčasť inštalácie Node.js)
- Moderný webový prehliadač (odporúčaný Google Chrome alebo Mozilla Firefox)

---

## Inštalácia

```bash
git clone https://github.com/AdamOresky/microfrontends-demo
cd microfrontends-demo
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

>⚠️ **Upozornenie:** Príkazy spúšťajte vždy len po jednom. Súbežné spustenie vedie ku konfliktu na portoch a k nesprávnemu správaniu programu.

---

## Rozdelenie portov

| Služba            | Port             |
|-------------------|------------------|
| Tím Domov         | `localhost:3001` |
| Tím Produkt       | `localhost:3002` |
| Tím Košík         | `localhost:3003` |
| Zdieľané úložisko | `localhost:3030` |

---

## Prehľad implementácií

### 01 HTML odkazy
Najjednoduchší prístup. Každý tím prevádzkuje vlastný statický server s HTML stránkami. Navigácia prebieha pomocou štandardných hypertextových odkazov, každé kliknutie spôsobí úplné načítanie novej stránky. Header a footer sú duplikované v každom tíme.

### 02 Iframe
Tím Produkt je hostiteľská stránka, ktorá vkladá header a footer Tímu Domov pomocou elementov `<iframe>`. Navigácia hlavného okna sa rieši atribútom `target="_top"`. Stav zobrazenia hraníc tímov sa synchronizuje medzi frameami pomocou `postMessage`.

### 03 Ajax
Stránky dynamicky načítavajú HTML fragmenty od iných tímov pomocou `fetch` a vkladajú ich do DOM. Celý kód beží v jednom kontexte prehliadača. Servery musia mať povolené CORS hlavičky.

### 04 Web Components
Najvyspelejší prístup. Každý tím definuje vlastné HTML elementy pomocou Custom Elements API (`<home-header>`, `<all-products>`, `<buy-button>` a ďalšie). Skripty sa načítavajú asynchrónne. Komunikácia medzi komponentami prebieha prostredníctvom `CustomEvent` a cookies.

---

## Zdieľané úložisko

Priečinok `storage/` (port 3030) obsahuje:
- **products.json**: katalóg 26 modelov telefónov (Apple, Google, Samsung)
- **obrázky produktov**
- **teams.js** a **team-frame.js**: skripty pre vizualizáciu hraníc tímov

Stav košíka je zdieľaný medzi všetkými tímami prostredníctvom browser cookies.

>💡 **Poznámka k stavu košíka:** Obsah košíka sa ukladá do cookies prehliadača a pretrváva nezávisle od bežiacej aplikácie. To znamená, že:
> - Po zatvorení a opätovnom otvorení prehliadača košík zostane zachovaný.
> - Pri prepnutí na inú technológiu (napr. z `01_pages_links` na `04_web_components`) sa obsah košíka prenesie, keďže sa v cookies stále nachádzajú produkty pridané v predchádzajúcej implementácii.
>
> Ak chcete začať s prázdnym košíkom, je potrebné cookies manuálne vymazať (DevTools -> Storage -> Cookies -> cart -> delete), alebo dokončiť objednávku.

---

## Zvýraznenie mikrofrontendov

V pätičke stránky sa nachádza tlačidlo, ktoré farebne zvýrazní hranice jednotlivých mikrofrontendov podľa tímu, ktorý ich spravuje:

| Tím         | Farba               |
|-------------|---------------------|
| Tím Domov   | 🟦 `DodgerBlue`     |
| Tím Produkt | 🟩 `MediumSeaGreen` |
| Tím Košík   | 🟪 `Orchid`         |

## Zdroje a atribúcia

Implementácia vychádza z referenčného projektu a knihy od Michaela Geersa:

- **neuland/micro-frontends** — https://github.com/neuland/micro-frontends
- **micro-frontends.org** — https://micro-frontends.org
- Geers, M. *Micro Frontends in Action*. Manning Publications, 2020.
