# frozen_string_literal: true

require 'csv'

class Export
  attr_reader :account, :model_class

  def initialize(account, model_class = nil)
    @account = account
    @model_class = model_class
  end

  def to_bookmarks_csv
    CSV.generate do |csv|
      account.bookmarks.includes(:status).reorder(id: :desc).each do |bookmark|
        csv << [ActivityPub::TagManager.instance.uri_for(bookmark.status)]
      end
    end
  end

  def to_blocked_accounts_csv
    to_csv account.blocking.select(:username, :domain)
  end

  def to_muted_accounts_csv
    CSV.generate(headers: ['Account address', 'Hide notifications'], write_headers: true) do |csv|
      account.mute_relationships.includes(:target_account).reorder(id: :desc).each do |mute|
        csv << [acct(mute.target_account), mute.hide_notifications]
      end
    end
  end

  def to_following_accounts_csv
    CSV.generate(headers: ['Account address', 'Show boosts', 'Notify on new posts', 'Languages'], write_headers: true) do |csv|
      account.active_relationships.includes(:target_account).reorder(id: :desc).each do |follow|
        csv << [acct(follow.target_account), follow.show_reblogs, follow.notify, follow.languages&.join(', ')]
      end
    end
  end

  def to_lists_csv
    CSV.generate do |csv|
      account.owned_lists.select(:title, :id).each do |list|
        list.accounts.select(:username, :domain).each do |account|
          csv << [list.title, acct(account)]
        end
      end
    end
  end

  def to_blocked_domains_csv
    CSV.generate do |csv|
      account.domain_blocks.pluck(:domain).each do |domain|
        csv << [domain]
      end
    end
  end

  def total_storage
    account.media_attachments.sum(:file_file_size)
  end

  def total_statuses
    account.statuses_count
  end

  def total_bookmarks
    account.bookmarks.count
  end

  def total_follows
    account.following_count
  end

  def total_lists
    account.owned_lists.count
  end

  def total_followers
    account.followers_count
  end

  def total_blocks
    account.blocking.count
  end

  def total_mutes
    account.muting.count
  end

  def total_domain_blocks
    account.domain_blocks.count
  end

  def total_models(model)
    model.count
  end

  def records_to_csv(records, type, columns_method, data_type)
    CSV.generate(headers: get_headers_from_type(type), write_headers: true) do |csv|
      records.each do |record|
        csv << columns_method.call(record, data_type)
      end
    end
  end

  def get_headers_from_type(type)
    case type
    when :reactions_csv
      model_headers_reactions
    when :status_csv
      model_headers_statuses
    when :accounts_csv
      model_headers_accounts
    else
      raise ArgumentError, "Invalid type: #{type}"
    end
  end

  private

  def model_headers_reactions
    %w(Id AccountId StatusId CreatedAt UpdatedAt DataType)
  end

  def model_headers_statuses
    %w(Id Uri Text CreatedAt UpdatedAt Url ConversationId AccountId DeletedAt EditedAt Trendable FactChecked Debunked DataType)
  end

  def model_headers_accounts
    %w(AccountId Username CreatedAt UpdatedAt DataType)
  end

  def model_columns_reactions(record, data_type)
    [record.id, record.account_id, record.status_id, record.created_at, record.updated_at, data_type]
  end

  def model_columns_statuses(record, data_type)
    [record.id, record.uri, record.text, record.created_at, record.updated_at, record.url,
     record.conversation_id, record.account_id, record.deleted_at, record.edited_at, record.trendable, record.fact_checked, record.debunked, data_type]
  end

  def model_columns_accounts(record, data_type)
    [record.id, record.username, record.created_at, record.updated_at, data_type]
  end

  def to_csv(accounts)
    CSV.generate do |csv|
      accounts.each do |account|
        csv << [acct(account)]
      end
    end
  end

  def acct(account)
    account.local? ? account.local_username_and_domain : account.acct
  end
end
