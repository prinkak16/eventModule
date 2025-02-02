require 'sidekiq/web'
require 'sidekiq/cron/web'
require "resque_web"
Rails.application.routes.draw do
  root "home#index"
  class CreateConstraint
    def matches?(request)
      return false unless request.session[:user_id]
      user = User.find(request.session[:user_id])
      user&.has_create_permission
    end
  end
  mount SsoClient::Engine, at: '/sso_client', as: 'sso_client'
  # Define your application modules per the DSL in https://guides.rubyonrails.org/routing.html
  constraints CreateConstraint.new do
    mount Sidekiq::Web => "/sidekiq"
    mount ResqueWeb::Engine => "/resque_web"
  end
  namespace :api do
      get 'event/data_levels' => 'event#data_levels'
      get 'event/states' => 'event#states'
      post 'event/create' => 'event#create_event'
      get 'event/event_list' => 'event#event_list'
      get 'event/event_page' => 'app_run#event_page'
      get 'event/event_user_list' => 'event#event_user_list'

      get 'event/user' => 'event#login_user_detail'
      get 'event_submission/redirect_to_form' => 'event_submission#redirect_to_form'
      get 'event/edit/:id', to: 'event#edit', as: 'edit_event'
      get 'user/submissions/:event_id' => 'event_submission#user_submissions'
      get 'user/submit_event/:event_id/:submission_id' => 'event_submission#user_submit_event'
      get 'user/submit_event/:event_id' => 'event_submission#user_submit_event'
      get 'user/destroy/submission/:submission_id' => 'event_submission#user_destroy_submission'
      get 'event/archive/:id', to: 'event#event_archive'
      get 'event/publish/:id', to: 'event#event_publish'
      get 'event/event_data', to: 'event#individual_event_data'
      get 'event/path', to: 'event#get_event_path'
      get 'event/children', to: 'event#get_event_children'
      get 'event/user_children', to: 'event#user_list_children'
      get 'event/languages', to: 'translation#fetch_languages'
      get 'event/reports', to: 'reports#fetch_reports'
      get 'event/pin', to: 'event#pin_event'
      post 'event/update_position', to: 'event#update_position'
      post 'event/hide_event', to: 'event#set_event_to_hidden'
      get 'event/latest_uploads', to: 'event#get_latest_uploaded_csv'
      get 'event/event_user_location', to: 'event#get_event_user_location'
      delete 'event/event_user', to: 'event#remove_event_user_location'
      post 'event/event_user_location', to: 'event#schedule_event_user_location_job'
  end
  #noinspection RailsParamDefResolve
  match '*path', to: 'home#index', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
