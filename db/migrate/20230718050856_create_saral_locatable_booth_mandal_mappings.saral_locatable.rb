# This migration comes from saral_locatable (originally 20211011055257)
class CreateSaralLocatableBoothMandalMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_booth_mandal_mappings do |t|
      t.references :saral_locatable_mandal, foreign_key: true, index: { name: :b_m_mapping_m_index }
      t.references :saral_locatable_booth, foreign_key: true, index: { name: :b_m_mapping_b_index }
      
      t.timestamps
    end
  end
end
