# frozen_string_literal: true
class Api::V1::Statuses::DislikesController < Api::V1::Statuses::BaseController
  def create
    current_account.dislikes.find_or_create_by!(account: current_account, status: @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    dislike = current_account.dislikes.find_by(status_id: params[:status_id])
    if dislike
      @status = dislike.status
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    dislike&.destroy!

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, dislikes_map: { @status.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end
end
