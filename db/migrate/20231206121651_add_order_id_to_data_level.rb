class AddOrderIdToDataLevel < ActiveRecord::Migration[7.0]
  def change
    add_column :data_levels, :order_id, :numeric
  end
end
