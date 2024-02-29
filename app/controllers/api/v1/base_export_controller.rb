# frozen_string_literal: true

module Api::V1::BaseExportController
  extend ActiveSupport::Concern

  included do
    before_action :require_enabled_api!
    before_action :export_data

    def index
      respond_to do |format|
        format.csv { send_data export_data, filename: "#{controller_name}.csv" }
      end
    end

    private

    def export_data
      @export = Export.new(nil, model_class)

      case model_class.to_s
      when 'Like', 'Dislike', 'Trust', 'Distrust'
        @export.records_to_csv(model_records, :reactions_csv, @export.method(:model_columns_reactions), model_class.to_s)
      when 'Status'
        @export.records_to_csv(model_records, :status_csv, @export.method(:model_columns_statuses), model_class.to_s)
      when 'Account'
        @export.records_to_csv(model_records, :accounts_csv, @export.method(:model_columns_accounts), model_class.to_s)
      else
        raise ArgumentError, "Unable to determine CSV type for model: #{model_class}"
      end
    end

    def model_class
      model_name.constantize
    end

    def model_name
      controller_model_name || controller_name.classify
    end

    def controller_model_name
      case controller_name
      when 'exported_statuses'
        'Status'
      when 'exported_accounts'
        'Account'
      end
    end

    def model_records
      model_class.all
    end

    def require_enabled_api!
      head 404 unless Setting.activity_api_enabled && !limited_federation_mode?
    end
  end
end
