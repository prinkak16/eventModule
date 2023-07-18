# This migration comes from saral_locatable (originally 20211201134247)
class CreateSaralLocatableMunicipalCorporations < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_municipal_corporations do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_municipal_corporation_index }
      t.boolean :is_deleted, default: false, null: false

      t.timestamps
    end
  end
end
