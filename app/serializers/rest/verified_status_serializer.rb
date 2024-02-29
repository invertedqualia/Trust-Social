# frozen_string_literal: true

class REST::VerifiedStatusSerializer < ActiveModel::Serializer
  attributes :id, :fact_checked, :debunked

  def id
    object.id.to_s
  end
end
