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
    object&.image&.url || ''
  end

  def status
    object&.status_aasm_state
  end
end
