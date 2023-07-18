# This migration comes from saral_locatable (originally 20211207084313)
class RenameAdministrativeDistrictNagarPanchayatMappings < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_nagar_panchayat_mapping RENAME TO saral_locatable_ad_nagar_panchayat_mappings"
  end

  def down
    execute "ALTER TABLE saral_locatable_ad_nagar_panchayat_mappings RENAME TO saral_locatable_administrative_district_nagar_panchayat_mapping"
  end
end
