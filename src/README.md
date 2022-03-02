# Src

This directory contains the source for all of the interface extensions provided by default to the LogicX interface.

Each extension should have an `ext:*` npm build script associated with it. If not, they follow the following command template:

```bash
pnpm exec esbuild ./src/<name/ext.js> --outfile=./build/ext/name.js --bundle --sourcemap --platform=browser --format=esm --loader:lpf=file
```

> **Note:** J/TSX files are valid and do not need to be distinguished between. 

## Docs:

<!-- Extensions must call the top-level `extension(name: string, onLoad: (extension: Extension) => void): void` function. Extensions simply run the contents their `onLoad` function. The received `extension` parameter is an instance of the `/app/ext/Extension.ts/Extension` class. See its definition for all possible functionality.
 -->
Extensions must export an initialisation function as its default export. It receives a single instanceof of `/app/ext/Extension.ts/Extension`, and all functionality can be implemented through it. 