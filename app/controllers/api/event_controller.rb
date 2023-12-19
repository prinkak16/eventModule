class Api::EventController < Api::ApplicationController
  require "net/https"
  require 'uri'
  include ApplicationHelper
  require "image_processing/mini_magick"
  before_action :authenticate_user_permission

  def data_levels
    levels = DataLevel.select(:id, :name, :level_class).order(:order_id)
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

  def pcs
    state_id = params[:state_id]
    pcs = Saral::Locatable::ParliamentaryConstituency.where(saral_locatable_state_id: state_id)
                                                     .select(:id, "(number || ' - ' || name) as name", :number)
                                                     .order('number::int')
    render json: { success: true, data: pcs || [], message: "Pcs list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def acs
    state_id = params[:state_id]
    acs = Saral::Locatable::AssemblyConstituency.where(saral_locatable_state_id: state_id)
                                                .select(:id, "(number || ' - ' || name) as name", :number)
                                                .order('number::int')
    render json: { success: true, data: acs || [], message: "Acs list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def zilas
    state_id = params[:state_id]
    zilas = Saral::Locatable::Zila.where(saral_locatable_state_id: state_id).select(:id, :name)
    render json: { success: true, data: zilas || [], message: "Zilas list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def mandals
    zila_id = params[:zila_id]
    mandals = Saral::Locatable::Zila.find_by(id: zila_id)&.get_mandals&.select(:id, :name)
    render json: { success: true, data: mandals || [], message: "Mandals list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def booths
    ac_id = params[:ac_id]
    booths = Saral::Locatable::AssemblyConstituency.find_by(id: ac_id)&.get_booths&.select(:id, "(number || ' - ' || name) as name", :number).order('number::int')
    render json: { success: true, data: booths || [], message: "Booths list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def sks
    ac_id = params[:ac_id]
    sks = Saral::Locatable::ShaktiKendra.where(saral_locatable_assembly_constituency_id: ac_id)&.select(:id, :name)
    render json: { success: true, data: sks || [], message: "Shakti kendras list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def state_zones
    state_id = params[:state_id]
    state_zones = Saral::Locatable::StateZone.where(saral_locatable_state_id: state_id)&.select(:id, :name)
    render json: { success: true, data: state_zones || [], message: "State Zones list" }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  # Create or update event and their event locations
  def create_event
    ActiveRecord::Base.transaction do
      begin
        locations = Saral::Locatable::State.where(id: [params[:location_ids].split(',')])
        if params[:event_id].present?
          event = Event.find_by(id: params[:event_id])
        else
          event = Event.new
        end
        new_record = event.new_record?
        inherit_from_parent = params[:inherit_from_parent].downcase == "true" ? true : false
        if params[:parent_id].present? && inherit_from_parent
          parent_event = Event.find_by_id(params[:parent_id])
          location_ids = EventLocation.where(event_id: params[:parent_id], location_type: "Saral::Locatable::State").pluck(:location_id)
          locations = Saral::Locatable::State.where(id: location_ids)
        end

        if params[:img].present? && !valid_url(params[:img])
          event.image_url = nil
          event.image = params[:img]

          cropped_image = ImageProcessing::MiniMagick.crop(params[:crop_data]).call(MiniMagick::Image.open(params[:img]))
          file_name = params[:img].original_filename
          event.image.attach(io: File.open(cropped_image), filename: file_name)
        end
        event.name = params[:event_title]
        if new_record
          event.data_level_id = inherit_from_parent.present? ? parent_event.data_level_id : params[:level_id]
        if new_record && inherit_from_parent
            event.data_level_id = parent_event.data_level_id
            event.start_date = parent_event.start_date
            event.end_date = parent_event.end_date
        elsif new_record
          event.data_level_id = params[:level_id]
          event.event_type = params[:event_type]
          event.has_sub_event = params[:has_sub_event]
          event.parent_id = params[:parent_id] if params[:parent_id].present?
        end
        event.end_date = inherit_from_parent.present? ? parent_event.end_date : params[:end_datetime].to_datetime
        event.start_date = inherit_from_parent.present? ? parent_event.start_date : params[:start_datetime].to_datetime
        event.created_by_id = current_user&.id
          event.start_date = params[:start_datetime].to_datetime
          event.end_date = params[:end_datetime].to_datetime
        end
        event.created_by_id = current_user&.id
        event.parent_id = params[:parent_id] if params[:parent_id].present?
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
      events = events.where("start_date >= ? AND end_date <= ?", params[:start_date].to_datetime.beginning_of_day, params[:end_date].to_datetime.end_of_day)
    end
    events = events.joins(:event_locations).where(event_locations: { state_id: params[:state_id] }) if params[:state_id].present?
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    total = events.size
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total
    }, status: :ok
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def event_user_list
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    date = DateTime.now
    events = Event.where(parent_id: nil, has_sub_event: true).or(Event.where(parent_id: nil, has_sub_event: false, published: true)).where("end_date >= ?", date).where("start_date <= ?", date)
    events = events.joins(:event_locations).where(event_locations: { state_id: current_user.sso_payload["country_state_id"] })
    events = events.where(event_locations: { state_id: params[:state_id] }) if params[:state_id].present?
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    total = events.count
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total,
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
      photo: current_user&.sso_payload['avatar'] || '',
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
    event = Event.where(id: params[:id])
    data = ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, state_id: '', current_user: current_user)
    render json: { success: true, data: data, message: "successfull" }, status: :ok
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
      child_events = event.children
      is_child = !event.has_sub_event
      render json: { success: true,
                     data: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, current_user: current_user),
                     child_data: ActiveModelSerializers::SerializableResource.new(child_events, each_serializer: EventSerializer, current_user: current_user),
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
      data[params[:id]] = [event.name, event.get_event_level]
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
                     data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, current_user: current_user) }, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

  def user_list_children
    begin
      event = Event.find_by_id(params[:id])
      child_events = event.children.where.not(has_sub_event: false, published: false).order(start_date: :desc)
      is_child = !event.has_sub_event
      render json: { success: true,
                     data: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, current_user: current_user),
                     child_data: ActiveModelSerializers::SerializableResource.new(child_events, each_serializer: EventSerializer, current_user: current_user),
                     is_child: is_child}, status: :ok
    rescue => e
      puts e.message
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end
