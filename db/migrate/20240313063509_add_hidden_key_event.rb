class AddHiddenKeyEvent < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :is_hidden, :boolean, default: false
  end
end
