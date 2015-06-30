class InvestmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_investment, only: [:show, :destroy]
  before_action :set_props, only: [:index, :show, :create]
  respond_to :json, :html

  after_action :verify_authorized
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  layout "idea"

  # GET /investments
  # GET /investments.json
  def index
    @team  = User.fetch_multi(@idea.team)
    current_user = current_user
    authorize @idea
    @investments = @idea.get_investments.paginate(:page => params[:page], :per_page => 10)
  end

  # GET /investments/1
  # GET /investments/1.json
  def show
    @team  = User.fetch_multi(@idea.team)
    authorize @idea
  end

  # POST /investments
  # POST /investments.json
  def create
    if current_user.balance_available?(params[:investment][:amount])
      @investment = CreateInvestmentService.new(investment_params, current_user, @idea).create
      authorize @investment
      respond_to do |format|
        if @investment.save
          format.json { render :show, status: :created }
        else
          format.json { render json: @investment.errors, status: :unprocessable_entity }
        end
      end
    else
      respond_to do |format|
        format.json { render json: {error: "Insufficient Balance #{current_user.fund['balance']}"}, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_investment
      @idea = Idea.fetch_by_slug(params[:idea_id])
      @investment = Investment.fetch(params[:id])
    end

    def set_props
      @idea = Idea.fetch_by_slug(params[:idea_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def investment_params
      params.require(:investment).permit(:id, :amount, :message)
    end
end
