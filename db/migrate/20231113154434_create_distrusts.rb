class CreateDistrusts < ActiveRecord::Migration[7.0]
  def change
    create_table :distrusts do |t|
      t.references :account, null: false
      t.references :status, null: false

      t.timestamps
    end

    safety_assured do
      add_foreign_key :distrusts, :accounts, column: :account_id, on_delete: :cascade
      add_foreign_key :distrusts, :statuses, column: :status_id, on_delete: :cascade
    end

    add_index :distrusts, [:account_id, :status_id], unique: true
  end
end
