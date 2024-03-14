class CreateTableEventUserLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :table_event_user_locations do |t|
      t.bigint :event_user_id
      t.string :location_type
      t.bigint :location_id
      t.integer :country_state_id
      t.timestamps
    end
  end
end
