# This migration comes from saral_locatable (originally 20211124105629)
class AddMissingColumnToStateZone < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_state_zones, :deleted_at, :datetime
  end
end
