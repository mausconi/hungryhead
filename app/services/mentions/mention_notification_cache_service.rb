class MentionNotificationCacheService

  def initialize(activity)
    @activity = activity
  end

  def cache
    @activity.user.latest_notifications.add(activity_json, @activity.created_at.to_i)
  end

  def activity_json
    {
      actor: @activity.user.name,
      actor_id: @activity.user.id,
      recipient_user_id: @activity.recipient.id,
      recipient: @activity.recipient.name,
      recipient_type:  @activity.trackable.mentioner.class.to_s.downcase,
      id: @activity.id,
      created_at: "#{@activity.created_at.to_formatted_s(:iso8601)}",
      url: Rails.application.routes.url_helpers.profile_path(@activity.user),
      verb: @activity.verb
    }
  end

end