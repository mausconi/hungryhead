class School < ActiveRecord::Base

	#Model caching
	include IdentityCache
	#redis objects
	include Redis::Objects

	#Included concerns
	include Followable
	include Sluggable
	include Eventable

	#Relationship
	has_many :users
	has_many :ideas
	belongs_to :admin, class_name: 'User', foreign_key: "admin_id"

	cache_has_many :users, embed: true
	cache_has_many :events, :inverse_name => :eventable, embed: true
	cache_has_many :ideas, embed: true
	cache_belongs_to :admin

	cache_index :slug, :unique => true

	acts_as_taggable_on :locations

	store_accessor :data, :established, :locations, :website
	store_accessor :media, :logo_position, :logo_tmp, :cover_tmp,
	:cover_position, :cover_left, :cover_prcessing, :logo_processing

	#Redis Cache counters and ids
	set :followers_ids

	#Latest caches
	list :latest_people, maxlength: 20, marshal: true
	list :latest_ideas, maxlength: 20, marshal: true

	#Counters
	counter :followers_counter
	counter :people_counter
	counter :ideas_counter

	#Mount carrierwave
	mount_uploader :logo, LogoUploader
	mount_uploader :cover, CoverUploader

	validates :name, :presence => true,
	:on => :create

	#Slug candidates for school
	def slug_candidates
	 [:name]
	end

	#Callbacks hooks
	after_save :load_into_soulmate
  before_destroy :remove_from_soulmate

  def can_score?
  	true
  end

  def name_badge
  	words = name.split(' ')
  	words.map{|w| w.first }.join
  end

  def rebuild_cache
    UpdateSchoolCacheJob.perform_later(id)
  end

	private

	def should_generate_new_friendly_id?
	  slug.blank? || name_changed?
	end

	def load_into_soulmate
		loader = Soulmate::Loader.new("schools")
		loader.add(
			"term" => name,
			"image" => logo.url(:avatar),
			"description" => location_list,
			"id" => id,
			"data" => {
		  	"link" => Rails.application.routes.url_helpers.profile_path(self)
		  })
	end

	def remove_from_soulmate
		loader = Soulmate::Loader.new("universities")
	  loader.remove("id" => id)
	end

end
