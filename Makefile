HAML = $(wildcard *.haml)
HTML = $(patsubst %.haml,%.html,$(HAML))

all: $(HTML) index.html

%.html: %.haml
	haml $^ > $@

.PHONY: clean .DELETE_ON_ERROR
clean:
	-rm *.html
