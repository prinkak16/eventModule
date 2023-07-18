# This migration comes from saral_locatable (originally 20211126210507)
class AddSaralLocatableGramPanchayatWardToPublisher < ActiveRecord::Migration[6.1]
    def up
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} ADD TABLE saral_locatable_gram_panchayat_wards"
        end
    end

    def down
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} DROP TABLE saral_locatable_gram_panchayat_wards"
        end
    end
end
