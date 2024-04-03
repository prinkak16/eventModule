class AddPhoneNumberInEventUserLocation < ActiveRecord::Migration[7.0]
  def change
    add_column :event_user_locations, :phone_number, :string
  end
end