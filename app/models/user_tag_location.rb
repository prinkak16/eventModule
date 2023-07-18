class UserTagLocation < ApplicationRecord
  belongs_to :user_tag
  belongs_to :location, polymorphic: true, optional: true
end