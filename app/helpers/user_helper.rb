module UserHelper

  def team_name_options
    s = ''
    User.all.where.not(id: current_user.id).each do |user|
      s << "<option value='#{user.id}' data-img-src='#{user.avatar.url(:mini)}'>#{user.name}</option>"
    end
    s.html_safe
	end

	def is_owner?(user)
		current_user == user
	end

  def cache_key_for_user(user)
    investments = user.investments_counter.value
    followers = user.followers_counter.value
    feedbacks = user.feedbacks_counter.value
    followed = user.followed_by(current_user)
    "#{user}/investments-#{investments}/followers-#{followers}/feedbacks-#{feedbacks}/followed-#{followed}"
  end

end
