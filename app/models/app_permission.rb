class AppPermission < CcdmsRecord
  self.table_name = 'app_permissions'
  belongs_to :user_permission
end