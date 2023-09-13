class HomeController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user
  def index
  end
end
