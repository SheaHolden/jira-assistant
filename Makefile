PNPM ?= npx -y pnpm

.PHONY: dev install build-web build-extn build-extn-debug typecheck format clean

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

build-extn-debug: node_modules
	$(PNPM) build-debug

typecheck: node_modules
	$(PNPM) exec tsc -b

format: node_modules
	npx -y prettier --write src vite.config.ts

clean:
	rm -rf dist
