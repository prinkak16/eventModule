class DataLevel < CcdmsRecord
  self.table_name = 'data_levels'
  validates :name, presence: true, uniqueness: true
  has_many :events
  default_scope -> { where(name: ["Pradesh", "Vibhag", "Lok Sabha", "Zila", "Mandal", "Vidhan Sabha", "Shakti Kendra", "Booth"]) }
end