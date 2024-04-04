class AddUniquenessInEventUsers < ActiveRecord::Migration[7.0]
  def change
    remove_index :event_users, [ :event_id, :phone_number ]
    add_index :event_users, [:event_id, :phone_number], unique: true
    add_index :event_user_locations, [ :event_user_id, :phone_number, :country_state_id, :location_type, :location_id ], name: 'index_event_user_locations_on_epcl', unique: true
  end
end
