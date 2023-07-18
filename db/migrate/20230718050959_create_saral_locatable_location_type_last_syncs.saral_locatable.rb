# This migration comes from saral_locatable (originally 20230221043712)
class CreateSaralLocatableLocationTypeLastSyncs < ActiveRecord::Migration[7.0]
  def change
    create_table :saral_locatable_location_type_last_syncs do |t|
      t.string :location_type
      t.datetime :last_sync

      t.timestamps
    end
    add_index :saral_locatable_location_type_last_syncs, :location_type
  end
end
