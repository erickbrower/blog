bower: build
		bower install

install: node_modules
		npm install

build: build.js
		node build

deploy: install build bower

.PHONY: build

.DEFAULT: deploy
