# frozen_string_literal: true
class Api::V1::Statuses::LikesController < Api::V1::Statuses::BaseController
  def create
    current_account.likes.find_or_create_by!(account: current_account, status: @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    like = current_account.likes.find_by(status_id: params[:status_id])
    if like
      @status = like.status
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    like&.destroy!

    render json: @status, serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new([@status], current_account.id, likes_map: { @status.id => false })
  rescue Mastodon::NotPermittedError
    not_found
  end
end
