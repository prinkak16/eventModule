# This migration comes from saral_locatable (originally 20211126060202)
class RemoveIsDeletedFromTalukaPanchayats < ActiveRecord::Migration[6.1]
  def change
    remove_column :saral_locatable_taluka_panchayats, :is_deleted
  end
end
