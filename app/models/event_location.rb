class EventLocation < ApplicationRecord

  belongs_to :event
  belongs_to :location, polymorphic: true

end
