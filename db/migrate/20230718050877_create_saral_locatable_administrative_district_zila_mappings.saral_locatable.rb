# This migration comes from saral_locatable (originally 20211120115042)
class CreateSaralLocatableAdministrativeDistrictZilaMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_zila_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_zila_mappings_ad_index' }
      t.references :saral_locatable_zila, foreign_key: true, index: { name: 'zila_ad_mappings_zila_index' }
      
      t.timestamps
    end
  end
end
