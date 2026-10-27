SRC_DIR := src
OUT_DIR := out

SOURCES := $(wildcard $(SRC_DIR)/*.md)
OUTPUTS := $(patsubst $(SRC_DIR)/%.md,$(OUT_DIR)/%.html,$(SOURCES))

.PHONY: all clean check test ci deps build package

all: build

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

node_modules: package-lock.json
	npm ci
	@touch node_modules

deps: node_modules ## install exactly what the lock file says

$(OUT_DIR)/%.html: $(SRC_DIR)/%.md package-lock.json | $(OUT_DIR) node_modules
	@echo "  BUILD $< -> $@"
	@npm run --silent build -- $< $@

build: $(OUTPUTS)

check: ## check markdown source files exist
	@test -n "$(SOURCES)" || (echo "No .md files found in $(SRC_DIR)"; exit 1)

test: build ## run the test suite against what was built
	@npm test --silent

package: test ## produce the versioned artifact
	npm pack

clean: ## remove all generated files
	rm -rf $(OUT_DIR) *.tgz

ci: clean deps check test package ## the build server entry point
