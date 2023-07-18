# This migration comes from saral_locatable (originally 20211008073704)
class CreateSaralLocatableAssemblyConstituencies < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_assembly_constituencies do |t|
      t.string :name
      t.string :number
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_assembly_constituency_index }
      t.boolean :is_deleted, default: false, null: false
      
      t.timestamps
    end
  end
end
