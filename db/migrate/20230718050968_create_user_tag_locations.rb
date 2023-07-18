class CreateUserTagLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :user_tag_locations, if_not_exists: true do |t|
      t.references :user_tag, foreign_key: true
      t.integer :location_id
      t.string :location_type
      t.timestamps
    end

    unless column_exists? :user_tag_locations, :user_tag_id
      add_reference :user_tag_locations, :user_tag, foreign_key: true
    end

    unless column_exists? :user_tag_locations, :location_id
      add_column :user_tag_locations, :location_id, :integer, null: false
    end

    unless column_exists? :user_tag_locations, :location_type
      add_column :user_tag_locations, :location_type, :string, null: false
    end
  end

  def self.down
    drop_table :user_tag_locations
  end
end