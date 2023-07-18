# This migration comes from saral_locatable (originally 20211124085558)
class AddMissingColumnToBooth < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_booths, :village_name, :string
    add_column :saral_locatable_booths, :is_updating, :boolean, default: false, null: false
    add_column :saral_locatable_booths, :area_under_booth, :string
    add_column :saral_locatable_booths, :panchayat, :string
    add_column :saral_locatable_booths, :ward_number, :string
    add_column :saral_locatable_booths, :patwar_circle, :string
    add_column :saral_locatable_booths, :kanungo_circle, :string
    add_column :saral_locatable_booths, :hadbast_sankhya, :string
    add_column :saral_locatable_booths, :pin_code, :string
    add_column :saral_locatable_booths, :post_office, :string
    add_column :saral_locatable_booths, :police_station, :string
    add_column :saral_locatable_booths, :block, :string
    add_column :saral_locatable_booths, :revenue_division, :string
    add_column :saral_locatable_booths, :tehsil, :string
    add_column :saral_locatable_booths, :sub_division, :string
    add_column :saral_locatable_booths, :district, :string
    add_column :saral_locatable_booths, :deleted_at, :datetime, index: { name: :booth_deleted_at_index }
  end
end
