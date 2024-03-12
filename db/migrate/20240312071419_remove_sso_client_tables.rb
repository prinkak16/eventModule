class RemoveSsoClientTables < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :user_permissions, :users, if_exists: true
    remove_foreign_key :user_tag_locations, :user_tags, if_exists: true
    remove_foreign_key :user_tags, :data_levels, if_exists: true
    remove_foreign_key :user_tags, :data_types, if_exists: true
    remove_foreign_key :user_tags, :users, if_exists: true
    drop_table :users, if_exists: true
    drop_table :user_permissions, if_exists: true
    drop_table :sso_client_keys, if_exists: true
    drop_table :data_levels, if_exists: true
    drop_table :data_types, if_exists: true
    drop_table :user_tags, if_exists: true
    drop_table :user_tag_locations, if_exists: true
    drop_table :app_permissions, if_exists: true
    drop_table :client_apps, if_exists: true
  end
end
