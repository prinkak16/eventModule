# This migration comes from saral_locatable (originally 20211126201002)
class AddNumberToTalukaPanchayatWards < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_taluka_panchayat_wards, :number, :integer
  end
end
