class RemoveStateFromEvent < ActiveRecord::Migration[7.0]
  def change
    remove_column :events, :state_id
    add_index :event_users, [ :event_id, :phone_number ], unique: true
    add_foreign_key :event_user_locations, :event_users, index: true, foreign_key: true
  end
end
