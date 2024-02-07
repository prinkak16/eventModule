class AddDeleteAtColumn < ActiveRecord::Migration[7.0]
  def change
    add_column :event_locations, :deleted_at, :datetime
    add_index :event_locations, :deleted_at
    add_column :event_forms, :deleted_at, :datetime
    add_index :event_forms, :deleted_at
  end
end
