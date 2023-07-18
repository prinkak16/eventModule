# This migration comes from saral_locatable (originally 20211122072538)
class CreateSaralLocatableStateZoneZilaMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_state_zone_zila_mappings do |t|
      t.references :saral_locatable_state_zone, foreign_key: true, index: { name: 'sz_zila_mappings_sz_index' }
      t.references :saral_locatable_zila, foreign_key: true, index: { name: 'zila_sz_mappings_zila_index' }

      t.timestamps
    end
  end
end
