# This migration comes from saral_locatable (originally 20211118181512)
class CreateSaralLocatableBoothAdministrativeDistrictMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_booth_administrative_district_mappings do |t|
      t.references :saral_locatable_booth, foreign_key: true, index: { name: 'booth_ad_mappings_booth_index' }
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_booth_mappings_ad_index' }

      t.timestamps
    end
  end
end
