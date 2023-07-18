# This migration comes from saral_locatable (originally 20211120115216)
class CreateSaralLocatableAdministrativeDistrictAssemblyConstituencyMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_assembly_constituency_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_ac_mappings_ad_index' }
      t.references :saral_locatable_assembly_constituency, foreign_key: true, index: { name: 'ac_ad_mappings_ac_index' }

      t.timestamps
    end
  end
end
