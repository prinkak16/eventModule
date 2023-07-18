# This migration comes from saral_locatable (originally 20211011080413)
class CreatePublicationMaster < ActiveRecord::Migration[6.1]
  def up
    if ENV['IS_MASTER']
      execute "CREATE PUBLICATION #{ENV['PUBLISHER_NAME']}"
    end
  end

  def down
    if ENV['IS_MASTER']
      execute "DROP PUBLICATION #{ENV['PUBLISHER_NAME']} IF EXISTS"
    end
  end
end
