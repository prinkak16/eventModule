# This migration comes from saral_locatable (originally 20211011054019)
class CreateSaralLocatableMandals < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_mandals do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_mandal_index }
      t.boolean :is_deleted, default: false, null: false
      
      t.timestamps
    end
  end
end
