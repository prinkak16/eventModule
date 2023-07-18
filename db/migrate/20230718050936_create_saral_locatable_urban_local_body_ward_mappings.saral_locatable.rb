# This migration comes from saral_locatable (originally 20211202081121)
class CreateSaralLocatableUrbanLocalBodyWardMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_urban_local_body_ward_mappings do |t|
      t.references :saral_locatable_urban_local_body, polymorphic: true, index: { name: :index_ulb_ward_on_ulb_id }
      t.references :saral_locatable_ward, foreign_key: true, index: { name: :index_ulb_ward_on_ward_id }

      t.timestamps
    end
  end
end
