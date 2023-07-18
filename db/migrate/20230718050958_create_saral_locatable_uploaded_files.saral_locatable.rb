# This migration comes from saral_locatable (originally 20220125054155)
class CreateSaralLocatableUploadedFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_uploaded_files do |t|
      t.string :file_name
      t.timestamps
    end
  end
end
