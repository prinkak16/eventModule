# This migration comes from saral_locatable (originally 20211207065401)
class RenameAdministrativeDistrictAssemblyConstituencyMapping < ActiveRecord::Migration[6.1]
  def up
    execute "ALTER TABLE saral_locatable_administrative_district_assembly_constituency_m RENAME TO saral_locatable_ad_ac_mappings"
  end
  def down
    execute "ALTER TABLE saral_locatable_ad_ac_mappings RENAME TO saral_locatable_administrative_district_assembly_constituency_m"
  end
end
