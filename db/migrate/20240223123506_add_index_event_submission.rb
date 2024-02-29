class AddIndexEventSubmission < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :event_submissions, :users, if_exists: true
    remove_foreign_key :events, :users, if_exists: true
    remove_foreign_key :events, :data_levels, if_exists: true
    add_index :event_submissions, [:event_id , :user_id, :submission_id, :form_id], name: 'index_event_submissions_on_event_user_submission_form'
    add_index :event_submissions, [:created_at], order: { created_at: :desc }
  end
end
