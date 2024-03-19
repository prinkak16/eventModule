class EventUser < ApplicationRecord
  belongs_to :event
  has_many :event_user_locations
end