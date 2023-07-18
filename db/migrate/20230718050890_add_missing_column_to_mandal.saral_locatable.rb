# This migration comes from saral_locatable (originally 20211124085629)
class AddMissingColumnToMandal < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_mandals, :deleted_at, :datetime, index: { name: :mandal_deleted_at_index }
  end
end
