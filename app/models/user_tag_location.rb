class UserTagLocation < CcdmsRecord
  self.table_name = 'user_tag_locations'
  belongs_to :user_tag
  belongs_to :location, polymorphic: true, optional: true
end