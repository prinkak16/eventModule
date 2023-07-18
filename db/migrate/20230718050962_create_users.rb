class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, if_not_exists: true do |t|
      t.string  :uuid, null: false
      t.string  :email, null: false
      t.string  :name, null: false
      t.string :role, null: false
      t.string  :phone_number, null: false
      t.jsonb :sso_payload, null: false, default: '{}'
      t.timestamps
    end
    unless column_exists? :users, :uuid
      add_column :users, :uuid, :string, null: false
    end
    unless column_exists? :users, :email
      add_column :users, :email, :string, null: false
    end
    unless column_exists? :users, :name
      add_column :users, :name, :string, null: false
    end
    unless column_exists? :users, :role
      add_column :users, :role, :string, null: false
    end
    unless column_exists? :users, :phone_number
      add_column :users, :phone_number, :string, null: true
    end
    unless column_exists? :users, :sso_payload
      add_column :users, :sso_payload, :jsonb, null: false, default: '{}'
    end
  end

  def self.down
    drop_table :users
  end
end
