class EventUser < ApplicationRecord
  acts_as_paranoid
  belongs_to :event
  has_many :event_user_locations, dependent: :destroy
end