# This migration comes from saral_locatable (originally 20210930054119)
class CreateSaralLocatableStates < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_states do |t|
      t.string :name
      t.boolean :is_deleted, default: false, null: false
      
      t.timestamps
    end
  end
end
