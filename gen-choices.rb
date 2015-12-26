#!/usr/bin/env ruby

require 'json'

# Create an array to store our choice JSON
choices = []

# Iterate over game files
Dir.glob('data/games/*.json').each do |filename|
  json = JSON.parse(open(filename).read)

  # Make sure we have a name and ID
  if json['title'].nil? or json['id'].nil?
    puts "Error parsing #{filename}, skipping"
  end

  choices << {
    title: json["title"],
    id:    json["id"]
  }
end

choice_file = File.new('data/choices.json', 'w')
choice_file.write(JSON.generate(choices));
choice_file.close()
