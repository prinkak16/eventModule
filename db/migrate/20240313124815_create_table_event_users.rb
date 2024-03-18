class CreateTableEventUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :event_users do |t|
      t.bigint :event_id
      t.boolean :disabled
      t.string :phone_number
      t.timestamps
    end
  end
end
