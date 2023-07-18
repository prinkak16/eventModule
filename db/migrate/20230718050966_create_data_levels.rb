class CreateDataLevels < ActiveRecord::Migration[7.0]
  def change
    create_table :data_levels, if_not_exists: true do |t|
      t.string  :name, null: false
      t.string  :level_class, null: false
      t.timestamps
    end
    unless column_exists? :data_levels, :name
      add_column :data_levels, :name, :string, null: false
    end
    unless column_exists? :data_levels, :level_class
      add_column :data_levels, :level_class, :string, null: false
    end
  end

  def self.down
    drop_table :data_levels
  end
end