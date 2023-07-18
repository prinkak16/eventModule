# This migration comes from saral_locatable (originally 20211126114646)
class CreateSaralLocatableAdministrativeDistrictZilaPanchayatMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_zila_panchayat_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_zila_panchayat_mappings_ad_index' }
      t.references :saral_locatable_zila_panchayat, foreign_key: true, index: { name: 'zila_panchayat_ad_mappings_zila_panchayat_index' }

      t.timestamps
    end
  end
end
