# README

Před spuštěním je potřeba vytvořit souboru .env a  doplnit hodnoty v souboru:

```js
VITE_RAYNET_USERNAME=uzivatel
VITE_RAYNET_API_KEY=api_klic
VITE_RAYNET_INSTANCE=moje-crm
```

A soubor .env.dt.s:
```js
interface ImportMetaEnv {
readonly VITE_RAYNET_USERNAME: string
readonly VITE_RAYNET_API_KEY: string
readonly VITE_RAYNET_INSTANCE: string
}

interface ImportMeta {
readonly env: ImportMetaEnv
}
```

Poté je třeba spustit příkaz:

```js
npm install
```

Poté spustit lokální server pomocí příkazu:

```js
npm run dev
```

V prohlížeči pak bude spuštěn projekt na url adrese: 

```js
 localhost:5173
```

V projektu nebyly vytvořeny všechny funkce, které obsahuje předloha projektu. 
