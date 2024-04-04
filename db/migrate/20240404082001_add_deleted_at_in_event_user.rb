class AddDeletedAtInEventUser < ActiveRecord::Migration[7.0]
  def change
    add_column :event_users, :deleted_at, :datetime
    add_index :event_users, :deleted_at
    add_column :event_user_locations, :deleted_at, :datetime
    add_index :event_user_locations, :deleted_at
  end
end
