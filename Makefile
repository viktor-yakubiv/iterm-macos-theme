%.itermcolors: %.json
	node build.js src/template.njk '$<' > '$@'

MacOS.json: src/spec.scss
	@echo '{' > $@
	npx sass -- $< | sed -Ef src/css2json.sed >> $@
	@echo '}' >> $@
