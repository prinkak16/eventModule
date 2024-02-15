class Api::ReportsController < ApplicationController

  def fetch_reports
    begin
      if !check_if_already_in_progress( queue: "report", args: [params[:event_id], params[:email_id].split(','), params[:report_timeline]])
        Resque.enqueue(FetchReportsJob, params[:event_id], params[:email_id].split(','), params[:report_timeline])
        render json: { success: true, message: "the report will be send to #{params[:email_id]}." }, status: :ok
      else
        raise StandardError.new "Job is already in progress"
      end
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end