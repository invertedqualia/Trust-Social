# frozen_string_literal: true
# == Schema Information
#
# Table name: distrusts
#
#  id         :bigint(8)        not null, primary key
#  account_id :bigint(8)        not null
#  status_id  :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Distrust < ApplicationRecord
    include Paginable

    update_index('statuses', :status) if Chewy.enabled?

    belongs_to :account, inverse_of: :trusts
    belongs_to :status,  inverse_of: :trusts

    validates :status_id, uniqueness: { scope: :account_id }

    before_validation do
      self.status = status.reblog if status&.reblog?
    end

    after_destroy :invalidate_cleanup_info

    def invalidate_cleanup_info
      return unless status&.account_id == account_id && account.local?

      account.statuses_cleanup_policy&.invalidate_last_inspected(status, :undistrust)
    end
  end
