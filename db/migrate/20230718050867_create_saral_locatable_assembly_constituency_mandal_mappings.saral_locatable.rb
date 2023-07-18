# This migration comes from saral_locatable (originally 20211112124452)
class CreateSaralLocatableAssemblyConstituencyMandalMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_assembly_constituency_mandal_mappings do |t|
      t.references :saral_locatable_assembly_constituency, foreign_key: true, index: { name: :ac_m_mapping_ac_index }
      t.references :saral_locatable_mandal, foreign_key: true, index: { name: :m_ac_mapping_m_index }

      t.timestamps
    end
  end
end
