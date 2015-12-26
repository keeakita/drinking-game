HAML = $(wildcard *.haml)
HTML = $(patsubst %.haml,%.html,$(HAML))
GAMES = $(wildcard data/games/*.json)

all: $(HTML) index.html data/choices.json

%.html: %.haml
	haml $^ > $@

data/choices.json: $(GAMES)
	bundle exec ruby ./gen-choices.rb

.PHONY: clean .DELETE_ON_ERROR
clean:
	-rm *.html
	-rm data/choices.json
