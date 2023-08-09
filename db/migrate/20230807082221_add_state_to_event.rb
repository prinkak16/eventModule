class AddStateToEvent < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :state_id, :integer
  end
end
