install: node_modules
		npm install

build: build.js
		node build

deploy: install build

.PHONY: build
