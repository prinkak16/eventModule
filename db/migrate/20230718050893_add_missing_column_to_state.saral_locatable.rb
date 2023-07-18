# This migration comes from saral_locatable (originally 20211124104825)
class AddMissingColumnToState < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_states, :state_code, :string
    add_column :saral_locatable_states, :latitude, :float
    add_column :saral_locatable_states, :longitude, :float
    add_column :saral_locatable_states, :zoom, :float
    add_column :saral_locatable_states, :svg_path, :string
    add_column :saral_locatable_states, :capital, :string
    add_column :saral_locatable_states, :office_address, :string
    add_column :saral_locatable_states, :preferences, :jsonb, default: {}
    add_column :saral_locatable_states, :deleted_at, :datetime
    add_column :saral_locatable_states, :level_wise_deletion, :jsonb, default: {}
    add_column :saral_locatable_states, :outer_svg_path, :string, null: true
  end
end
