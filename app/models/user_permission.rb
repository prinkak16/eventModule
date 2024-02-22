class UserPermission < CcdmsRecord
  self.table_name = 'user_permissions'
  acts_as_paranoid
  belongs_to :user
  belongs_to :user_tag
  belongs_to :app_permission
end