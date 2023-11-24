module ApplicationHelper
  def current_user
    User.find_by_id(session[:user_id])
  end

  def has_event_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    app_permission_id = AppPermission.find_by(name: ENV['CLIENT_APP'], action: "Create")&.id
    if client_app_id.present? && app_permission_id.present?
      UserPermission.find_by(user_id: session[:user_id], app_permission_id: app_permission_id, client_app_id: client_app_id).present?
    else
      false
    end
  end

end
