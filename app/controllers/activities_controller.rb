class ActivitiesController < ApplicationController

  before_action :authenticate_user!
  before_filter :check_terms

  layout "home"

  def index
    max_updated_at = Activity.maximum(:updated_at).try(:utc).try(:to_s, :number)
    cache_key = "activities/all-#{max_updated_at}"
    Rails.cache.fetch(cache_key, expires_in: 2.hours) do
      @activities = Activity.where(published: true)
        .includes([:trackable, :user])
        .order(id: :desc)
        .paginate(:page => params[:page], :per_page => 20)
    end
  end

  def show
    @activity = Activity.find(params[:id])
    max_updated_at = @activity.updated_at.try(:utc).try(:to_s, :number)
    cache_key = "activity/#{@activity.id}-#{max_updated_at}"
    Rails.cache.fetch(cache_key, expires_in: 2.hours) do
      respond_to do |format|
        format.js
      end
    end
  end

end
