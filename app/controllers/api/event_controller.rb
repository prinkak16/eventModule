class Api::EventController < Api::ApplicationController
  skip_before_action :verify_authenticity_token, only: :create_event
  require "net/https"
  require 'uri'

  def data_levels
    levels = DataLevel.select(:id, :name, :level_class)
    render json: {success: true, data: levels || [], message: "Data levels list."}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def states
    states = Saral::Locatable::State.select(:id, :name).order(:name)
    render json: {success: true, data: states || [], message: "States list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def pcs
    state_id = params[:state_id]
    pcs = Saral::Locatable::ParliamentaryConstituency.where(saral_locatable_state_id: state_id)
                                                     .select(:id, "(number || ' - ' || name) as name", :number)
                                                     .order('number::int')
    render json: {success: true, data: pcs || [], message: "Pcs list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def acs
    state_id = params[:state_id]
    acs = Saral::Locatable::AssemblyConstituency.where(saral_locatable_state_id: state_id)
                                                     .select(:id, "(number || ' - ' || name) as name", :number)
                                                     .order('number::int')
    render json: {success: true, data: acs || [], message: "Acs list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def zilas
    state_id = params[:state_id]
    zilas = Saral::Locatable::Zila.where(saral_locatable_state_id: state_id).select(:id, :name)
    render json: {success: true, data: zilas || [], message: "Zilas list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def mandals
    zila_id = params[:zila_id]
    mandals = Saral::Locatable::Zila.find_by(id: zila_id)&.get_mandals&.select(:id, :name)
    render json: {success: true, data: mandals || [], message: "Mandals list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def booths
    ac_id = params[:ac_id]
    booths = Saral::Locatable::AssemblyConstituency.find_by(id: ac_id)&.get_booths&.select(:id, "(number || ' - ' || name) as name", :number).order('number::int')
    render json: {success: true, data: booths || [], message: "Booths list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def sks
    ac_id = params[:ac_id]
    sks = Saral::Locatable::ShaktiKendra.where(saral_locatable_assembly_constituency_id: ac_id)&.select(:id, :name)
    render json: {success: true, data: sks || [], message: "Shakti kendras list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  def state_zones
    state_id = params[:state_id]
    state_zones = Saral::Locatable::StateZone.where(saral_locatable_state_id: state_id)&.select(:id, :name)
    render json: {success: true, data: state_zones || [], message: "State Zones list"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end

  # Create or update event and their event locations
  def create_event
    ActiveRecord::Base.transaction do
      begin
        locations = Saral::Locatable::State.where(id: params[:location_ids])

        if params[:event_id].present?
          event = Event.find_by(id: params[:event_id])
        else
          event = Event.new
        end

        if params[:img].present? && params[:img].include?('https://firebasestorage.googleapis.com')
          event.image_url = nil
          url = URI.parse(params[:img]).open
          event.image.attach(io: url, filename: "event#{params[:event_title]}.jpg")
        end
        event.name = params[:event_title]
        event.data_level_id = params[:level_id]
        event.event_type = params[:event_type]
        event.start_date = DateTime.iso8601(params[:start_datetime]) if params[:start_datetime].present?
        event.end_date = DateTime.iso8601(params[:end_datetime]) if params[:end_datetime].present?
        event.save!

        event.event_locations.destroy_all if event.event_locations.exists?

        locations.each do |location|
          EventLocation.where(location: location, event: event, state_id: location&.id).first_or_create!
        end

        render json: { success: true, message: "Event Submitted Successfully", event: ActiveModelSerializers::SerializableResource.new(event, each_serializer: EventSerializer, state_id: nil) }, status: 200
      rescue Exception => e
        render json: { success: false, message: e.message }, status: 400
        raise ActiveRecord::Rollback
      end
    end

  end

  def event_list
    query_conditions = {}
    query_conditions[:start_date] = params[:start_date] if params[:start_date].present?
    query_conditions[:data_level] = params[:level_id] if params[:level_id].present?
    query_conditions[:status_aasm_state] = params[:event_status] if params[:event_status].present?
    events = Event.where(query_conditions)
    events = events.joins(:event_locations).where(event_locations: {state_id: params[:state_id]}) if params[:state_id].present?
    render json: {
      data: ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id]),
      message: ['Event list'],
      status: 200,
      type: 'Success'
    }
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
  end
end
