# frozen_string_literal: true

class Api::V1::MetricsCalculationController < Api::BaseController
  def update
    # Get all accounts (except 'admin' and 'mastodon_internal')
    account_ids = Account.where.not(username: 'admin').and(Account.where.not(id: -99)).pluck(:id)

    MetricsCalculatorService.new(account_ids).calculate_metrics

    render json: { message: "Metrics successfully calculated for accounts", account_ids: account_ids }
  rescue => e
    render json: { error: e.message }, status: 422
  end
end
