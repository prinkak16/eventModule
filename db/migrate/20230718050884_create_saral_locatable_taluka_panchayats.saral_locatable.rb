# This migration comes from saral_locatable (originally 20211123071926)
class CreateSaralLocatableTalukaPanchayats < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_taluka_panchayats do |t|
      t.string :name
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_taluka_panchayat_index }
      t.boolean :is_deleted, default: false, null: false

      t.timestamps
    end
  end
end
