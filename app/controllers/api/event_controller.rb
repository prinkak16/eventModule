class Api::EventController < Api::ApplicationController
  require "net/https"
  require 'uri'
  include ApplicationHelper
  require "image_processing/mini_magick"
  before_action :authenticate_user_permission

  def data_levels
    levels = DataLevel.select(:id, :name, :level_class).order(order_id: :desc)
    render json: { success: true, data: levels || [], message: "Data levels list." }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def states
    if params[:parent_id].present?
      states = Event.find_by(id: params[:parent_id]).get_states
    else
      states = country_states_with_create_permission
    end
    render json: { success: true, data: states || [], message: "States list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  # Create or update event and their event locations
  def create_event
    ActiveRecord::Base.transaction do
      begin
        locations = CountryState.where(id: [params[:location_ids].split(',')])
        if params[:event_id].present?
          event = Event.find_by(id: params[:event_id])
        else
          event = Event.new
        end
        new_record = event.new_record?
        inherit_from_parent = params[:inherit_from_parent].downcase == "true" ? true : false
        if params[:parent_id].present? && inherit_from_parent
          parent_event = Event.find_by_id(params[:parent_id])
          location_ids = EventLocation.where(event_id: params[:parent_id], location_type: "CountryState").pluck(:location_id)
          locations = CountryState.where(id: location_ids)
        end
        if params[:img].present? && !valid_url(params[:img])
          event.image_url = nil
          event.image = params[:img]
          cropped_image = ImageProcessing::MiniMagick.crop(params[:crop_data]).call(MiniMagick::Image.open(params[:img]))
          file_name = params[:img].original_filename
          event.image.attach(io: File.open(cropped_image), filename: file_name)
        end
        if new_record
          event.data_level_id = (parent_event.present? && inherit_from_parent) ? parent_event.data_level_id : params[:level_id]
          event.event_type = (parent_event.present? && inherit_from_parent) ? parent_event.event_type : params[:event_type]
          event.has_sub_event = params[:has_sub_event]
          event.parent_id = params[:parent_id] if params[:parent_id].present?
        end
        event.name = params[:event_title]
        event.translated_title = params[:translated_title] if params[:translated_title].present?
        event.start_date = (parent_event.present? && inherit_from_parent) ? parent_event.start_date : params[:start_datetime].to_datetime
        event.end_date = (parent_event.present? && inherit_from_parent) ? parent_event.end_date : params[:end_datetime].to_datetime
        event.created_by_id = current_user&.id
        if params[:event_type] == "csv_upload"
          if inherit_from_parent
            event.csv_file.attach(parent_event.csv_file.blob)
          else
            event.csv_file.attach(params[:file])
          end
        end
        event.save!
        if new_record
          locations.each do |location|
            EventLocation.where(location: location, event: event, state_id: location&.id).first_or_create!
          end
          EventForm.create!(event_id: event.id, form_id: SecureRandom.uuid) if params[:allow_create_sub_event].blank? #only leaf event can create form
        end
        event = Event.find(event.id)
        if event.event_type == 'csv_upload' && !check_if_already_in_progress( queue: "user_upload", args: [event.id, event.csv_file.last.id])
          Resque.enqueue(UserUploadCsvJob, event.id, event.csv_file.last.id )
        end
        render json: { success: true, message: "Event Submitted Successfully", event: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, state_id: nil, current_user: current_user) }, status: 200
      rescue Exception => e
        render json: { success: false, message: e.message }, status: 400
        raise ActiveRecord::Rollback
      end
    end
  end

  def event_list
    query_conditions = {}
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    query_conditions[:data_level] = params[:level_id] if params[:level_id].present?
    event_status = params[:event_status]
    event_level = params[:event_level].present? ? params[:event_level] : ""
    event_ids = Event.joins(:event_locations).where(event_locations: { state_id: country_states_with_create_permission.pluck(:id) }).pluck(:id).uniq
    events = Event.where(query_conditions).where(id: event_ids)
    if event_level == Event::TYPE_INTERMEDIATE
      events = events.where.not(parent_id: nil).where.not(has_sub_event: false)
    elsif event_level == Event::TYPE_LEAF
      events = events.where.not(parent_id: nil).where.not(has_sub_event: true)
    else
      events = events.where(parent_id: nil)
    end
    date = DateTime.now
    if event_status == "Upcoming"
      events = events.where("start_date >= ?", date)
    elsif event_status == "Expired"
      events = events.where("end_date <= ?", date)
    elsif event_status == "Active"
      events = events.where("start_date <= :query AND end_date >= :query", query: "#{date}")
    elsif params[:start_date].present? && params[:end_date].present?
      events = events.where("start_date >= ? AND end_date <= ?", params[:start_date].to_datetime - Rational(5, 24) - Rational(30, 1440), params[:end_date].to_datetime + Rational(18, 24) + Rational(29, 1440))
    end
    events = events.joins(:event_locations).where(event_locations: { state_id: params[:state_id] }) if params[:state_id].present?
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    events = events.where(pinned: false)
    pinned_events = events.where(pinned: true).order(:position)
    pinned_events_size = pinned_events.size
    total = events.size
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, language_code: params[:language_code], state_id: params[:state_id], current_user: current_user),
      pinned_events: ActiveModelSerializers::SerializableResource.new(pinned_events, each_serializer: EventSerializer, language_code: params[:language_code], state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total,
      pinned_events_size: pinned_events_size
    }, status: :ok
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def event_user_list
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    date = DateTime.now
    state_id = params[:state_id].present? ? params[:state_id] : current_user.country_state_id
    events = Event.includes(:event_users)
    events = events.where(parent_id: nil, has_sub_event: true).or(events.where(parent_id: nil, has_sub_event: false, published: true)).or(events.where(event_users: { phone_number: current_user.phone_number })).where("end_date >= ? AND start_date <= ?", date, date).where(is_hidden: false)
    events = events.joins(:event_locations).where(event_locations: { state_id: state_id })
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    events = events.where(pinned: false)
    pinned_events = events.where(pinned: true)
    pinned_events_size = pinned_events.size
    total = events.count
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, language_code: params[:language_code], state_id: params[:state_id], current_user: current_user),
      pinned_events: ActiveModelSerializers::SerializableResource.new(pinned_events, each_serializer: EventSerializer, language_code: params[:language_code], state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total,
      pinned_events_size: pinned_events_size
    }, status: :ok
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def valid_url(url)
    uri = URI.parse(url)
    !uri.host.nil?
  rescue URI::InvalidURIError
    false
  end

  def login_user_detail
    data = {
      name: current_user&.name || '',
      email: current_user&.email || '',
      phone_number: current_user&.phone_number || '',
      photo: current_user&.avatar || '',
      logout_url: ENV['SIGN_OUT_URL']
    }
    render json: {
      data: data,
      message: "User detail",
      success: true
    }, status: :ok
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def edit
    begin
      event = Event.where(id: params[:id])
      min_start_datetime = event.first.children.present? ? event.first.children.minimum(:start_date) : nil
      max_end_datetime = event.first.children.present? ? event.first.children.maximum(:end_date) : nil
      data = ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, state_id: '', current_user: current_user)
      render json: { success: true, data: data, start_datetime: min_start_datetime, end_datetime: max_end_datetime, message: "successfull" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def event_archive
    begin
      data = Event.find_by_id(params[:id])
      raise StandardError, 'Error Deleting Submission' if data.blank?
      data.destroy!
      render json: { success: true, data: data, message: "successfully Archive" }, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
      raise ActiveRecord::Rollback, e.message
    end
  end

  def event_publish
    event = Event.find_by(id: params[:id])
    event.update(published: true)
    render json: { success: true, data: event, message: "successful" }, status: 200
  end

  def individual_event_data
    begin
      event = Event.find_by_id(params[:id])
      child_events = event.children.order(position: :asc)
      is_child = !event.has_sub_event
      render json: { success: true,
                     data: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, language_code: params[:language_code], current_user: current_user),
                     child_data: ActiveModelSerializers::SerializableResource.new(child_events, each_serializer: EventSerializer, language_code: params[:language_code], current_user: current_user),
                     is_child: is_child}, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_reques
    end
  end

  def get_event_path
    begin
      data = Hash.new
      event = Event.find_by_id(params[:id])
      data[params[:id]] = [event.get_title, event.get_event_level]
      while event.parent_id.present?
        parent_id = event.parent_id
        event = Event.find_by_id(event.parent_id)
        data[parent_id] = [event.name, event.get_event_level]
      end
      reversed_data = Hash[data.to_a.reverse]
      render json: { success: true, message: "Record Fetched Successfully", data: reversed_data }, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def get_event_children
    begin
      events = Event.find_by_id(params[:id]).children
      render json: { success: true,
                     data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, language_code: params[:language_code], current_user: current_user) }, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def user_list_children
    begin
      event = Event.find_by_id(params[:id])
      child_events = event.children.joins(:event_locations).where(event_locations: { state_id: current_user.country_state_id }, is_hidden: false).where.not(has_sub_event: false, published: false).order(:position)
      puts "Vijay - #{child_events}"
      is_child = !event.has_sub_event
      render json: { success: true,
                     data: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, language_code: params[:language_code], current_user: current_user),
                     child_data: ActiveModelSerializers::SerializableResource.new(child_events, each_serializer: EventSerializer, language_code: params[:language_code], current_user: current_user),
                     is_child: is_child}, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def pin_event
    begin
      event = Event.find_by(id: params[:event_id])
      operation = params[:operation] == "pin" ? true : false
      event.update!(pinned: operation)
      if operation == false
        event.update!(position: nil)
      end
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def update_position
    begin
      data = params[:data].to_a
      index = 1
      data.each do |event_position|
        event = Event.find_by(id: event_position)
        event.set_list_position(index) if event.present?
        puts "event - #{event_position} , index - #{index}"
        index = index + 1
      end
      render json: { success: true, message: "position updated successfully" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def set_event_to_hidden
    begin
      operation = params[:is_hidden] == true
      events = Event.where(id: params[:event_id])
      children_event = events
      loop do
        children_event = Event.where(parent: children_event)
        break if children_event.blank?
        events = events.or(children_event)
      end
      events.update_all(is_hidden: operation)
      render json: { success: true, message: "Record Updation for #{operation ? "Hide" : "Unhide" } Successfully" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def get_latest_uploaded_csv
    begin
      csv_records = Event.includes(:csv_file_attachments).where.not(csv_file_attachments: { id: nil })
      all_csv_files = csv_records.map(&:csv_file).flatten
      sorted_csv_files = all_csv_files.sort_by(&:created_at).reverse
      records = sorted_csv_files.take(5)
      data = []
      records.each do |record|
        data << { file_name: record.filename.to_json, date: record.created_at.strftime("%d-%m-%y %I:%M:%S %p") }
      end
      render json: { success: true, message: "Record Fetched Successfully", data: data }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def get_event_user_location
    begin
      limit = params[:limit].present? ? params[:limit] : 10
      offset = params[:offset].present? ? params[:offset] : 0
      search_query = params[:search_query].present? ? params[:search_query] : ""
      event_user_ids = EventUser.where(event_id: params[:event_id]).pluck(:id)
      headers = [ "Phone Number" , "State", "Location Type", "Location Name", "Location Filter" ]
      if event_user_ids.present?
        data = []
        location_data = EventUserLocation.where(event_user_id: event_user_ids).group(:location_type).count
        total_count = 0
        location_data.each_value do |value|
          total_count += value
        end
        location_data["Total Count"] = total_count
        event_user_location = EventUserLocation.joins(:event_user).where(event_user_id: event_user_ids).where("event_users.phone_number LIKE ?", "%#{search_query}%")
        count = event_user_location.count
        event_user_location = event_user_location.limit(limit).offset(offset)
        event_user_location.each do |doc|
          data << [ doc.event_user.phone_number, doc.country_state.name, doc.location_type, doc.location_id ]
        end
      else
        location_data = Hash.new
        location_data["Total Count"] = 0
        data = []
      end
      render json: { success: true, message: "Record Fetched Successfully", location_data: location_data , data: data, headers: headers, count: count }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def remove_event_user_location
    begin
      event_user = EventUser.find_by(event_id: params[:event_id], phone_number: params[:phone_number])
      country_state_id = CountryState.find_by(name: params[:country_state_name])
      if event_user.present?
        event_user_location = EventUserLocation.find_by(event_user_id: event_user.id, location_type: params[:location_type], location_id: params[:location_id], country_state_id: country_state_id)
        event_user_location.destroy!
        locations = EventUserLocation.where(event_user_id: event_user.id)
        if locations.size.blank?
          event_user.destroy!
        end
      end
      render json: { success: true, message: "Record Deleted Successfully" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def schedule_event_user_location_job
    begin
      event = Event.find_by(id: params[:event_id])
      event.csv_file.attach(params[:file])
      if !check_if_already_in_progress( queue: "user_upload", args: [event.id, event.csv_file.order(created_at: :desc).last.id])
        Resque.enqueue(UserUploadCsvJob, event.id, event.csv_file.order(created_at: :desc).last.id )
      end
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end
end