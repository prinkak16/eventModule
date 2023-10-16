class Api::EventSubmissionController < Api::ApplicationController
  include ApplicationHelper

  def redirect_to_form
    event = Event.find(params[:event_id])
    event_form = EventForm.where(event_id: params[:event_id]).first

    submission = EventSubmission.where(user_id: current_user.id, event_id: params[:event_id], form_id: event_form.form_id).first
    if submission.present?
      submission_id = submission.submission_id
    else
      submission_id = SecureRandom.uuid
      EventSubmission.where(user_id: current_user.id, event_id: params[:event_id], form_id: event_form.form_id, submission_id: submission_id).first_or_create!
    end
    data = { eventId: event.id, formId: event_form.form_id, submissionId: submission_id, eventName: event.name, eventStartDate: event.start_date, isFormCreator: false, eventEndDate: event.end_date, user: { name: current_user.name }, dataLevel: event.data_level&.name, eventStateIds: event.event_locations.pluck(:state_id) }
    token = JWT.encode(data, ENV['JWT_SECRET_KEY'].present? ? ENV['JWT_SECRET_KEY'] : '6F59CAC47E5AD7D5E5B8CA41E9173')
    redirect_url = "#{ENV['FORM_SUBMIT_URL']}?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}"
    render json: { success: true, data: { redirect_url: redirect_url }, message: 'Redirect to url' }, status: 200
  rescue => e
    render json: { message: e.message }, status: 400
  end
end
