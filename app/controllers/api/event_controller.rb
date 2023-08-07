class Api::EventController < Api::ApplicationController
  skip_before_action :verify_authenticity_token, only: :create_event

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

  def create_event
    event = Event.new
    event.name = params[:event_title]
    event.data_level_id = params[:level_id]
    event.image_url = params[:image_url]
    event.event_type= params[:event_type]
    event.state_id = Saral::Locatable::State.where(id: params[:state_id]).first
    event.start_date = DateTime.parse(params[:start_date])
    event.end_date = DateTime.parse(params[:end_date])
    event.save
    data_level_class = DataLevel.where(id:params[:level_id]).first.level_class
    if data_level_class == 'CountryState'
      data_level_class = 'State'
    end
    locations = Saral::Locatable.const_get(data_level_class).where(id: params[:location_ids])
    locations.each do |loc|
      event_location = EventLocation.new
      event_location.location = loc
      event_location.event = event
      event_location.save
    end
    render json: {success: true, message: "Event Created", event: event}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
    puts(params)
  end

  def event_list
    query_conditions = {}
    query_conditions[:start_date] = params[:start_date] if params[:start_date].present?
    query_conditions[:data_level] = params[:level_id] if params[:level_id].present?
    query_conditions[:state_id] = params[:state_id] if params[:state_id].present?
    query_conditions[:status_aasm_state] = params[:event_status] if params[:event_status].present?
    # event location is not giving date as required in UI
    events = Event.joins(:event_location, :data_level).where(query_conditions).select('events.id as id', 'events.name as name', 'events.start_date start_date', 'events.end_date as end_date',:image_url,'events.status_aasm_state as status', 'data_levels.name as level','event_locations.location_type as event_location_type')
    render json: {success: true, data: events, message: "Events List"}, status: 200
  rescue StandardError => e
    render json: { success: false, message: e.message }, status: 400
    puts(params)
  end


  def parse_date(date_string)
    DateTime.parse(date_string)
  rescue ArgumentError
    Date.current
  end
end
