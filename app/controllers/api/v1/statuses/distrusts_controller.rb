# frozen_string_literal: true

class Api::V1::Statuses::DistrustsController < Api::V1::Statuses::BaseController
  def create
    current_account.distrusts.find_or_create_by!(account: current_account, status: @status)

    do_metrics

    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    distrust = current_account.distrusts.find_by(status_id: params[:status_id])
    if distrust
      @status = distrust.status
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    distrust&.destroy!

    do_metrics

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, distrusts_map: { @status.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end

  private

  def do_metrics
    MetricsCalculatorService.new([current_account.id]).calculate_metrics
  end
end
