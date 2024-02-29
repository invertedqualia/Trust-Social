# frozen_string_literal: true

class Api::V1::ReactionsImportController < Api::BaseController
  def create
    reactions_import = reactions_import_params[:reactions_import]

    if reactions_import.present? && reactions_import.is_a?(Array)
      @reactions = reactions_import.map do |reactions_params|
        create_reaction(reactions_params)
      end

      render json: @reactions
    else
      render json: { error: "Invalid or missing 'reactions_import' array in the request" }, status: 422
    end
  rescue => e
    render json: { error: e.message }, status: 500
  end

  private

  def create_reaction(reaction_params)
    case reaction_params[:reaction]
    when 'LIKE'
      Dislike.destroy_by(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
      Like.create(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
    when 'DISLIKE'
      Like.destroy_by(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
      Dislike.create(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
    when 'TRUST'
      Distrust.destroy_by(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
      Trust.create(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
    when 'DISTRUST'
      Trust.destroy_by(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
      Distrust.create(account_id: reaction_params[:account_id], status_id: reaction_params[:status_id])
    else
      raise 'Unknown reaction type found in the request. Allowed is LIKE|DISLIKE|TRUST|DISTRUST'
    end
  end

  def reactions_import_params
    params.permit(
      reactions_import: [
        :status_id,
        :account_id,
        :reaction,
      ]
    )
  end
end
