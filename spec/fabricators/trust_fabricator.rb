# frozen_string_literal: true

Fabricator(:trust) do
  account { Fabricate.build(:account) }
  status { Fabricate.build(:status) }

end
