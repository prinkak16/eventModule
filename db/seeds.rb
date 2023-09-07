# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
data_levels = [["Pradesh", "Saral::Locatable::State"],
               ["Lok Sabha", "Saral::Locatable::ParliamentaryConstituency"],
               ["Vidhan Sabha", "Saral::Locatable::AssemblyConstituency"],
               ["Zila", "Saral::Locatable::Zila"],
               ["Mandal", "Saral::Locatable::Mandal"],
               ["Shakti Kendra", "Saral::Locatable::ShaktiKendra"],
               ["Booth", "Saral::Locatable::Booth"],
               ["Vibhag", "Saral::Locatable::StateZone"]]

data_levels.each do |dl|
  DataLevel.where(name: dl[0], level_class: dl[1]).first_or_create!
end