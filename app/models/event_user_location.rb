class EventUserLocation < ApplicationRecord
  acts_as_paranoid
  belongs_to :country_state
  belongs_to :event_user
  belongs_to :location, polymorphic: true
end