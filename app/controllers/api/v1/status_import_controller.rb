# frozen_string_literal: true

class Api::V1::StatusImportController < Api::BaseController
  def create
    status_imports = status_import_params[:status_imports]

    if status_imports.present? && status_imports.is_a?(Array)
      @statuses = status_imports.map do |status_import_params|
        create_status(status_import_params)
      end

      status_ids = @statuses.map do |status| status.id end
      render json: { status_ids: status_ids }
    else
      render json: { error: "Invalid or missing 'status_imports' array in the request" }, status: 422
    end
  rescue PostStatusService::UnexpectedMentionsError => e
    unexpected_accounts = ActiveModel::Serializer::CollectionSerializer.new(
      e.accounts,
      serializer: REST::AccountSerializer
    )
    render json: { error: e.message, unexpected_accounts: unexpected_accounts }, status: 422
  end

  private

  def create_status(status_import_params)
    PostStatusService.new.call(
      Account.find_by(id: status_import_params[:account_id]),
      text: status_import_params[:status],
      sensitive: status_import_params[:sensitive],
      spoiler_text: status_import_params[:spoiler_text],
      visibility: status_import_params[:visibility],
      language: status_import_params[:language],
      scheduled_at: status_import_params[:scheduled_at],
      application: Doorkeeper::Application.find_by(id: 1),
      allowed_mentions: status_import_params[:allowed_mentions],
      media_ids: status_import_params[:media_ids],
      poll: status_import_params[:poll],
      fact_checked: status_import_params[:fact_checked],
      with_rate_limit: true
    )
  end

  def status_import_params
    params.permit(
      status_imports: [
        :account_id,
        :status,
        :sensitive,
        :spoiler_text,
        :visibility,
        :language,
        :scheduled_at,
        { status_import: {} },
        :allowed_mentions,
        :media_ids,
        :poll,
        :fact_checked,
      ]
    )
  end
end
