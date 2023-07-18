# This migration comes from saral_locatable (originally 20211126195730)
class CreateSaralLocatableTalukaPanchayatWards < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_taluka_panchayat_wards do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_taluka_panchayat_ward_index }
      t.references :saral_locatable_taluka_panchayat, foreign_key: true, index: { name: :taluka_panchayat_taluka_panchayat_ward_index }

      t.timestamps
    end
  end
end
