# frozen_string_literal: true

class MetricsCalculatorService
  def initialize(account_ids)
    @account_ids = account_ids
  end

  # METRIC PERCENTAGE - (0,5 * METRIC_ONE + 0,5 * METRIC_TWO) * 100
  def metric_percentage(metric_one, metric_two)
    ((0.5 * metric_one) + (0.5 * metric_two)) * 100
  end

  # METRIC - ARGUMENT_ONE / ARGUMENT_TWO
  def metric(arg_one, arg_two)
    result = arg_two.zero? ? 0 : arg_one.to_f / arg_two
    result.round(3)
  end

  # ARGUMENT_ONE = total number of posts that a given user reacts to with “reaction=TRUST” AND “Fact checked=TRUE”
  def arg_one_get_statuses_with_reaction_trust_and_fact_checked_true
    Status.joins(:trusts)
          .where(fact_checked: true, trusts: { account_id: @current_account_id })
          .count
  end

  # ARGUMENT_TWO = total number of posts that a given user reacts to with “reaction=TRUST”
  def arg_two_get_statuses_with_reaction_trust
    Status.joins(:trusts)
          .where(trusts: { account_id: @current_account_id })
          .count
  end

  # ARGUMENT_THREE = total number of posts that a given user reacts to with “reaction=DISTRUST” AND “Debunked=TRUE”
  def arg_three_get_statuses_with_reaction_distrust_and_debunked_true
    Status.joins(:distrusts)
          .where(debunked: true, distrusts: { account_id: @current_account_id })
          .count
  end

  # ARGUMENT_FOUR = total number of posts that a given user reacts to with “reaction=DISTRUST”
  def arg_four_get_statuses_with_reaction_distrust
    Status.joins(:distrusts)
          .where(distrusts: { account_id: @current_account_id })
          .count
  end

  def calculate_metrics
    @account_ids.each do |account_id|
      metrics = calculate_metrics_for_account(account_id)
      persist_metrics_for_account(account_id, metrics)
    end
  end

  def calculate_metrics_for_account(account_id)
    @current_account_id = account_id
    reaction_trust_and_fact_checked_true = arg_one_get_statuses_with_reaction_trust_and_fact_checked_true
    reaction_trust = arg_two_get_statuses_with_reaction_trust

    reaction_distrust_and_debunked_true = arg_three_get_statuses_with_reaction_distrust_and_debunked_true
    reaction_distrust = arg_four_get_statuses_with_reaction_distrust

    metric_trust_ratio = metric(reaction_trust_and_fact_checked_true, reaction_trust)
    metric_distrust_ratio = metric(reaction_distrust_and_debunked_true, reaction_distrust)

    percentage = metric_percentage(metric_trust_ratio, metric_distrust_ratio)

    # Calculate metrics based on trusts/distrusts and current_account ID
    {
      reaction_trust_and_fact_checked_true: reaction_trust_and_fact_checked_true,
      reaction_trust: reaction_trust,
      reaction_distrust_and_debunked_true: reaction_distrust_and_debunked_true,
      reaction_distrust: reaction_distrust,
      metric_trust: metric_trust_ratio,
      metric_distrust: metric_distrust_ratio,
      percentage: percentage,
    }
  end

  def persist_metrics_for_account(account_id, metrics)
    # Persist calculated accuracy for the account
    Account.update(account_id, accuracy: metrics[:percentage])
  end
end
