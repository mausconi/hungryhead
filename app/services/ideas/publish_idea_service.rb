class PublishIdeaService

  include Wisper::Publisher

  def initialize(idea, user)
    @idea = idea
    @user = user
  end

  def publish
    if @idea.profile_complete?
      @idea.published!
      @idea.everyone!
      publish :idea_published, @idea
    else
      publish :error, @idea
    end
  end

  def unpublish
    @idea.draft!
    @idea.me!
    publish :idea_unpublished, @idea
  end

end