class CreateClientApps < ActiveRecord::Migration[7.0]
  def change
    create_table :client_apps, if_not_exists: true do |t|
      t.string  :name, null: false
      t.timestamps
    end
    unless column_exists? :client_apps, :name
      add_column :client_apps, :name, :string, null: false
    end
  end

  def self.down
    drop_table :client_apps
  end
end
