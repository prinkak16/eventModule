class Api::AppRunController < Api::ApplicationController

  def event_page
    render json: { success: true, message: "Hello World!!!" }, status: :ok
  end

end