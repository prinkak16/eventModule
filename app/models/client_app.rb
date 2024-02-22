class ClientApp < CcdmsRecord
  self.table_name = 'client_apps'
  has_many :user_permissions
end