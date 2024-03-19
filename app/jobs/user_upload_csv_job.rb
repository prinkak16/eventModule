module UserUploadCsvJob
  include ApplicationHelper
  require 'csv'
  @queue = :user_upload

  def self.perform(event_id = nil, file_id = nil)
    event = Event.find_by(id: event_id)
    begin
      puts "trying with UTF-8"
      file = URI.open(event.csv_file.find_by(id: file_id).url)
      file.set_encoding(Encoding.find("UTF-8"))
    rescue => _
      puts "trying with ISO"
      file = URI.open(event.csv_file.find_by(id: file_id).url)
      file.set_encoding(Encoding.find("ISO-8859-1"))
    end
    chunk_size = 5000
    order = get_event_location_order(event.data_level.name)
    level = order.last
    CSV.parse(file.read, headers: true).each_slice(chunk_size) do |chunk|
      insert_array = []
      chunk.each do |row|
        if row['operation'] == 'delete'
          event_user = EventUser.find_by(event_id: event_id, phone_number: current_user.phone_number)
          country_state_id = CountryState.find_by(name: row['country_state'])
          event_user_location = EventUserLocation.find_by(event_user_id: event_user.id, location_type: row['location_type'], location_id: row['location_name'], country_state_id: country_state_id)
          event_user_location.destroy!
          locations = EventUserLocation.where(event_user_id: event_user.id)
          if locations.size.blank?
            event_user.destroy!
          end
        else
          country_state = CountryState.find_by_name(row['country_state'])
          case level
          when 'CountryState'
            location = level.constantize.where(name: row['location_name'])&.first
          when 'Mandal'
            location = Zila.where(name: row['location_filter'], country_state: country_state)&.first.get_mandals&.where(name: row['location_name'])&.first
          when 'ShaktiKendra'
            location = AssemblyConstituency.where(number: row['location_filter'], country_state: country_state)&.first&.get_shakti_kendras&.where(name: row['location_name'])&.first
          when 'Booth'
            location = AssemblyConstituency.where(number: row['location_filter'], country_state: country_state)&.first&.get_booths&.where(number: row['location_name'])&.first
          when 'ParliamentaryConstituency', 'AssemblyConstituency'
            location = level.constantize.where(number: row['location_name'], country_state: country_state)&.first
          else
            location = level.constantize.where(name: row['location_name'], country_state: country_state)&.first
          end
          if location.present?
            event_user = EventUser.new
            event_user.event_id = event.id
            event_user.phone_number = row['phone_number']
            event_user.event_user_locations.build(country_state_id: row['country_state_id'], location: location )
            insert_array << event_user
          else
            next
          end
        end
      end
      begin
        EventUser.import insert_array, recursive: true, batch_size: 5000, on_duplicate_key_ignore: true
      rescue => e
        puts e.message
      end
    end
  end

  def self.get_event_location_order(data_level = nil)
    case data_level
    when "Pradesh"
      ["CountryState"]
    when "Vibhag"
      ["CountryState", "StateZone"]
    when "Sambhag"
      ["CountryState", "StateZone"]
    when "Lok Sabha"
      ["CountryState", "ParliamentaryConstituency"]
    when "Zila"
      ["CountryState", "Zila"]
    when "Vidhan Sabha"
      ["CountryState", "AssemblyConstituency"]
    when "Mandal"
      ["CountryState", "Zila", "Mandal"]
    when "Shakti Kendra"
      ["CountryState", "AssemblyConstituency", "ShaktiKendra"]
    when "Booth"
      ["CountryState", "AssemblyConstituency", "Booth"]
    when "Panna"
      ["CountryState", "AssemblyConstituency", "Booth", "Panna"]
    end
  end

end