class AddAccuracyToAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :accuracy, :decimal
  end
end
