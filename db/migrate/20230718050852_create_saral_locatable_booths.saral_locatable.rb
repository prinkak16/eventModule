# This migration comes from saral_locatable (originally 20210930054225)
class CreateSaralLocatableBooths < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_booths do |t|
      t.string :name
      t.string :number
      t.boolean :is_deleted, default: false, null: false
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_booth_index }
      
      t.timestamps
    end
  end
end
