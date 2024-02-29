# frozen_string_literal: true

class CreateDislikes < ActiveRecord::Migration[7.0]
  def change
    create_table :dislikes do |t|
      t.references :account, null: false
      t.references :status, null: false

      t.timestamps
    end

    safety_assured do
      add_foreign_key :dislikes, :accounts, column: :account_id, on_delete: :cascade
      add_foreign_key :dislikes, :statuses, column: :status_id, on_delete: :cascade
    end

    add_index :dislikes, [:account_id, :status_id], unique: true
  end
end
