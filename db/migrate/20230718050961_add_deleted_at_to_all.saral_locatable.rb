# This migration comes from saral_locatable (originally 20230227105553)
class AddDeletedAtToAll < ActiveRecord::Migration[7.0]
  def change
    add_column :saral_locatable_assembly_constituencies, :deleted_at, :datetime
    add_column :saral_locatable_gram_panchayat_wards, :deleted_at, :datetime
    add_column :saral_locatable_gram_panchayats, :deleted_at, :datetime
    add_column :saral_locatable_municipal_corporations, :deleted_at, :datetime
    add_column :saral_locatable_municipal_councils, :deleted_at, :datetime
    add_column :saral_locatable_nagar_panchayats, :deleted_at, :datetime
    add_column :saral_locatable_parliamentary_constituencies, :deleted_at, :datetime
    add_column :saral_locatable_taluka_panchayat_wards, :deleted_at, :datetime
    add_column :saral_locatable_taluka_panchayats, :deleted_at, :datetime
    add_column :saral_locatable_wards, :deleted_at, :datetime
    add_column :saral_locatable_zila_panchayat_wards, :deleted_at, :datetime
    add_column :saral_locatable_zila_panchayats, :deleted_at, :datetime
  end
end
