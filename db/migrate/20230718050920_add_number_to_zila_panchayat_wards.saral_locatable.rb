# This migration comes from saral_locatable (originally 20211126131730)
class AddNumberToZilaPanchayatWards < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_zila_panchayat_wards, :number, :integer
  end
end
