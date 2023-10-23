require 'sidekiq/web'
require 'sidekiq/cron/web'
Rails.application.routes.draw do
  root "home#index"
  # Define your application modules per the DSL in https://guides.rubyonrails.org/routing.html

  mount SsoClient::Engine, at: '/sso_client', as: 'sso_client'
  mount Saral::Locatable::Engine => "/saral-locatable", :as => 'saral_locatable'
  mount Sidekiq::Web => "/sidekiq"
  namespace :api do
      get 'event/data_levels' => 'event#data_levels'
      get 'event/states' => 'event#states'
      get 'event/pcs' => 'event#pcs'
      get 'event/acs' => 'event#acs'
      get 'event/zilas' => 'event#zilas'
      get 'event/mandals' => 'event#mandals'
      get 'event/booths' => 'event#booths'
      get 'event/sks' => 'event#sks'
      get 'event/state_zones' => 'event#state_zones'
      post 'event/create' => 'event#create_event'
      get 'event/event_list' => 'event#event_list'
      get 'event/event_page' => 'event#event_page'
      get 'event/event_user_list' => 'event#event_user_list'

      get 'event/login_user_detail' => 'event#login_user_detail'
      get 'event_submission/redirect_to_form' => 'event_submission#redirect_to_form'
      get 'event/edit/:id', to: 'event#edit', as: 'edit_event'
      get 'user/submissions/:event_id' => 'event_submission#user_submissions'
      get 'user/submit_event/:event_id/:submission_id' => 'event_submission#user_submit_event'
      get 'user/submit_event/:event_id' => 'event_submission#user_submit_event'

  end
  #noinspection RailsParamDefResolve
  match '*path', to: 'home#index', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
