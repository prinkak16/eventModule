class User < CcdmsRecord
  self.table_name = 'users'
  has_many :user_tags
  has_many :user_permissions
  has_many :user_tag_locations, through: :user_tags
  has_many :app_permissions, through: :user_permissions
  has_many :events
  has_many :event_submissions
  
  serialize :sso_payload

  def has_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    app_permission_id = AppPermission.find_by(permission_name: ENV['CLIENT_APP_PERMISSION'], action: "Create")&.id
    if client_app_id.present? && app_permission_id.present?
      UserPermission.find_by(user_id: self.id, app_permission_id: app_permission_id, client_app_id: client_app_id).present?
    else
      false
    end
  end
end