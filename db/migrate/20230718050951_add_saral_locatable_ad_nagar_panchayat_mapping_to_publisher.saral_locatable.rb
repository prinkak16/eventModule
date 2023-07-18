# This migration comes from saral_locatable (originally 20211208101101)
class AddSaralLocatableAdNagarPanchayatMappingToPublisher < ActiveRecord::Migration[6.1]
    def up
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} ADD TABLE saral_locatable_ad_nagar_panchayat_mappings"
        end
    end

    def down
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} DROP TABLE saral_locatable_ad_nagar_panchayat_mappings"
        end
    end
end
