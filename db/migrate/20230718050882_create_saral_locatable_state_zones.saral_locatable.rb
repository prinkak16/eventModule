# This migration comes from saral_locatable (originally 20211122072253)
class CreateSaralLocatableStateZones < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_state_zones do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_sz_index }
      t.boolean :is_deleted, default: false, null: false

      t.timestamps
    end
  end
end
