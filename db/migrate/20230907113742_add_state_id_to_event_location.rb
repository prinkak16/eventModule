class AddStateIdToEventLocation < ActiveRecord::Migration[7.0]
  def change
    add_column :event_locations, :state_id, :integer
  end
end
