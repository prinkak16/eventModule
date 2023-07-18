# This migration comes from saral_locatable (originally 20211118181250)
class CreateSaralLocatableAdministrativeDistrictMandalMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_mandal_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_mandal_mappings_ad_index' }
      t.references :saral_locatable_mandal, foreign_key: true, index: { name: 'mandal_ad_mappings_mandal_index' }
      
      t.timestamps
    end
  end
end