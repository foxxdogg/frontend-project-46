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

.PHONY: test