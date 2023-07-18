class DataLevel < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end