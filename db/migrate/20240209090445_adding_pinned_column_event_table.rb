class AddingPinnedColumnEventTable < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :pinned, :boolean, default: false
  end
end
