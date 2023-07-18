# This migration comes from saral_locatable (originally 20211008080012)
class AddAssemblyConstiuencyIdToSaralLocatableBooths < ActiveRecord::Migration[6.1]
  def change
    add_reference :saral_locatable_booths, :saral_locatable_assembly_constituency, foreign_key: true, index: { name: :booth_assembly_constituency_index }
  end
end
