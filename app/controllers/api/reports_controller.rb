class Api::ReportsController < ApplicationController

  def fetch_reports
    begin
      FetchReportsJob.perform_async(params[:event_id], params[:email_id].split(','))
      render json: { success: true, message: "Job has been scheduled successfully" }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end