class Api::EventSubmissionController < Api::ApplicationController
  include ApplicationHelper

  def user_submissions
    events = Event.where(id: params[:event_id])
    events = ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user)
    submissions = EventSubmission.where(user_id: current_user.id, event_id: params[:event_id]).order(created_at: :desc)
    render json: { success: true, data: { events: events, submissions: submissions }, message: "success full" }, status: 200
  end

  def user_submit_event
    submission_id = params[:submission_id]
    event_id = params[:event_id]
    submission = nil
    event = Event.find(event_id)
    event_form = EventForm.where(event_id: event_id).first
    if submission_id.present? && event_id.present?
      submission = EventSubmission.where(submission_id: submission_id, event_id: event_id).first
    elsif event_id.present?
      submission_id = SecureRandom.uuid
      submission = EventSubmission.where(user_id: current_user.id, event_id: event_id, form_id: event_form.form_id, submission_id: submission_id).first_or_create!
    end
    raise StandardError 'Error finding submission' if submission.nil?
    event_meta = {
      stateIds: event.event_locations.pluck(:state_id),
      redirectionLink: ENV['ROOT_URL'] + 'form/submissions/' + event_id,
      logo: event.get_image_url
    }
    data = { eventId: event.id, formId: event_form.form_id, submissionId: submission.submission_id,
             eventName: event.name, eventStartDate: event.start_date,
             isFormCreator: false, eventEndDate: event.end_date, user: { name: current_user.name },
             dataLevel: event.data_level&.name, eventMeta: event_meta }
    token = JWT.encode(data, ENV['JWT_SECRET_KEY'].present? ? ENV['JWT_SECRET_KEY'] : '6F59CAC47E5AD7D5E5B8CA41E9173')
    redirect_url = "#{ENV['FORM_SUBMIT_URL']}?authToken=#{ENV['AUTH_TOKEN_FOR_REDIRECTION']}&formToken=#{token}"
    render json: { success: true, data: { redirect_url: redirect_url }, message: 'Redirect to url' }, status: 200
  rescue => e
    render json: { message: e.message }, status: 400
  end

end
