class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :data_level, :start_datetime, :end_datetime, :status, :states, :image_url

  def data_level
    object&.data_level&.name
  end

  def start_datetime
    object&.start_date&.in_time_zone(ENV['TIME_ZONE'])&.strftime("%d-%m-%y %I:%M:%S %p")
  end

  def end_datetime
    object&.end_date&.in_time_zone(ENV['TIME_ZONE'])&.strftime("%d-%m-%y %I:%M:%S %p")
  end

  # Here all event location will be state only
  def states
    state_id =  instance_options[:state_id]
    states = object&.event_locations.joins(:state)
    states = states.where(state_id: state_id) if state_id.present?
    state_names = states.pluck('saral_locatable_states.name')
    "#{state_names.take(2).join(',')} #{state_names.size > 2 ? "+ #{state_names.size - 2}" : ''}"
  end

  def image_url
    object&.get_image_url || ''
  end

  def status
    if DateTime.now.in_time_zone(ENV['TIME_ZONE']).between?(object&.start_date&.in_time_zone(ENV['TIME_ZONE']), object&.end_date&.in_time_zone(ENV['TIME_ZONE']))
      {status: 'Active', bg_color: '#CAF5D6', text_color: '#1D6B32'}
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) >  DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      {status: 'Upcoming', bg_color: '#DBE4FF', text_color: '#294188'}
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) <  DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      {status: 'Expired', bg_color: '#FFC3C3', text_color: '#A82A2A'}
    end
  end
end
