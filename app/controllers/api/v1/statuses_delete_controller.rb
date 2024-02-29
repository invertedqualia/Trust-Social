# frozen_string_literal: true

class Api::V1::StatusesDeleteController < Api::BaseController

  def delete
    Status.where(application_id: 1).delete_all
  end
end
