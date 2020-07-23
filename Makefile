version = latest

test :
	yarn add typescript@${version}
	yarn exec tsc
	node index.js
	node out/opt1.js
	node out/opt2.js

.PHONY: test
