module ApplicationHelper
  def current_user
    User.find_by_id(session[:user_id])
  end

  def has_event_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    app_permission_id = AppPermission.find_by(name: ENV['CLIENT_APP_PERMISSION'], action: "Create")&.id
    if client_app_id.present? && app_permission_id.present?
      UserPermission.find_by(user_id: session[:user_id], app_permission_id: app_permission_id, client_app_id: client_app_id).present?
    else
      false
    end
  end

  def country_states_with_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    locations = UserTagLocation.joins("INNER JOIN user_permissions on user_tag_locations.user_tag_id = user_permissions.user_tag_id").where(user_permissions: { user_id: session[:user_id] ,client_app_id: client_app_id}, location_type: "Saral::Locatable::State").pluck(:location_id).uniq
    Saral::Locatable::State.where(id: locations).select(:id, :name).order(:name)
  end

end
