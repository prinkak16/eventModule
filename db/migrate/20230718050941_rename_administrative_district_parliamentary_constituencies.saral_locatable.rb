# This migration comes from saral_locatable (originally 20211207084724)
class RenameAdministrativeDistrictParliamentaryConstituencies < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_parliamentary_constitue RENAME TO saral_locatable_ad_pc_mappings"
  end

  def down
    execute "ALTER TABLE saral_locatable_ad_pc_mappings RENAME TO saral_locatable_administrative_district_parliamentary_constitue"
  end
end
