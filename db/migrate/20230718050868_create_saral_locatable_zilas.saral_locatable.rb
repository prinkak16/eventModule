# This migration comes from saral_locatable (originally 20211115093412)
class CreateSaralLocatableZilas < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_zilas do |t|
      t.string :name
      t.boolean :is_deleted, default: false, null: false
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_zila_index }

      t.timestamps
    end
  end
end
