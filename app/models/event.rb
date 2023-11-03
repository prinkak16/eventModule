class Event < ApplicationRecord
  # include AASM
  acts_as_paranoid
  belongs_to :data_level
  has_many :event_locations, dependent: :destroy
  has_one_attached :image
  has_one :event_form, dependent: :destroy
  belongs_to :created_by, class_name: 'User'
  def get_image_url
    if self.image.attached? && self.image_url.blank?
      update(image_url: image.url(expires_in: 1.year))
    end
    self.image_url
  end
end
