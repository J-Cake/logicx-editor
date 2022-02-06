# Src

This directory contains the source for all of the interface extensions provided by default to the LogicX interface. 
They are organised by the area in which they take effect. For instance, extensions related to displaying content in the viewport are located under `/src/viewport/`

Each extension should have an `ext:*` npm build script associated with it. If not, they follow the following command template:

```bash
pnpm exec esbuild ./src/<name/entry.js> --outfile=./build/ext/name.js --bundle --sourcemap --platform=browser --format=esm --loader:lpf=file
```

> **Note:** J/TSX files are valid and do not need to be distinguished between. 

## Docs:

Extensions must call the top-level `extension(name: string, onLoad: (extension: Extension) => void): void` function. Extensions simply run the contents their `onLoad` function. The received `extension` parameter is an instance of the `/app/ext/Extension.ts/Extension` class. See its definition for all possible functionality.

