class EventForm < ApplicationRecord
  acts_as_paranoid
  belongs_to :event
end
