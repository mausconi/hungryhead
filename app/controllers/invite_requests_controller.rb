class InviteRequestsController < ApplicationController

  respond_to :js
  layout "home"

  # POST /invite_requests
  # POST /invite_requests.json
  def create
    @invite_request = InviteRequest.new(invite_request_params)
    respond_to do |format|
      if @invite_request.save
        format.js {render :show}
      else
       flash[:error] = "Looks like we already have your details on our system. We will get in touch soon."
       format.js {render :new}
      end
    end

  end

  private

  def invite_request_params
    params.require(:invite_request).permit(:name, :email, :url, :user_type)
  end

end