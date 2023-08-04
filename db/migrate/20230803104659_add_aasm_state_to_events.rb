class AddAasmStateToEvents < ActiveRecord::Migration[7.0]
  def change
    add_column :events, :status_aasm_state, :string, default: "upcoming"
  end
end
