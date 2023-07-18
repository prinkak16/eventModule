# This migration comes from saral_locatable (originally 20211124085620)
class AddMissingColumnToShaktiKendra < ActiveRecord::Migration[6.1]
  def change
    add_column :saral_locatable_shakti_kendras, :created_by_id, :integer, index: { name: :shakti_kendra_created_by_id_index }
    add_column :saral_locatable_shakti_kendras, :deleted_at, :datetime, index: { name: :shakti_kendra_deleted_at_index }
    add_column :saral_locatable_shakti_kendras, :document_id, :integer, index: { name: :shakti_kendra_document_id_index }
    add_column :saral_locatable_shakti_kendras, :maha_system_id, :string, index: { name: :shakti_kendra_maha_system_index }
  end
end
