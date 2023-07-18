# This migration comes from saral_locatable (originally 20211120213652)
class CreateSaralLocatableMunicipalCouncils < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_municipal_councils do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_municipal_council_index }
      t.boolean :is_deleted, default: false, null: false
      
      t.timestamps
    end
  end
end
