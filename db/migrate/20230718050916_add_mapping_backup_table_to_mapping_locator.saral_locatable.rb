# This migration comes from saral_locatable (originally 20211126065104)
class AddMappingBackupTableToMappingLocator < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_mapping_locators, :mapping_backup_table, :string
  end
end
