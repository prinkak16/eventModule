# This migration comes from saral_locatable (originally 20211124141108)
class AddSaralLocatableBoothAdministrativeDistrictMappingToPublisher < ActiveRecord::Migration[6.1]
    def up
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} ADD TABLE saral_locatable_booth_administrative_district_mappings"
        end
    end

    def down
        if ENV['IS_MASTER']
          execute "ALTER PUBLICATION #{ENV['PUBLISHER_NAME']} DROP TABLE saral_locatable_booth_administrative_district_mappings"
        end
    end
end
