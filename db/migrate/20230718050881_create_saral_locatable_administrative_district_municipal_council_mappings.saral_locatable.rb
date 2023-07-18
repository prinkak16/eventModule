# This migration comes from saral_locatable (originally 20211120214612)
class CreateSaralLocatableAdministrativeDistrictMunicipalCouncilMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_municipal_council_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_municipal_council_mappings_ad_index' }
      t.references :saral_locatable_municipal_council, foreign_key: true, index: { name: 'municipal_council_ad_mappings_municipal_council_index' }

      t.timestamps
    end
  end
end
