# This migration comes from saral_locatable (originally 20211125112700)
class RemoveColumnLevelWiseDeletionFromState < ActiveRecord::Migration[6.1]
  def change
    remove_column :saral_locatable_states, :level_wise_deletion
  end
end
