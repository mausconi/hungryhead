class CreateVoteService

  def initialize(user, votable)
    @user = user
    @votable = votable
  end

  def vote
    @votable.votes.new(voter: @user)
  end

  def unvote
    @votable.votes.where(voter: @user).each do |vote|
      vote.destroy!
    end
  end

end