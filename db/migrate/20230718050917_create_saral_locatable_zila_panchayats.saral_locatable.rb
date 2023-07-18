# This migration comes from saral_locatable (originally 20211126114032)
class CreateSaralLocatableZilaPanchayats < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_zila_panchayats do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_zila_panchayat_index }

      t.timestamps
    end
  end
end
