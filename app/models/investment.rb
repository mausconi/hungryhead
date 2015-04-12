class Investment < ActiveRecord::Base
  	
  	#Associations
  	belongs_to :user, touch: true
  	belongs_to :idea, touch: true

  	store_accessor :parameters, :point_earned, :views_count

  	#Includes modules
 	acts_as_votable
  	acts_as_commentable
  	has_merit

	include PublicActivity::Model
	include Redis::Objects

  	counter :comments_count
  	counter :votes_count
  	
	before_destroy :remove_activity
	
	private

	def remove_activity
	 PublicActivity::Activity.where(trackable_id: self.id, trackable_type: self.class.to_s).find_each do |activity|
	  activity.destroy if activity.present?
	  true
	 end
	end

end
