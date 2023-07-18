class CreateUserPermissions < ActiveRecord::Migration[7.0]
  def change
    create_table :user_permissions, if_not_exists: true do |t|
      t.references :user, foreign_key: true, index: true
      t.integer :app_permission_id, foreign_key: true
      t.integer :user_tag_id, foreign_key: true
      t.integer :client_app_id, foreign_key: true

      t.timestamps
    end
    unless column_exists? :user_permissions, :user_id
      add_reference :user_permissions, :user, :integer, foreign_key: true, index: true
    end
    unless column_exists? :user_permissions, :app_permission_id
      add_column :user_permissions, :app_permission_id, :integer, foreign_key: true
    end
    unless column_exists? :user_permissions, :user_tag_id
      add_column :user_permissions, :user_tag_id, :integer, foreign_key: true
    end
    unless column_exists? :user_permissions, :client_app_id
      add_column :user_permissions, :client_app_id, :integer, foreign_key: true
    end
  end

  def self.down
    drop_table :user_permissions
  end
end