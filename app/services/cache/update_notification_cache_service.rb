class UpdateNotificationCacheService

  def initialize(activity)
    @activity = activity.class.to_s.constantize.find(activity.id) #already persist in Postgres
    @actor = activity.user
    @object = activity.trackable
    @target = activity.recipient
  end

  def update
    #Send notification to recipient
    add_notification_for_recipient unless @activity.user == @activity.recipient_user
    #Add activity to idea ticker if recipient or trackable is idea
    add_activity_to_idea(@object) if @activity.trackable_type == "Idea"
    add_activity_to_idea(@target) if @activity.recipient_type == "Idea"
    #Add activity to followers ticker
    add_activity_to_followers if followers.any?
    #Add notification to commenters
    add_activity_to_commenters if @activity.trackable_type == "Comment"
  end

  protected

  #Get followers for users and ideas
  def followers
    if @activity.user_type == "User" && @activity.key == "vote.create"
      ids = (@actor.followers_ids.union(@activity.recipient.voters_ids) - [@activity.recipient_user.id.to_s])
    elsif @activity.user_type == "School"
      ids = (@actor.followers_ids.union(@activity.recipient.followers_ids) + @actor.users.pluck(:id).map(&:to_s) - [@activity.recipient_user.id.to_s])
    else
      ids = (@actor.followers_ids.members - [@activity.recipient_user.id.to_s])
    end
    User.find(ids.uniq)
  end

  #add activity to recipient notifications
  def add_notification_for_recipient
    #add to notifications
    @activity.recipient_user.friends_notifications.remrangebyscore(score_key, score_key)
    @activity.recipient_user.friends_notifications.add(@activity.json_blob, score_key)
    #add to ticker
    @activity.recipient_user.ticker.remrangebyscore(score_key, score_key)
    @activity.recipient_user.ticker.add(@activity.json_blob, score_key)
  end

  #Add activity to idea ticker if recipient or trackable is idea
  def add_activity_to_idea(idea)
    idea.ticker.remrangebyscore(score_key, score_key)
    idea.ticker.add(@activity.json_blob, score_key)
  end

  def add_activity_to_commenters
    @ids = @activity.recipient.commenters_ids.values - [@activity.user_id.to_s, @activity.recipient_user.id.to_s] - @actor.followers_ids.members
    User.find(@ids).each do |commenter|
      add_activity_to_friends_ticker(commenter)
    end
  end

  #add activity to friends ticker
  def add_activity_to_friends_ticker(user)
    user.ticker.remrangebyscore(score_key, score_key)
    user.ticker.add(@activity.json_blob, score_key)
  end

  #Add activity to followers ticker
  def add_activity_to_followers
    followers.each do |follower|
      add_activity_to_friends_ticker(follower)
      SendNotificationService.new(follower, @activity.json_blob).user_notification
    end
  end

  #generate redis key
  def score_key
    @activity.created_at.to_i + @activity.id
  end

end