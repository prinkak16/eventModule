# This migration comes from saral_locatable (originally 20211214171650)
class CreateSaralLocatableStateRegionMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_state_region_mappings do |t|
      t.references :saral_locatable_state, foreign_key: true, index: { name: :s_region_mapping_s_index }
      t.references :saral_locatable_region, foreign_key: true, index: { name: :s_region_mapping_region_index }    end
  end
end
