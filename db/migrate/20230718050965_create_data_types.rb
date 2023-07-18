class CreateDataTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :data_types, if_not_exists: true do |t|
      t.string :name, null: false
      t.timestamps
    end
    unless column_exists? :data_types, :name
      add_column :data_types, :name, :string
    end
  end

  def self.down
    drop_table :data_types
  end
end