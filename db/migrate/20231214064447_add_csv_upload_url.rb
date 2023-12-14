class AddCsvUploadUrl < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :csv_url, :string
  end
end
