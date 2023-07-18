# This migration comes from saral_locatable (originally 20211126131257)
class CreateSaralLocatableZilaPanchayatWards < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_zila_panchayat_wards do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_zila_panchayat_ward_index }
      t.references :saral_locatable_zila_panchayat, foreign_key: true, index: { name: :zila_panchayat_zila_panchayat_ward_index }

      t.timestamps
    end
  end
end
