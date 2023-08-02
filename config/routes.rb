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
  end
  #noinspection RailsParamDefResolve
  match '*path', to: 'home#index', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
