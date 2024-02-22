class User < CcdmsRecord
  self.table_name = 'users'
  has_many :user_tags
  has_many :user_permissions
  has_many :user_tag_locations, through: :user_tags
  has_many :app_permissions, through: :user_permissions
  has_many :events
  has_many :event_submissions
  
  serialize :sso_payload
end