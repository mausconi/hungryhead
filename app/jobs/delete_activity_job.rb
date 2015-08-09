class DeleteActivityJob < ActiveJob::Base
  def perform(trackable_id, trackable_type)
    ActiveRecord::Base.connection_pool.with_connection do
      Activity.where(trackable_id: trackable_id, trackable_type: trackable_type).find_each do |activity|

        #Remove activity from follower and recipient
        find_followers(activity).each do |f|
          f.ticker.remrangebyscore(activity.created_at.to_i + activity.id, activity.created_at.to_i + activity.id)
        end

        #finally remove from recipient ticker and notification
        recipient_user(activity).ticker.remrangebyscore(activity.created_at.to_i + activity.id, activity.created_at.to_i + activity.id)
        recipient_user(activity).friends_notifications.remrangebyscore(activity.created_at.to_i + activity.id, activity.created_at.to_i + activity.id)

        #finally destroy the activity
        activity.destroy if activity.present?

      end
    end
  end

  #Get all followers followed by actor
  def find_followers(activity)
    followers_ids = activity.user.followers_ids.members
    @followers = User.find(followers_ids) unless followers_ids.empty?
    @followers || []
  end

  def is_school?(activity)
    activity.user_type == "School"
  end

  #Get recipient id //user
  def recipient_user(activity)
    if activity.recipient_type == "User"
      activity.recipient
    elsif activity.recipient_type == "Idea"
      activity.recipient.user
    elsif is_school?(activity)
      activity.recipient.user.user
    else
      activity.recipient.user
    end
  end

end