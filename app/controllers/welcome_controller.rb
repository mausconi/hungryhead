class WelcomeController < ApplicationController
  include Wicked::Wizard
  before_filter :authenticate_user!, :user
  steps :hello, :follow_friends
  layout "home"

  def show
    @welcome = current_user #for merit to avoid console errors
    @user = current_user
    case step
    when :follow_friends
      ids = User.where(school_id: @user.school_id).pluck(:id) if @user.school_id.present?
      if ids
        @friends = User.find(ids - [current_user.id]).paginate(:page => params[:page], :per_page => 10)
      else
        skip_step
      end
    end
    render_wizard
  end

  def update
    @welcome = current_user #for merit to avoid console errors
    @user = current_user
    case step
    when :hello
      @user.update_attributes(user_params)
      CreateActivityJob.set(wait: 2.seconds).perform_later(@user.id, @user.class.to_s)
    end
    sign_in(@user, bypass: true)
    render_wizard @user
  end

  private

  def user_params
    params.require(:user).permit(:rules_accepted)
  end

  def finish_wizard_path
    profile_path(@user)
  end

  def user
    @user = current_user
  end

end
