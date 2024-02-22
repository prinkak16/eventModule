class Api::ApplicationController < ActionController::API
  include ApplicationHelper

  def authenticate_user_permission
    unless current_user.present?
      session[:user_id] = nil
      redirect_to ENV['SIGN_IN_URL'], allow_other_host: true
    end
  end
end