class IdeaMessage < ActiveRecord::Base
	
  #Associations
  belongs_to :user, touch: true
  belongs_to :idea, counter_cache: true
  
end
