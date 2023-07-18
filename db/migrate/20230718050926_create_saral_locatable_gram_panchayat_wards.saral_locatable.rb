# This migration comes from saral_locatable (originally 20211126203959)
class CreateSaralLocatableGramPanchayatWards < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_gram_panchayat_wards do |t|
      t.string :name
      t.integer :number
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_gram_panchayat_ward_index }
      t.references :saral_locatable_gram_panchayat, foreign_key: true, index: { name: :gram_panchayat_gram_panchayat_ward_index }

      t.timestamps
    end
  end
end
