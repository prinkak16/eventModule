# This migration comes from saral_locatable (originally 20230221065412)
class AddStateFkToLocationSync < ActiveRecord::Migration[7.0]
  def change
    add_column :saral_locatable_location_type_last_syncs, :saral_locatable_states_id, :bigint
    add_foreign_key :saral_locatable_location_type_last_syncs, :saral_locatable_states, column: :saral_locatable_states_id
  end
end
