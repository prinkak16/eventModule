class CreateEventForms < ActiveRecord::Migration[7.0]
  def change
    create_table :event_forms do |t|
      t.integer :event_id
      t.string :uuid
      t.timestamps
    end
  end
end
