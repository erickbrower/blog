bower: node_modules
		./node_modules/bower/bin/bower install

deps: node_modules
		npm install

build: build.js
		node build

deploy: deps build bower

heroku: build bower

.PHONY: build heroku deps

.DEFAULT: deploy
