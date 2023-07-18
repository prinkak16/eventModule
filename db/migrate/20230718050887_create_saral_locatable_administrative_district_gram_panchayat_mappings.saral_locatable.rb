# This migration comes from saral_locatable (originally 20211123122417)
class CreateSaralLocatableAdministrativeDistrictGramPanchayatMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_gram_panchayat_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_gram_panchayat_mappings_ad_index' }
      t.references :saral_locatable_gram_panchayat, foreign_key: true, index: { name: 'gram_panchayat_ad_mappings_gram_panchayat_index' }

      t.timestamps
    end
  end
end
