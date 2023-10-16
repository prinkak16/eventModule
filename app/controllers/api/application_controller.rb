class Api::ApplicationController < ActionController::API
  include ApplicationHelper

  def authenticate_user_permission
    unless current_user.present? && current_user.has_app_access?
      session[:user_id] = nil
      redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
    end
  end
  def authenticate_user
    token = (request.env["HTTP_AUTHORIZATION"] || "")&.split(" ")&.last
    if token&.present?
      user = handle_api_auth(api_token: token)
      session[:user_id] = user
    else
      if session[:user_id].present?
        current_user
      else
        redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
      end
    end
  end
end