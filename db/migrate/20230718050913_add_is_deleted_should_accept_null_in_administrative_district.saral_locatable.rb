# This migration comes from saral_locatable (originally 20211125145428)
class AddIsDeletedShouldAcceptNullInAdministrativeDistrict < ActiveRecord::Migration[6.1]
  def change
    change_column_null :saral_locatable_administrative_districts, :is_deleted, true
  end
end
