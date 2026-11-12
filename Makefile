PNPM ?= npx -y pnpm
FIREFOX_DIR := dist/firefox
XPI_DIR := dist/xpi

-include .env.local
export WEB_EXT_API_KEY WEB_EXT_API_SECRET

.PHONY: dev install build-web build-extn build-extn-debug firefox typecheck format clean

dev: node_modules
	$(PNPM) start-web

install:
	$(PNPM) install

node_modules: package.json
	$(PNPM) install
	@touch node_modules

build-web: node_modules
	$(PNPM) build-web

build-extn: node_modules
	$(PNPM) build

# AMO rejects re-used versions, so each signed build gets a minutes-since-epoch fourth part.
firefox: build-extn
	node -e 'const f = "$(FIREFOX_DIR)/manifest.json", fs = require("fs"), m = JSON.parse(fs.readFileSync(f)); m.version = m.version.split(".").slice(0, 3).join(".") + "." + Math.floor(Date.now() / 60000); fs.writeFileSync(f, JSON.stringify(m, null, 4)); console.log("Signing version", m.version)'
	npx -y web-ext sign --channel=unlisted --source-dir $(FIREFOX_DIR) --artifacts-dir $(XPI_DIR)

build-extn-debug: node_modules
	$(PNPM) build-debug

typecheck: node_modules
	$(PNPM) exec tsc -b

format: node_modules
	npx -y prettier --write src vite.config.ts

clean:
	rm -rf dist
