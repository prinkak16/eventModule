class Api::ReportsController < ApplicationController

  def fetch_reports
    begin
      Resque.enqueue(FetchReportsJob, params[:event_id], params[:email_id].split(','))
      render json: { success: true, message: "the report will be send to #{params[:email_id]}." }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end