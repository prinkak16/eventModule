class CreateUserTags < ActiveRecord::Migration[7.0]
  def change
    create_table :user_tags, if_not_exists: true do |t|
      t.references :data_type, foreign_key: true
      t.references :data_level, foreign_key: true
      t.references :user, foreign_key: true
      t.integer :saral_tag_id
      t.timestamps
    end
    unless column_exists? :user_tags, :data_type_id
      add_reference :user_tags, :data_type, foreign_key: true
    end
    unless column_exists? :user_tags, :data_level_id
      add_reference :user_tags, :data_level, foreign_key: true
    end
    unless column_exists? :user_tags, :user_id
      add_reference :user_tags, :user, foreign_key: true
    end
    unless column_exists? :user_tags, :saral_tag_id
      add_column :user_tags, :saral_tag_id, :integer
    end
  end

  def self.down
    drop_table :user_tags
  end
end