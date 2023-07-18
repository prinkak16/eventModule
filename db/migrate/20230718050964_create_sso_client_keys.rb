class CreateSsoClientKeys < ActiveRecord::Migration[7.0]
  def change
    create_table :sso_client_keys, if_not_exists: true  do |t|
      t.string :kid, null: false, uniq: true, index: true
      t.text :public_key, null: false
      t.timestamps
    end
    unless column_exists? :sso_client_keys, :kid
      add_column :sso_client_keys, :kid, :string, uniq: true, index: true
    end
    unless column_exists? :sso_client_keys, :public_key
      add_column :sso_client_keys, :public_key, :text, null: false
    end
  end

  def self.down
    drop_table :sso_client_keys
  end
end