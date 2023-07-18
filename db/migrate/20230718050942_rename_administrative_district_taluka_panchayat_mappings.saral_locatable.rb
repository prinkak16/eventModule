# This migration comes from saral_locatable (originally 20211207084837)
class RenameAdministrativeDistrictTalukaPanchayatMappings < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_taluka_panchayat_mappin RENAME TO saral_locatable_ad_tp_mappings"
  end

  def down
    execute "ALTER TABLE saral_locatable_ad_tp_mappings RENAME TO saral_locatable_administrative_district_taluka_panchayat_mappin"
  end
end
