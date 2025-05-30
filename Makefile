DEMO=src/asciinemas/demo.cast

install:
	npm ci

lint:
	npx eslint . --fix

pretty:
	npx prettier --write .

format: 
	npx prettier --write .
	npx eslint --fix .
	
test:
	npm test

tree:
	tree -I 'node_modules|dist|.git|coverage|.github|.gitignore|cc-test-reporter|editorconfig.txt|eslint.config.js' -L 3

gendiff:
	gendiff src/data/file1.json src/data/file2.json

asc: 
	asciinema rec $(DEMO) --overwrite

upload:
	asciinema upload $(DEMO)

.PHONY: test