module UserUploadCsvJob
  include ApplicationHelper
  require 'csv'
  require 'open-uri'
  @queue = :user_upload

  def self.perform(event_id = nil, file_id = nil)
    event = Event.find_by(id: event_id)
    blob = event.csv_file.find_by(id: file_id).blob
    batch_size = 5000
    order = get_event_location_order(event.data_level.name)
    level = order.last
    if blob.present?
      blob.open do |file|
        batch = []
        parent_array = []
        child_array = []
        CSV.foreach(file, headers: true) do |row|
          if batch.size < batch_size
            batch << row
            next
          end
          batch.each do |batch_row|
            if batch_row['operation'] == 'delete'
              event_user = EventUser.find_by(event_id: event_id, phone_number: batch_row['phone_number'])
              country_state_id = CountryState.find_by(name: batch_row['country_state'])
              event_user_location = EventUserLocation.find_by(event_user_id: event_user.id, location_type: batch_row['location_type'], location_id: batch_row['location_name'], country_state_id: country_state_id)
              event_user_location.destroy!
              locations = EventUserLocation.where(event_user_id: event_user)
              if locations.size.blank?
                event_user.destroy!
              end
            else
              country_state = CountryState.find_by(name: batch_row['country_state'])
              case level
              when 'CountryState'
                location = level.constantize.where(name: batch_row['location_name'])&.first
              when 'Mandal'
                location = Zila.where(name: batch_row['location_filter'], country_state: country_state)&.first.get_mandals&.where(name: batch_row['location_name'])&.first
              when 'ShaktiKendra'
                location = AssemblyConstituency.where(number: batch_row['location_filter'], country_state: country_state)&.first&.get_shakti_kendras&.where(name: batch_row['location_name'])&.first
              when 'Booth'
                location = AssemblyConstituency.where(number: batch_row['location_filter'], country_state: country_state)&.first&.get_booths&.where(number: batch_row['location_name'])&.first
              when 'ParliamentaryConstituency', 'AssemblyConstituency'
                location = level.constantize.where(number: batch_row['location_name'], country_state: country_state)&.first
              else
                location = level.constantize.where(name: batch_row['location_name'], country_state: country_state)&.first
              end
              if location.present?
                parent_attrs = {
                  event_id: event.id,
                  phone_number: batch_row['phone_number']
                }
                child_attrs = {
                  country_state_id: country_state.id,
                  phone_number: batch_row['phone_number'],
                  location: location
                }
                parent_array << EventUser.new(parent_attrs)
                child_array << EventUserLocation.new(child_attrs)
              else
                next
              end
            end
          end
          begin
            EventUser.import parent_array, batch_size: batch_size, on_duplicate_key_ignore: true
            event_user_map = Hash[EventUser.where(event_id: event.id).pluck(:phone_number, :id)]
            child_array.each { |event_user_location| event_user_location.event_user_id = event_user_map[event_user_location.phone_number]  }
            EventUserLocation.import child_array, batch_size: batch_size, on_duplicate_key_ignore: true
          rescue => e
            puts e.message
          end
          parent_array = []
          child_array = []
          batch = []
        end
        if batch.present?
          batch.each do |batch_row|
            if batch_row['operation'] == 'delete'
              event_user = EventUser.find_by(event_id: event_id, phone_number: batch_row['phone_number'])
              country_state_id = CountryState.find_by(name: batch_row['country_state'])
              event_user_location = EventUserLocation.find_by(event_user_id: event_user.id, location_type: batch_row['location_type'], location_id: batch_row['location_name'], country_state_id: country_state_id)
              event_user_location.destroy!
              locations = EventUserLocation.where(event_user_id: event_user.id)
              if locations.size.blank?
                event_user.destroy!
              end
            else
              country_state = CountryState.find_by(name: batch_row['country_state'])
              case level
              when 'CountryState'
                location = level.constantize.where(name: batch_row['location_name'])&.first
              when 'Mandal'
                location = Zila.where(name: batch_row['location_filter'], country_state: country_state)&.first.get_mandals&.where(name: batch_row['location_name'])&.first
              when 'ShaktiKendra'
                location = AssemblyConstituency.where(number: batch_row['location_filter'], country_state: country_state)&.first&.get_shakti_kendras&.where(name: batch_row['location_name'])&.first
              when 'Booth'
                location = AssemblyConstituency.where(number: batch_row['location_filter'], country_state: country_state)&.first&.get_booths&.where(number: batch_row['location_name'])&.first
              when 'ParliamentaryConstituency', 'AssemblyConstituency'
                location = level.constantize.where(number: batch_row['location_name'], country_state: country_state)&.first
              else
                location = level.constantize.where(name: batch_row['location_name'], country_state: country_state)&.first
              end
              if location.present?
                parent_attrs = {
                  event_id: event.id,
                  phone_number: batch_row['phone_number']
                }
                child_attrs = {
                  country_state_id: country_state.id,
                  phone_number: batch_row['phone_number'],
                  location: location
                }
                parent_array << EventUser.new(parent_attrs)
                child_array << EventUserLocation.new(child_attrs)
              else
                next
              end
            end
          end
          begin
            EventUser.import parent_array, batch_size: batch_size, on_duplicate_key_ignore: true
            event_user_map = Hash[EventUser.where(event_id: event.id).pluck(:phone_number, :id)]
            child_array.each { |event_user_location| event_user_location.event_user_id = event_user_map[event_user_location.phone_number]  }
            EventUserLocation.import child_array, batch_size: batch_size, on_duplicate_key_ignore: true
          rescue => e
            puts e.message
          end
        end
        puts "Done"
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