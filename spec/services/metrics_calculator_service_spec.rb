# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MetricsCalculatorService, type: :service do
  subject { described_class.new(nil) }

  it 'user trusts one fact checked status' do
    account = Fabricate(:account)
    status1 = Fabricate(:status, account:account, fact_checked:true)
    Fabricate(:trust, account:account, status:status1)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_trust_and_fact_checked_true]).to eq(1)
    expect(metrics[:reaction_trust]).to eq(1)
    expect(metrics[:metric_trust]).to eq(1.0)
    expect(metrics[:percentage]).to eq(50.0)
  end

  it 'user trusts one debunked status' do
    account = Fabricate(:account)
    status2 = Fabricate(:status, account:account, debunked:true)
    Fabricate(:trust, account:account, status:status2)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_trust_and_fact_checked_true]).to eq(0)
    expect(metrics[:reaction_trust]).to eq(1)
    expect(metrics[:metric_trust]).to eq(0.0)
    expect(metrics[:percentage]).to eq(0.0)
  end

  it 'user trusts one fact checked and one debunked status' do
    account = Fabricate(:account)
    status1 = Fabricate(:status, account:account, fact_checked:true)
    status2 = Fabricate(:status, account:account, debunked:true)
    Fabricate(:trust, account:account, status:status1)
    Fabricate(:trust, account:account, status:status2)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_trust_and_fact_checked_true]).to eq(1)
    expect(metrics[:reaction_trust]).to eq(2)
    expect(metrics[:metric_trust]).to eq(0.5)
    expect(metrics[:percentage]).to eq(25.0)
  end

  it 'user distrusts one debunked status' do
    account = Fabricate(:account)
    status1 = Fabricate(:status, account:account, debunked:true)
    Fabricate(:distrust, account:account, status:status1)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_distrust_and_debunked_true]).to eq(1)
    expect(metrics[:reaction_distrust]).to eq(1)
    expect(metrics[:metric_distrust]).to eq(1.0)
    expect(metrics[:percentage]).to eq(50.0)
  end

  it 'user distrusts one fact checked status' do
    account = Fabricate(:account)
    status2 = Fabricate(:status, account:account, fact_checked:true)
    Fabricate(:distrust, account:account, status:status2)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_distrust_and_debunked_true]).to eq(0)
    expect(metrics[:reaction_distrust]).to eq(1)
    expect(metrics[:metric_distrust]).to eq(0.0)
    expect(metrics[:percentage]).to eq(0.0)
  end

  it 'user distrusts one fact checked and one debunked status' do
    account = Fabricate(:account)
    status1 = Fabricate(:status, account:account, fact_checked:true)
    status2 = Fabricate(:status, account:account, debunked:true)
    Fabricate(:distrust, account:account, status:status1)
    Fabricate(:distrust, account:account, status:status2)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_distrust_and_debunked_true]).to eq(1)
    expect(metrics[:reaction_distrust]).to eq(2)
    expect(metrics[:metric_distrust]).to eq(0.5)
    expect(metrics[:percentage]).to eq(25.0)
  end

  it 'user distrusts one fact checked status and two debunked statuses' do
    account = Fabricate(:account)
    status1 = Fabricate(:status, account:account, fact_checked:true)
    status2 = Fabricate(:status, account:account, debunked:true)
    status3 = Fabricate(:status, account:account, debunked:true)
    Fabricate(:distrust, account:account, status:status1)
    Fabricate(:distrust, account:account, status:status2)
    Fabricate(:distrust, account:account, status:status3)

    metrics = subject.calculate_metrics_for_account(account)
    puts(metrics)

    expect(metrics[:reaction_distrust_and_debunked_true]).to eq(2)
    expect(metrics[:reaction_distrust]).to eq(3)
    expect(metrics[:metric_distrust]).to eq(0.667)
    expect(metrics[:percentage]).to eq(33.35)
  end
end
