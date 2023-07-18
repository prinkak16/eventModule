# This migration comes from saral_locatable (originally 20211123092018)
class CreateSaralLocatableAdministrativeDistrictTalukaPanchayatMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_district_taluka_panchayat_mappings do |t|
      t.references :saral_locatable_administrative_district, foreign_key: true, index: { name: 'ad_taluka_panchayat_mappings_ad_index' }
      t.references :saral_locatable_taluka_panchayat, foreign_key: true, index: { name: 'taluka_panchayat_ad_mappings_taluka_panchayat_index' }

      t.timestamps
    end
  end
end
