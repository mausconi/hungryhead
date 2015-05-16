class UserSavedService

  def initialize(user)
    @user = user
  end

  def call
    load_into_soulmate
  end

  #Load data to redis using soulmate after_save
  def load_into_soulmate
    #Seperate index for each user type
    unless @user.admin?
      if @user.type == "Student"
        soulmate_loader("students")
      elsif @user.type == "Mentor"
        soulmate_loader("mentors")
      elsif @user.type == "Teacher"
        soulmate_loader("teachers")
      end
    end
  end

  def soulmate_loader(type)
    #instantiate soulmate loader to re-generate search index
    loader = Soulmate::Loader.new(type)
    loader.add(
      "term" => @user.name,
      "image" => @user.avatar.url(:avatar),
      "description" => @user.mini_bio,
      "id" => @user.id,
      "data" => {
        "link" => profile_path(@user)
      }
    )
  end

end