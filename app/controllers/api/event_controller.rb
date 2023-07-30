class Api::EventController < Api::ApplicationController

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
end

def hindi_to_hinglish(name)

  hin_consonants = {क:'k', ख:'kh', ग:'g', घ:'gh', ङ:'ṅ', च:'c', छ:'ch', ज:'j', झ:'jh', ञ:'n', ट:'t', ठ:'th', ड:'d', ढ:'dh', ण:'n', त:'t', थ:'th', द:'d', ध:'dh', न:'n', प:'p', फ:'ph', ब:'b', भ:'bh', म:'m', य:'y', र:'r', ल:'l', व:'v', श:'sh', ष:'sh', स:'s', ह:'h', क्ष:'ksh', त्र:'tr', ज्ञ:'gy'}
  hin_vowels = {अ:'a', आ:'a', इ:'i', ई:'ee', उ:'u', ऊ:'oo', ऋ:'ri', ॠ:'ri', ऌ:'li', ॡ:'li', ए:'e', ऐ:'ai', ओ:'o', औ:'au', अं:'an', अः:'an', अँ:'an'}
  hin_matras = {ा:'a', ि:'i', ी:'ee', ु:'u', ू:'oo', ृ:'ri', ॄ:'ri', ॢ:'li', ॣ:'li', े:'e', ै:'ai', ो:'o', ौ:'au', ं:'an', ः:'an', ँ:'an'}
  extra_r = {्:"r"}

  n_a = name.split('')

  c_n = ''
  n_a.each_with_index do |n, index|

    if hin_consonants.key?(n.to_sym)
      c_n += hin_consonants[n.to_sym]
      if n_a.length > index
        next_obj = n_a[index+1]
        unless next_obj == nil
          unless hin_matras.key?(next_obj.to_sym)
            unless extra_r.key?(next_obj.to_sym)
              c_n += 'a'
            end
          end
        end
      end
    end

    if hin_vowels.key?(n.to_sym)
      c_n += hin_vowels[n.to_sym]
    end

    if hin_matras.key?(n.to_sym)
      c_n += hin_matras[n.to_sym]
    end
  end
  return c_n
end