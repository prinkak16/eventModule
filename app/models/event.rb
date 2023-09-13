class Event < ApplicationRecord
  include AASM
  belongs_to :data_level
  has_many :event_locations, dependent: :destroy
  has_one_attached :image
  has_one :event_form, dependent: :destroy
  belongs_to :created_by, class_name: 'User'
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
  def get_image_url
    if self.image.attached? && self.image_url.blank?
      update(image_url: image.url(expires_in: 1.year))
    end
    self.image_url
  end
end
