class User < ApplicationRecord
  has_many :user_tags
  has_many :user_permissions
  has_many :client_apps, through: :user_permissions
  
  serialize :sso_payload

  def has_app_access?
    ClientApp.where(name: ENV['CLIENT_APP']).exists?
  end
end