class Api::V1::Statuses::BaseController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :"write:#{action_name.downcase}" }
  before_action :require_user!
  before_action :set_status, only: [:create]

  private

  def set_status
    @status = Status.find(params[:status_id])
    authorize @status, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end
end
