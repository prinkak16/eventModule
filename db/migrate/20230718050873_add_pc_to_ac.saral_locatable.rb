# This migration comes from saral_locatable (originally 20211117143404)
class AddPcToAc < ActiveRecord::Migration[6.1]
  def change
    add_reference :saral_locatable_assembly_constituencies, :saral_locatable_parliamentary_constituency, foreign_key: true, index: { name: :ac_pc_index }
  end
end
