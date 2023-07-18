# This migration comes from saral_locatable (originally 20211124085651)
class AddMissingColumnToAdministrativeDistrict < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_administrative_districts, :deleted_at, :datetime, index: { name: :administrative_district_deleted_at_index }
    add_column :saral_locatable_administrative_districts, :svg_path, :string, null: true
    add_column :saral_locatable_administrative_districts, :total_estimate, :bigint
  end
end
