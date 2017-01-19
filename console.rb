require 'json'

@data = JSON.load(File.read('./bs_survey.json'))

def webgl
  @data.map do |config|
    unless config['webgl'].nil?
      yield config['webgl']
    end
  end
end

def uniq_data key
  webgl{|w| w[key]}.uniq.compact
end

alias ud uniq_data
