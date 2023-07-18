# This migration comes from saral_locatable (originally 20211027083755)
class CreateSaralLocatableMappingLocators < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_mapping_locators do |t|
      t.string :first_table
      t.string :second_table
      t.string :mapping_table
      
      t.timestamps
    end
  end
end
