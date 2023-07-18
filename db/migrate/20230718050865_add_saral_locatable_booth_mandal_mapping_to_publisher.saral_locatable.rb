# This migration comes from saral_locatable (originally 20211111050238)
class AddSaralLocatableBoothMandalMappingToPublisher < ActiveRecord::Migration[6.1]
    def up
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} ADD TABLE saral_locatable_booth_mandal_mappings"
        end
    end

    def down
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} DROP TABLE saral_locatable_booth_mandal_mappings"
        end
    end
end
