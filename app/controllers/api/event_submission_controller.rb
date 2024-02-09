class Api::EventSubmissionController < Api::ApplicationController
  include ApplicationHelper
  require 'faraday'

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

  def user_submissions
    begin
      events = Event.where(id: params[:event_id])
      events = ActiveModelSerializers::SerializableResource.new(events, each_serializer: EventSerializer, state_id: params[:state_id], current_user: current_user)
      submissions = EventSubmission.where(user_id: current_user, event_id: params[:event_id]).order(created_at: :desc)
      puts "Event Module Queries - " + "#{current_user.phone_number}"
      response = HTTParty.post(
        "#{ENV['FORM_BASE_URL']}/api/submissionStatus",
        headers: {
          'Authorization' => "Bearer #{ENV['AUTH_TOKEN_FOR_REDIRECTION']}",
          'Content-Type' => 'application/json',
          'Accept' => 'application/json'
        },
        body: { submissionId: submissions.pluck(:submission_id) }.to_json
      )
      raise StandardError, 'Error fetching response' if response.code != 200
      puts "Form Builder Queries - " + "#{current_user.phone_number}"
      response = JSON.parse(response.body)
      submissions_data = response['data']
      data = []
      submissions.each do |submission|
        res = submissions_data[submission.submission_id]
        if res.present?
          data << { reported_on: submission.created_at, images: res['images'],
                    status: res['status'], locations: res['locations'].pluck('locationName'),
                    event_id: submission.event_id, submission_id: submission.submission_id, id: submission.id }
        end
      end
      render json: { success: true, data: { events: events, submissions: data }, message: "success full" }, status: :ok
    rescue => e
      render json: { success: false ,message: e.message }, status: :bad_request
    end
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
    raise StandardError, 'Error finding submission' if submission.nil?
    event_meta = {
      stateIds: event.event_locations.pluck(:state_id),
      userStateId: current_user&.sso_payload["country_state_id"].present? ? current_user&.sso_payload["country_state_id"]: nil ,
      redirectionLink: ENV['ROOT_URL'] + 'forms/submissions/' + event_id,
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

  def user_destroy_submission
    submission = EventSubmission.where(id: params[:submission_id]).first
    event_meta = {
      formId: submission.form_id,
      submissionId: submission.submission_id,
      eventId: submission.event_id,
    }
    token = JWT.encode(event_meta, ENV['JWT_SECRET_KEY'].presence || "thisisasamplesecret")
    response = HTTParty.delete(
      "#{ENV['FORM_BASE_URL']}/api/submission/delete",
      headers: {
        'Authorization' => "Bearer #{ENV['AUTH_TOKEN_FOR_REDIRECTION']}",
        'Form' => "Bearer #{token}",
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      }
    )
    if response.code == 200
      submission.destroy!
    else
      raise StandardError, 'Error Deleting Submission'
    end
    render json: { success: true, response: response, message: "successfully deleted" }, status: 200
  rescue => e
    render json: { message: e.message }, status: 400
  end
end











