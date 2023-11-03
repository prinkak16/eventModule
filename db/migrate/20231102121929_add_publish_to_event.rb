class AddPublishToEvent < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :published, :boolean, default: false
  end
end
