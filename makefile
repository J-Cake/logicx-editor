PKG_MGR := pnpm
OUT := build
EXT := $(OUT)/ext

.PHONY: clean rebuild all

all: $(OUT)/editor.js $(EXT)/document.js $(EXT)/find-action.js $(EXT)/chain.js $(EXT)/theme/default.js $(OUT)

$(OUT): $(wildcard static/* static/*/*)
	mkdir -p $(OUT)
	ln -sfr static/* $(OUT)

$(OUT)/editor.js: $(wildcard core/*.ts core/*/*.ts)
	mkdir -p $(OUT)
	$(PKG_MGR) exec esbuild core/index.ts --outfile=$(OUT)/editor.js  --bundle --sourcemap --platform=browser --format=esm --loader:.lpf=file

$(EXT)/document.js: src/document/ext.tsx
	mkdir -p $(EXT)
	$(PKG_MGR) exec esbuild src/document/ext.tsx --outfile=$(OUT)/ext/document.js --bundle --sourcemap --platform=browser --format=esm --loader:.lpf=file

$(EXT)/find-action.js: src/ui/find-action.jsx
	mkdir -p $(EXT)
	$(PKG_MGR) exec esbuild src/ui/find-action.jsx --outfile=$(OUT)/ext/find-action.js --bundle --sourcemap --platform=browser --format=esm --loader:.lpf=file

$(EXT)/chain.js: $(EXT)/chain_select.js $(wildcard src/chain/* src/chain/*/*)
	mkdir -p $(EXT)
	$(PKG_MGR) exec esbuild src/chain/ext.tsx --outfile=$(OUT)/ext/chain.js --bundle --sourcemap --platform=browser --format=esm --loader:.lpf=file --loader:.css=text

$(EXT)/chain_select.js: src/chain/tools/select.ts
	mkdir -p $(EXT)
	$(PKG_MGR) exec esbuild src/chain/tools/select.ts --outfile=$(OUT)/ext/chain_select.js --bundle --sourcemap --platform=browser --format=esm --loader:.lpf=file --loader:.css=text

$(EXT)/theme/default.js:
	mkdir -p $(EXT)/theme
	ln -sfr src/themes/default.js $(EXT)/theme/default.js

clean:
	rm -rf $(OUT) pnpm* .pnpm* package-lock.json yarn.lock node_nodules

rebuild: clean
	$(PKG_MGR) install
	$(PKG_MGR) exec tsc -p tsconfig.json
	$(MAKE) $(OUT)
