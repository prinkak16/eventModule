class EventLocation < ApplicationRecord
  acts_as_paranoid
  belongs_to :event
  belongs_to :location, polymorphic: true
  belongs_to :state, foreign_key: "state_id", class_name: "CountryState"

end
