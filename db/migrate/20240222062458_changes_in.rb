class ChangesIn < ActiveRecord::Migration[7.0]
  def change
    remove_column :events, :created_by_id
    remove_column :events, :data_level_id
    add_column :events, :created_by_id, :integer
    add_column :events, :data_level_id, :integer
  end
end
