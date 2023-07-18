# This migration comes from saral_locatable (originally 20211117125934)
class CreateSaralLocatableParliamentaryConstituencyMandalMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_parliamentary_constituency_mandal_mappings do |t|
      t.references :saral_locatable_parliamentary_constituency, foreign_key: true, index: { name: 'pc_mandal_mappings_pc_index' }
      t.references :saral_locatable_mandal, foreign_key: true, index: { name: 'mandal_pc_mappings_mandal_index' }
      
      t.timestamps
    end
  end
end
