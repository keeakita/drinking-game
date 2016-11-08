#!/bin/env ruby
#
# Converts "old format" JSON to "new format"
#

require 'json'

json_files = Dir.glob('data/games/*.json')

json_files.each do |json_file|
  json = JSON.parse(File.read(json_file))

  if json['captions'].nil?
    # Set default captions
    json['captions'] = {
      'drinks' => [
        'Drink everytime a candidate...',
        'Drink everytime you hear...'
      ],
      'shots' => 'Shots when you hear...'
    }
  end

  # Set move the drinks
  unless json['everytime'].nil?
    json['drinks'] = [
      json['everytime']['actions'],
      json['everytime']['phrases']
    ]

    json['shots'] = json['everytime']['shots']

    json.delete('everytime')
  end

  outfile = File.open(json_file, 'w');
  outfile.write JSON.pretty_generate(json, indent: '    ')
  outfile.close
end
