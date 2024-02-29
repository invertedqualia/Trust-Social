# frozen_string_literal: true

class Api::V1::Statuses::TrustsController < Api::V1::Statuses::BaseController
  def create
    current_account.trusts.find_or_create_by!(account: current_account, status: @status)

    do_metrics

    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    trust = current_account.trusts.find_by(status_id: params[:status_id])
    if trust
      @status = trust.status
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    trust&.destroy!

    do_metrics

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, trusts_map: { @status.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end

  private

  def do_metrics
    MetricsCalculatorService.new([current_account.id]).calculate_metrics
  end
end
