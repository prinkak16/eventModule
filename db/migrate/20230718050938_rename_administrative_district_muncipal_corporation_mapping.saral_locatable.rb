# This migration comes from saral_locatable (originally 20211207083611)
class RenameAdministrativeDistrictMuncipalCorporationMapping < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_municipal_corporation_mappings RENAME TO saral_locatable_ad_m_corporation_mappings"
  end

  def down
    execute "ALTER TABLE saral_locatable_ad_m_corporation_mappings RENAME TO saral_locatable_administrative_district_municipal_corporation_mappings"
  end
end
