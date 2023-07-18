# This migration comes from saral_locatable (originally 20211124100013)
class AddMissingColumnToZila < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_zilas, :deleted_at, :datetime, index: { name: :zila_deleted_at_index }
  end
end
