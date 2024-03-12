class AddDeletedAtInEventSubmission < ActiveRecord::Migration[7.0]
  def change
    add_column :event_submissions, :deleted_at, :datetime
    add_index :event_submissions, :deleted_at
  end
end
