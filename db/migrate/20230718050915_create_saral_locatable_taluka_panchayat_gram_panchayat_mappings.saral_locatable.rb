# This migration comes from saral_locatable (originally 20211126064918)
class CreateSaralLocatableTalukaPanchayatGramPanchayatMappings < ActiveRecord::Migration[6.1]
  def change
    create_table :saral_locatable_taluka_panchayat_gram_panchayat_mappings do |t|
      t.references :saral_locatable_gram_panchayat, foreign_key: true, index: { name: :index_gp_tp_mapping_on_gp_id }
      t.references :saral_locatable_taluka_panchayat, foreign_key: true, index: { name: :index_gp_tp_mapping_on_tp_id}

      t.timestamps
    end
  end
end
