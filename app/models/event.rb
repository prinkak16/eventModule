class Event < ApplicationRecord
  # include AASM
  acts_as_paranoid
  TYPE_PARENT = "Parent".freeze
  TYPE_INTERMEDIATE = "Intermediate".freeze
  TYPE_LEAF = "Leaf".freeze

  belongs_to :data_level
  has_many :event_locations, dependent: :destroy
  has_one_attached :image
  has_one :event_form, dependent: :destroy
  belongs_to :created_by, class_name: 'User'
  belongs_to :parent, class_name: 'Event',  optional: true
  has_many :children, class_name: 'Event', foreign_key: 'parent_id'
  def get_image_url
    if self.image.attached? && self.image_url.blank?
      update(image_url: image.url(expires_in: 1.year))
    end
    self.image_url
  end
end
