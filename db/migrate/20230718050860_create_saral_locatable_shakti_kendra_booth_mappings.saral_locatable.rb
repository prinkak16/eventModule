# This migration comes from saral_locatable (originally 20211109110356)
class CreateSaralLocatableShaktiKendraBoothMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_shakti_kendra_booth_mappings do |t|
      t.references :saral_locatable_shakti_kendra, foreign_key: true, index: { name: :sk_b_mapping_sk_index }
      t.references :saral_locatable_booth, foreign_key: true, index: { name: :b_sk_mapping_b_index }
      t.string :booth_number
      
      t.timestamps
    end
  end
end
