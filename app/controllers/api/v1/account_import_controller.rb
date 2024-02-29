# frozen_string_literal: true

class Api::V1::AccountImportController < Api::BaseController
  def create
    @account = Account.create!(username: account_import_params[:username])
    @user = User.create!(email: account_import_params[:email],
                         password: account_import_params[:password],
                         password_confirmation: account_import_params[:password],
                         locale: 'en',
                         confirmed_at: Time.now.utc,
                         agreement: true,
                         created_by_application: @app,
                         sign_up_ip: request.remote_ip,
                         account_id: @account.id)

    render json: @account.id
  end

  private

  def account_import_params
    params.permit(
      :username,
      :email,
      :password
    )
  end
end
