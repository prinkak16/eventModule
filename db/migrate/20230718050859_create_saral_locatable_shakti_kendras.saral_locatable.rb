# This migration comes from saral_locatable (originally 20211109104926)
class CreateSaralLocatableShaktiKendras < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_shakti_kendras do |t|
      t.string :name
      t.string :number
      t.references :saral_locatable_state, foreign_key: true, index: { name: :state_shakti_kendra_index }
      
      t.timestamps
    end
  end
end
