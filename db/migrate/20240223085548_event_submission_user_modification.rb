class EventSubmissionUserModification < ActiveRecord::Migration[7.0]
  def change
    remove_column :event_submissions, :user_id
    add_column :event_submissions, :user_id, :integer
  end
end
