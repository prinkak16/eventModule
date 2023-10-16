class RenameUuidToFormIdInEventForms < ActiveRecord::Migration[7.0]
  def change
    rename_column :event_forms, :uuid, :form_id
  end
end
