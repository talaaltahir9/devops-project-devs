SRC_DIR := src
OUT_DIR := out

SOURCES := $(wildcard $(SRC_DIR)/*.md)
OUTPUTS := $(patsubst $(SRC_DIR)/%.md, $(OUT_DIR)/%.html, $(SOURCES))

.PHONY: all check build test clean ci deps package

all: build

node_modules: package-lock.json
	npm ci
	@touch node_modules

deps: node_modules ## install exactly what the lock file says

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OUT_DIR)/%.html: $(SRC_DIR)/%.md package-lock.json | $(OUT_DIR) node_modules
	@echo "BUILD $< -> $@"
	@npm run --silent build -- $< $@

check:
	@if [ ! -d "$(SRC_DIR)" ]; then \
		echo "ERROR: missing src"; exit 1; \
	fi
	@if [ -z "$(SOURCES)" ]; then \
		echo "ERROR: no .md files found"; exit 1; \
	fi
	@echo "Found $(words $(SOURCES)) source files."

build: $(OUTPUTS)

test: build ## run the test suite against what was built
	@npm test --silent
package: test ## produce the versioned artifact
	npm pack
clean: ## remove all generated files
	rm -rf $(OUT_DIR) *.tgz

ci: clean deps check test package
