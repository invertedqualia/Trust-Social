# frozen_string_literal: true

class  Api::V1::StatusVerificationController < Api::BaseController

  def index
    @statuses = Status.all
    render json: { verified_statuses:  @statuses.map{|status|REST::VerifiedStatusSerializer.new(status).attributes} }
  end

  def update
    statuses = verified_statuses_params[:verified_statuses]

    if statuses.present? && statuses.is_a?(Array)
      statuses.map do |status| update_status(status) end
    else
      render json: { error: "Invalid or missing 'verified_statuses' array in the request" }, status: 422
    end
  rescue => e
    render json: { error: e.message }, status: 422
  end

  private

  def update_status(status)

    attrs = {}
    fact_checked = status[:fact_checked]
    debunked = status[:debunked]

    if !fact_checked.nil? && !valid_bool?(fact_checked)
      raise 'Invalid input found for attribute fact_checked'

    elsif !debunked.nil? && !valid_bool?(debunked)
      raise 'Invalid input found for attribute debunked'

    elsif fact_checked.to_s.downcase == 'true' && debunked.to_s.downcase == 'true'
      raise 'Only one of the attributes fact_checked|debunked is allowed to be true'

    elsif fact_checked.to_s.downcase == 'true'
      attrs[:fact_checked] = true
      attrs[:debunked] = false

    elsif debunked.to_s.downcase == 'true'
      attrs[:fact_checked] = false
      attrs[:debunked] = true

    else
      if valid_bool?(fact_checked)
        attrs[:fact_checked] = fact_checked
      end
      if valid_bool?(debunked)
        attrs[:debunked] = debunked
      end
    end

    if attrs.length > 0
      Status.where(id: status[:id]).update(attrs)
    end
  end

  def verified_statuses_params
    params.permit(
      verified_statuses: [
        :id,
        :fact_checked,
        :debunked,
      ]
    )
  end

  def valid_bool?(value)
    value.to_s.downcase == 'true' || value.to_s.downcase == 'false'
  end
end
