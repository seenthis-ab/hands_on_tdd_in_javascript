EXT=md
CSS=assets/*.css
TARGET_DIR=target
SRC=$(wildcard src/*.$(EXT))
HTML=$(patsubst src/%.md, target/%.html, $(SRC))

html: $(HTML)

$(TARGET_DIR):
	mkdir "$@"

target/%.html: $(SRC) $(CSS) | $(TARGET_DIR)
	pandoc --embed-resources --standalone -t revealjs "$<" -o "$@" \
		--toc --toc-depth=1 \
		--slide-level 2 \
		-V theme=sky \
		-V transition=convex \
		-V transitionSpeed=slow\
		-V progress=true \
		-V revealjs-url=./assets/reveal.js;

clean:
	rm -rf $(TARGET_DIR)

revealjs:
	curl -OL https://github.com/hakimel/reveal.js/archive/master.tar.gz
	tar -xzvf master.tar.gz
	mv reveal.js-master ./assets/reveal.js
