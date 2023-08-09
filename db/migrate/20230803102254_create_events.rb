class CreateEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :events do |t|
      t.string :name
      t.date :start_date
      t.date :end_date
      t.string :image_url
      t.references :data_level, null: false, foreign_key: true

      t.timestamps
    end
  end
end
