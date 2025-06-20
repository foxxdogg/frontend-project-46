DEMO=src/asciinemas/demo.cast

install:
	npm ci

lint:
	npx eslint .

pretty:
	npx prettier --write .

format: 
	npx prettier --write .
	npx eslint . --fix
	
test:
	npm test

test-watch:
	npm test -- --watch

tree:
	tree -I 'node_modules|dist|.git|coverage|.github|.gitignore|cc-test-reporter|editorconfig.txt|eslint.config.js' -L 3

gendiff:
	gendiff data/file1.json data/file2.json

gendiff2:
	gendiff data/file1.yml data/file2.yml

gendiff3:
	gendiff __fixtures__/genDiffCases/nested/mixed/file1.yml __fixtures__/genDiffCases/nested/mixed/file2.yml -f json

asc: 
	asciinema rec $(DEMO) --overwrite

upload:
	asciinema upload $(DEMO)

test-coverage:
	npm run test:coverage

.PHONY: test