class CreateEventLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :event_locations do |t|
      t.references :event, null: false, foreign_key: true
      t.references :location, polymorphic: true
      t.timestamps
    end
  end
end
