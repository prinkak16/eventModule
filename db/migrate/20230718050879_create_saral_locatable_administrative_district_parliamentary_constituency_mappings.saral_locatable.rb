# This migration comes from saral_locatable (originally 20211120115245)
class CreateSaralLocatableAdministrativeDistrictParliamentaryConstituencyMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_parliamentary_constituency_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_pc_mappings_ad_index' }
      t.references :saral_locatable_parliamentary_constituency, foreign_key: true, index: { name: 'pc_ad_mappings_pc_index' }

      t.timestamps
    end
  end
end
