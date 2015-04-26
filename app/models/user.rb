class User < ActiveRecord::Base

  include ActiveModel::Validations
  include Redis::Objects
  #Concerns for User class
  include Followable
  include Follower
  include Sluggable

  acts_as_taggable_on :hobbies, :locations, :subjects, :markets
  acts_as_tagger
  acts_as_punchable

  #Sorted set to store followers, followings ids and latest activities
  sorted_set :followers_ids
  sorted_set :followings_ids
  sorted_set :idea_followings_ids
  sorted_set :latest_activities, maxlength: 100, marshal: true

  #Redis counters to cache total followers, followings,
  #feedbacks, investments and ideas
  counter :followers_counter
  counter :followings_counter
  counter :feedbacks_counter
  counter :investments_counter
  counter :ideas_counter

  #Enumerators to handle states
  enum state: { inactive: 0, published: 1}
  enum role: { user: 0, entrepreneur: 1, mentor: 2 }

  #Accessor methods for JSONB datatypes
  store_accessor :profile, :facebook_url, :twitter_url, :linkedin_url, :website_url

  store_accessor :media, :avatar_position, :cover_position, :cover_left,
  :cover_processing, :avatar_processing

  store_accessor :settings, :theme, :idea_notifications, :feedback_notifications,
  :investment_notifications, :follow_notifications, :weekly_mail

  store_accessor :fund, :balance, :invested_amount, :earned_amount

  serialize [:fund, :education, :interests, :profile, :settings], HashSerializer

  attr_accessor :avatar_crop_x, :avatar_crop_y, :avatar_crop_w, :avatar_crop_h

  #Merit GEM for badges and points
  has_merit

  #Devise for authentication
  devise :invitable, :async, :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :confirmable,
    :registerable, :authentication_keys => [:login]

  attr_accessor :login

  #Model Relationships
  belongs_to :school
  has_many :authentications, :dependent => :destroy, autosave: true

  #Activities
  has_many :activities, :dependent => :destroy

  has_many :feedbacks, dependent: :destroy, autosave: true
  has_many :investments, dependent: :destroy, autosave: true
  has_many :comments, dependent: :destroy, autosave: true
  has_many :slugs, as: :sluggable, dependent: :destroy

  #Media Uploaders - carrierwave
  mount_uploader :avatar, LogoUploader
  mount_uploader :cover, CoverUploader

  #Scopes for searching
  scope :entrepreneurs, -> { where(role: 1) }
  scope :users, -> { where(role: 0) }

  #Callbacks
  before_save :add_fullname, :seed_fund, :seed_settings
  after_save :load_into_soulmate
  before_destroy :remove_from_soulmate, :decrement_counters
  after_create :increment_counters

  #Model Validations
  validates :email, :presence => true, :uniqueness => {:case_sensitive => false}
  validates :name, :presence => true
  validates :username, :presence => true, :uniqueness => true, format: { with: /\A[a-zA-Z0-9]+\Z/, message: "should not contain empty spaces or symbols" }
  validates :password, :confirmation => true, :presence => true, :length => {:within => 6..40}, :on => :create

  #Reading models
  acts_as_reader

  #Messaging system
  acts_as_messageable

  def mailboxer_email(object)
    email
  end

  def balance_available?(amount)
    balance > amount.to_i
  end

  #Login using both email and username
  def login=(login)
    @login = login
  end

  def login
    @login || self.username || self.email
  end

  def email_required?
    super && authentications.blank?
  end

  def password_required?
    super && authentications.blank?
  end

  def send_devise_notification(notification, *args)
    devise_mailer.send(notification, self, *args).deliver_later!(wait: 5.seconds)
  end

  private

  def add_fullname
    words = self.name.split(" ")
    self.first_name = words.first
    self.last_name =  words.last
  end

  def seed_fund
    self.fund = {balance: 1000}
  end

  def seed_settings
    self.settings = {theme: 'solid', idea_notifications: true, feedback_notifications: true,
    investment_notifications: true, follow_notifications: true, weekly_mail: true}
  end

  def slug_candidates
    [:username]
  end

  def load_into_soulmate
    if type == "Student"
      soulmate_loader("students")
    elsif type == "Mentor"
      soulmate_loader("mentors")
    elsif type == "Teacher"
      soulmate_loader("teachers")
    end
  end

  def soulmate_loader(type)
    loader = Soulmate::Loader.new(type)
    if avatar
      image =  avatar.url(:avatar)
      resume = school.name
    else
      image= "http://placehold.it/30"
    end
    loader.add("term" => name, "image" => image, "description" => resume, "id" => id, "data" => {
      "link" => Rails.application.routes.url_helpers.profile_path(self)
      })
  end

  def remove_from_soulmate
    loader = Soulmate::Loader.new("students")
      loader.remove("id" => id)
  end

  def increment_counters
    school.students_counter.increment
  end

  def decrement_counters
    school.students_counter.decrement
  end

  protected

  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    else
      where(conditions).first
    end
  end


end
