class InviteMailer < ActionMailer::Base
  def invite_team(user, from, idea, msg)
    @user = user
    @resource = from
    @idea = idea
    @msg = msg
    subject = "#{from.name} has invited you to join his idea #{idea.name}"
    @view_link = idea_url(@idea)
    @invitation_link = join_team_idea_url(@idea)
    mail(:from => from.email, :to => @user.email, :subject => subject)
  end

  def invite_friends(user, from)
    @user = user
    @resource = from
    @token = user.raw_invitation_token
    subject = "#{from.name} has invited you to join hungryhead"
    @invitation_link = accept_user_invitation_url(:invitation_token => @token)
    mail(:from => from.email, :bcc => from, :to => @user.email, :subject => subject)
  end
end