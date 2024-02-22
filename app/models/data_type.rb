class DataType < CcdmsRecord
  self.table_name = 'data_types'
  validates :name, presence: true, uniqueness: true
end