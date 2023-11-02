class Api::EventController < Api::ApplicationController
  require "net/https"
  require 'uri'
  include ApplicationHelper

  def data_levels
    levels = DataLevel.select(:id, :name, :level_class)
    render json: { success: true, data: levels || [], message: "Data levels list." }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def states
    states = Saral::Locatable::State.select(:id, :name).order(:name)
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

        if params[:img].present? && !valid_url(params[:img])
          event.image_url = nil
          event.image = params[:img]
        end
        event.name = params[:event_title]
        event.data_level_id = params[:level_id]
        event.event_type = params[:event_type]
        event.start_date = params[:start_datetime].to_datetime
        event.end_date = params[:end_datetime].to_datetime
        event.created_by_id = current_user&.id
        event.save!
        event.event_locations.destroy_all if event.event_locations.exists?
        locations.each do |location|
          EventLocation.where(location: location, event: event, state_id: location&.id).first_or_create!
        end
        EventForm.create!(event_id: event.id, form_id: SecureRandom.uuid)
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
    query_conditions[:start_date] = get_date_diff(params[:start_date].to_datetime) if params[:start_date].present?
    query_conditions[:data_level] = params[:level_id] if params[:level_id].present?
    query_conditions[:status_aasm_state] = params[:event_status] if params[:event_status].present?
    events = Event.where(query_conditions)
    events = events.joins(:event_locations).where(event_locations: { state_id: params[:state_id] }) if params[:state_id].present?
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    total = events.count
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total
    }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def event_user_list
    limit = params[:limit].present? ? params[:limit] : 10
    offset = params[:offset].present? ? params[:offset] : 0
    date = DateTime.now
    events = Event.where("end_date >= ?", date).where("start_date <= ?", date).where(published: true)
    events = events.joins(:event_locations).where(event_locations: { state_id: params[:state_id] }) if params[:state_id].present?
    events = events.where("lower(name) LIKE ?", "%#{params[:search_query].downcase}%") if params[:search_query].present?
    total = events.count
    events = events.order(created_at: :desc).limit(limit).offset(offset)
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user),
      message: ['Event list'],
      success: true,
      total: total,
    }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def get_date_diff(date)
    date = date + 5.50.hours
    (date.beginning_of_day..date.end_of_day)
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
    }, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def event_page
    render json: { success: true, message: "Hello World!!!" }, status: 200
  end

  def edit
    event = Event.where(id: params[:id])
    data = ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, state_id: '', current_user: current_user)
    render json: { success: true, data: data, message: "success full" }, status: 200
  end
  def event_archive
    data = Event.find_by_id(params[:id])
    raise StandardError, 'Error Deleting Submission' if data.blank?
    data.destroy!
    render json: { success: true, data:data, message: "successfully deleted" }, status: 200
  rescue => e
    render json: { message: e.message }, status: 400
  end

  def event_publish
    data = Event.where(id: params[:id])
    render json: { success: true, data: data, message: "success full" }, status: 200
  end
end
