# frozen_string_literal: true

Fabricator(:distrust) do
  account { Fabricate.build(:account) }
  status { Fabricate.build(:status) }

end
