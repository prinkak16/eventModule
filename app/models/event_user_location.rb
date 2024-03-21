class EventUserLocation < ApplicationRecord
  belongs_to :country_state
  belongs_to :event_user
  belongs_to :location, polymorphic: true
end