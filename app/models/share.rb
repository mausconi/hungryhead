class Share < ActiveRecord::Base
  	#Associations
  	belongs_to :shareable, polymorphic: true, counter_cache: true
	belongs_to :user, touch: true
 	store_accessor :parameters, :shareable_name

 	#Enumerators to handle status
	enum status: {pending: 0, shared: 1}

	acts_as_votable

	include PublicActivity::Model
	include Redis::Objects

	counter :comments_count
	counter :votes_count

	set :sharers

	before_destroy :remove_activity

	private

	def remove_activity
	 PublicActivity::Activity.where(trackable_id: self.id, trackable_type: self.class.to_s).find_each do |activity|
	  activity.destroy if activity.present?
	  true
	 end
	end
end
