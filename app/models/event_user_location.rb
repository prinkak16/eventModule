class EventUserLocation < ApplicationRecord
  belongs_to :country_state
  belongs_to :event_user
end