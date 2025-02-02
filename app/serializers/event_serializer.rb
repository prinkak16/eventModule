class EventSerializer < ActiveModel::Serializer
  attributes :id, :name, :start_date, :end_date, :data_level_id, :event_type, :data_level, :start_datetime, :end_datetime, :status, :states, :image_url, :state_ids, :create_form_url, :preview_url, :event_level, :has_sub_event, :parent_id, :translated_title, :is_hidden

  def name
    object.get_title(instance_options[:language_code].present? ? instance_options[:language_code]: 'en')
  end

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
    state_names = []
    object.event_locations.each do |locations|
      state_names << locations.location.name
    end
    "#{state_names.take(2).join(',')} #{state_names.size > 2 ? "+ #{state_names.size - 2}" : ''}"
  end

  def image_url
    object&.get_image_url || ''
  end

  def status
    if DateTime.now.in_time_zone(ENV['TIME_ZONE']).between?(object&.start_date&.in_time_zone(ENV['TIME_ZONE']), object&.end_date&.in_time_zone(ENV['TIME_ZONE']))
      { name: 'Active', class_name: 'event-status active-bg active-text' }
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) > DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      { name: 'Upcoming', class_name: 'event-status upcoming-bg upcoming-text' }
    elsif object&.start_date&.in_time_zone(ENV['TIME_ZONE']) < DateTime.now.in_time_zone(ENV['TIME_ZONE'])
      { name: 'Expired', class_name: 'event-status expired-bg expired-text' }
    end
  end

  def state_ids
    state_ids = []
    object.event_locations.each do |locations|
      state_ids << { "id": locations.location.id, "name": locations.location.name }
    end
    state_ids
  end

  def create_form_url
    if object.has_sub_event
      ""
    else
      "#{ENV['FORM_CREATE_URL']}?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}"
    end
  end
  def preview_url
    if object.has_sub_event
      ""
    else
      "#{ENV['FORM_CREATE_URL']}/preview?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}&hn=1"
    end
  end

  def token
    event_meta = {
      stateIds: object&.event_locations.pluck(:state_id),
      createRedirectionLink: ENV['ROOT_URL'] + 'events/edit/' + object.id.to_s,
      createRedirectionName: object.name,
      logo: object.get_image_url,
      translated_title: object&.translated_title
    }
    data = { eventId: object.id, formId: object.event_form.form_id, eventName: object.name,
             eventStartDate: object.start_date, isFormCreator: true, eventEndDate: object.end_date,
             user: { name: instance_options[:current_user].name }, dataLevel: object.data_level&.name, eventMeta: event_meta }
    JWT.encode(data, ENV['JWT_SECRET_KEY'].present? ? ENV['JWT_SECRET_KEY'] : '6F59CAC47E5AD7D5E5B8CA41E9173')
  end

  def event_level
    object.get_event_level
  end

  def is_hidden
    object.is_hidden
  end

end
