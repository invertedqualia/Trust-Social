# frozen_string_literal: true

class Api::V1::ReactionsDeleteController < Api::BaseController
  def delete
    reaction = params.permit(:reaction)
    value = reaction[:reaction]

    case value
    when 'LIKE'
      Like.where.not(status_id: nil).delete_all
    when 'DISLIKE'
      Dislike.where.not(status_id: nil).delete_all
    when 'TRUST'
      Trust.where.not(status_id: nil).delete_all
    when 'DISTRUST'
      Distrust.where.not(status_id: nil).delete_all
    else
      raise 'Unknown reaction type found in the request. Allowed is LIKE|DISLIKE|TRUST|DISTRUST'
    end
  end
end
