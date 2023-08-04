class Event < ApplicationRecord
  include AASM
  belongs_to :data_level


  aasm(:event, column: 'status_aasm_state') do
    state :upcoming, initial: true
    state :active
    state :expired


    event :activate_event do
      transitions from: [:upcoming], to: :active
    end

    event :expired_event do
      transitions from: [:active], to: :expired
    end
  end
end
