class Organization < ActiveRecord::Base
  acts_as_followable
  store_accessor :media, :logo_position,
  :cover_position, :cover_prcessing, :logo_processing

  mount_uploader :logo, LogoUploader
  mount_uploader :cover, CoverUploader

	extend FriendlyId
 	friendly_id :slug_candidates

  validates :name, :presence => true,
    :on => :create

	def slug_candidates
	 [:name]
	end

  def should_generate_new_friendly_id?
    slug.blank? || name_changed?
  end

  def short_name
    words = name.split(' ')
    name = ""
    words.map{|w| w.first.upcase }.join(" ")
  end

  private

  def create_slug
    return if !slug_changed? || slug == slugs.last.try(:slug)
    #re-use old slugs
    previous = slugs.where('lower(slug) = ?', slug.downcase)
    previous.delete_all
    slugs.create!(slug: slug)
  end

end
