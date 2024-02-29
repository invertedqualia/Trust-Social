# frozen_string_literal: true

class CreateLikes < ActiveRecord::Migration[7.0]
  def change
    create_table :likes do |t|
      t.references :account, null: false
      t.references :status, null: false

      t.timestamps
    end

    safety_assured do
      add_foreign_key :likes, :accounts, column: :account_id, on_delete: :cascade
      add_foreign_key :likes, :statuses, column: :status_id, on_delete: :cascade
    end

    add_index :likes, [:account_id, :status_id], unique: true
  end
end
