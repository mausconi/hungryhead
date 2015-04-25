class ActivityPresenter < SimpleDelegator
  attr_reader :activity

  def initialize(activity, view)
    super(view)
    @activity = activity
  end

  def as_json(*)
    {
      actor: @object.user.name,
      recipient: @object.recipient.name,
      recipient_type: @object.trackable.class.to_s.downcase,
      id: @object.id,
      created_at: "#{@object.created_at}",
      url: profile_path(@object.user),
      verb: @object.verb
    }
  end

  def render_activity
    render_partial
  end

  def render_partial
    locals = {activity: activity, presenter: self}
    locals[activity.trackable_type.underscore.to_sym] = activity.trackable
    render partial_path, locals
  end

  def partial_path
    partial_paths.detect do |path|
      lookup_context.template_exists? path, nil, true
    end || raise("No partial found for activity in #{partial_paths}")
  end

  def partial_paths
    [
      "#{activity.type.downcase.pluralize}/#{activity.trackable_type.underscore}/#{activity.key}",
      "#{activity.type.downcase.pluralize}/#{activity.trackable_type.underscore}",
      "#{activity.type.downcase.pluralize}/activity"
    ]
  end
end