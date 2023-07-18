class CreateAppPermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :app_permissions, if_not_exists: true do |t|
      t.string  :name, null: false
      t.string  :action, null: false
      t.timestamps
    end
    unless column_exists? :app_permissions, :name
      add_column :app_permissions, :name, :string, null: false
    end
    unless column_exists? :app_permissions, :action
      add_column :app_permissions, :action, :string, null: false
    end
  end

  def self.down
    drop_table :app_permissions
  end
end
