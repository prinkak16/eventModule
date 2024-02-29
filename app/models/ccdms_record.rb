class CcdmsRecord < ApplicationRecord
  self.abstract_class = true
  establish_connection :secondary_db
end