class CreateEventSubmissions < ActiveRecord::Migration[7.0]
  def change
    create_table :event_submissions do |t|
      t.string :form_id
      t.string :submission_id
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true

      t.timestamps
    end
  end
end
