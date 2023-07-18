# This migration comes from saral_locatable (originally 20211207083808)
class RenameAdministrativeDistrictMuncipalCouncilMappings < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_municipal_council_mapping RENAME TO saral_locatable_ad_m_council_mappings"
  end

  def down
    execute "ALTER TABLE saral_locatable_ad_m_council_mappings RENAME TO saral_locatable_administrative_district_municipal_council_mapping"
  end
end
