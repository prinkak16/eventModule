# This migration comes from saral_locatable (originally 20211201134337)
class CreateSaralLocatableAdministrativeDistrictMunicipalCorporationMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_municipal_corporation_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_municipal_corporation_mappings_ad_index' }
      t.references :saral_locatable_municipal_corporation, foreign_key: true, index: { name: 'municipal_corporation_ad_mappings_municipal_corporation_index' }

      t.timestamps
    end
  end
end
