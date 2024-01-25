class AddTranslationColumns < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :translated_title, :jsonb
    add_index :events, :translated_title, using: :gin
  end
end
