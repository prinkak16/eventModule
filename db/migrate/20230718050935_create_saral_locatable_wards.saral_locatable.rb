# This migration comes from saral_locatable (originally 20211202073239)
class CreateSaralLocatableWards < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_wards do |t|
      t.integer :number
      t.string :name
      t.string :translated_name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_ward_index }

      t.timestamps
    end
  end
end
