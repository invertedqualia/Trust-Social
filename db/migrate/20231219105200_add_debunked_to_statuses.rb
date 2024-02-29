class AddDebunkedToStatuses < ActiveRecord::Migration[7.0]
  def change
    add_column :statuses, :debunked, :boolean
    change_column_default :statuses, :debunked, false
  end
end
