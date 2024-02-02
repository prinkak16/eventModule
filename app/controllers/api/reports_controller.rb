class Api::ReportsController < ApplicationController

  def fetch_reports
    begin
      event = Event.find_by(id: params[:event_id])
      event_form = EventForm.find_by(event_id: params[:event_id])
      FetchReportsJob.perform_async(event, params[:email_id].split(','), event_form)
      render json: { success: true, message: "Job has been scheduled successfully" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end