class AddParentForeignKey < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :parent_id, :integer
    add_column :events, :allow_create_sub_event, :boolean, default: false
  end
end
