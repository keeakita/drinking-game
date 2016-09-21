#!/bin/bash

set -e
set -u
set -x

# Make sure the current ruby version is installed
export PATH="$HOME/.rbenv/bin:$PATH"
rbenv install $(cat .ruby-version) --skip-existing

# Build files to _site
bundle install --deployment
bundle exec make
rsync -a --delete css js data *.html _site/

# Copy to prod
rsync -rlptODv --chmod o=rx --delete _site/ web.oslers.us:/var/www-poop
