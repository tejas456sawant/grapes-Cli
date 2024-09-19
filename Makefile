# Description: Makefile for GrapesJS
build:
	npx grapesjs-cli build

serve:
	npx grapesjs-cli serve -p 8081

run:
	make build
	make serve


