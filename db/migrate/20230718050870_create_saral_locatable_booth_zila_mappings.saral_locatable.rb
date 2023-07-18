# This migration comes from saral_locatable (originally 20211115100735)
class CreateSaralLocatableBoothZilaMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_booth_zila_mappings do |t|
      t.references :saral_locatable_booth, foreign_key: true, index: { name: :b_z_mapping_b_index }
      t.references :saral_locatable_zila, foreign_key: true, index: { name: :z_b_mapping_z_index }

      t.timestamps
    end
  end
end
