# This migration comes from saral_locatable (originally 20211111134424)
class AddDetailsToShaktiKendra < ActiveRecord::Migration[6.1]
  def change
    add_reference :saral_locatable_shakti_kendras, :saral_locatable_assembly_constituency, foreign_key: true, index: { name: :shakti_kendra_assembly_constituency_index }
    add_reference :saral_locatable_shakti_kendras, :saral_locatable_mandal, foreign_key: true, index: { name: :shakti_kendra_mandal_index }
  end
end
