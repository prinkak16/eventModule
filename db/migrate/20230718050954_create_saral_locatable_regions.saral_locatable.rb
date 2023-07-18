# This migration comes from saral_locatable (originally 20211214171458)
class CreateSaralLocatableRegions < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_regions do |t|
      t.string :name
      t.timestamps
    end
  end
end
