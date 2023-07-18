# This migration comes from saral_locatable (originally 20211115094054)
class CreateSaralLocatableZilaMandalMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_zila_mandal_mappings do |t|
      t.references :saral_locatable_zila, foreign_key: true, index: { name: :z_m_mapping_z_index }
      t.references :saral_locatable_mandal, foreign_key: true, index: { name: :m_z_mapping_m_index }

      t.timestamps
    end
  end
end
