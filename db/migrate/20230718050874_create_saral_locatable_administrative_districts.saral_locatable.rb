# This migration comes from saral_locatable (originally 20211118175826)
class CreateSaralLocatableAdministrativeDistricts < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_administrative_districts do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_administrative_district_index }
      t.boolean :is_deleted, default: false, null: false

      t.timestamps
    end
  end
end
