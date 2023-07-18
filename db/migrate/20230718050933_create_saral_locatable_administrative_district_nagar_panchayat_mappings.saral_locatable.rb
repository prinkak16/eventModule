# This migration comes from saral_locatable (originally 20211201145346)
class CreateSaralLocatableAdministrativeDistrictNagarPanchayatMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_nagar_panchayat_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_nagar_panchayat_mappings_ad_index' }
      t.references :saral_locatable_nagar_panchayat, foreign_key: true, index: { name: 'nagar_panchayat_ad_mappings_nagar_panchayat_index' }

      t.timestamps
    end
  end
end
