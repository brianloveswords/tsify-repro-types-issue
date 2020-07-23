version = latest

test :
	yarn add typescript@${version}
	yarn exec tsc

.PHONY: test
