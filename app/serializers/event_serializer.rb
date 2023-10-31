class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :start_date, :end_date, :data_level_id, :event_type, :data_level, :start_datetime, :end_datetime, :status, :states, :image_url, :state_ids, :create_form_url, :submit_form_url

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
      {name: 'Active', class_name: 'event-status active-bg active-text'}
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) >  DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      {name: 'Upcoming', class_name: 'event-status upcoming-bg upcoming-text'}
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) <  DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      {name: 'Expired', class_name: 'event-status expired-bg expired-text'}
    end
  end
  def state_ids
    object&.event_locations.joins(:state).select('saral_locatable_states.id as id, saral_locatable_states.name as name')
  end
  def create_form_url
    eventMeta = {
      stateIds: object.event_locations.pluck(:state_id),
      createRedirectionLink: ENV['ROOT_URL'] + 'event/edit_event/' + object.id.to_s,
      createRedirectionName: object.name,
      logo: object.get_image_url,
    }
    data = { eventId: object.id, formId: object.event_form.form_id, eventName: object.name, eventStartDate: object.start_date, isFormCreator: true, eventEndDate: object.end_date, user: {name: instance_options[:current_user].name}, dataLevel: object.data_level&.name, eventMeta:eventMeta}
    token = JWT.encode(data, ENV['JWT_SECRET_KEY'].present? ? ENV['JWT_SECRET_KEY'] : 'thisisasamplesecret')
    "#{ENV['FORM_CREATE_URL']}?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}"
  end

  def submit_form_url
    data = { eventId: object.id, formId: object.event_form.form_id, eventName: object.name, eventStartDate: object.start_date, isFormCreator: false, eventEndDate: object.end_date, user: {name: instance_options[:current_user].name}, dataLevel: object.data_level&.name, eventStateIds: object.event_locations.pluck(:state_id)}
    token = JWT.encode(data, ENV['JWT_SECRET_KEY'].present? ? ENV['JWT_SECRET_KEY'] : 'thisisasamplesecret')
    "#{ENV['FORM_SUBMIT_URL']}?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}"
  end
end
