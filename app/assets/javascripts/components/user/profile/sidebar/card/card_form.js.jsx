
var CardForm = React.createClass({

  getInitialState: function() {
    return {
      loading: false
      }
  },

  componentDidMount: function() {
    if(this.isMounted()){
      $.pubsub('subscribe', 'sidebar_widget_saving', function(msg, data){
        this.setState({loading: data});
      }.bind(this));

      $("#editProfileFormPopup").on("hidden.bs.modal", function (e) {
        $('#edit_profile_form_modal').remove();
      });

      $('.single-tag').tagsinput({maxTags: 1});
      $('.three-tags').tagsinput({maxTags: 3});
      this.selectHobbies();
      this.selectLocations();
      this.selectMarkets();
      this.selectSkills();
      this.schoolSelect();
      this.selectSubjects();
    }
  },

  selectHobbies: function(e){
    var $hobbiesSelect = $('#hobbies_select');
    var self = this;
    $hobbiesSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          tags: true,
          maximumSelectionSize: 3,
          ajax: {
            url: Routes.autocomplete_hobby_name_hobbies_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          },
          id: function(object) {
            return object.text;
          },
          initSelection: function (element, callback) {
            var hobbies = self.props.profile.hobbies.map(function(hobby){
              return {id: Math.random(), text: hobby.tag}
            });
            callback(hobbies);
          }
        });
      };
    })(this));
  },

  selectLocations: function(e){
    var $locationsSelect = $('#locations_select');
    var self = this;
    $locationsSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          tags: true,
          maximumSelectionSize: 1,
          ajax: {
            url: Routes.autocomplete_location_name_locations_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          },
          id: function(object) {
            return object.text;
          },
          initSelection: function (element, callback) {
            var locations = self.props.profile.locations.map(function(location){
              return {id: Math.random(), text: location.tag}
            });
            callback(locations);
          }
        });
      };
    })(this));
  },

  selectMarkets: function(e){
    var $marketsSelect = $('#markets_select');
    var self = this;
    $marketsSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          tags: true,
          maximumSelectionSize: 3,
          ajax: {
            url: Routes.autocomplete_market_name_markets_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          },
          id: function(object) {
            return object.text;
          },
          initSelection: function (element, callback) {
            var markets = self.props.profile.markets.map(function(market){
              return {id: Math.random(), text: market.tag}
            });
            callback(markets);
          }
        });
      };
    })(this));
  },

  selectSubjects: function(e){
    var $subjectsSelect = $('#subjects_select');
    var self = this;
    $subjectsSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          tags: true,
          maximumSelectionSize: 3,
          ajax: {
            url: Routes.autocomplete_subject_name_subjects_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          },
          id: function(object) {
            return object.text;
          },
          initSelection: function (element, callback) {
            var subjects = self.props.profile.subjects.map(function(subject){
              return {id: Math.random(), text: subject.tag}
            });
            callback(subjects);
          }
        });
      };
    })(this));
  },

  schoolSelect: function() {
    var $schoolSelect = $('#school_select');
    var self = this;
    $schoolSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          id: function(e) { return self.props.profile.school_id; },
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          ajax: {
            url: Routes.autocomplete_school_name_schools_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          }
        });
      };
    })(this));
    $schoolSelect.select2('data', {id:self.props.profile.school_id, text: self.props.profile.school_name});
  },

  selectSkills: function(e){
    var $skillsSelect = $('#skills_select');
    var self = this;
    $skillsSelect.each((function(_this) {
      return function(i, e) {
        var select;
        select = $(e);
        return $(select).select2({
          minimumInputLength: 2,
          placeholder: select.data('placeholder'),
          tags: true,
          maximumSelectionSize: 3,
          ajax: {
            url: Routes.autocomplete_skill_name_skills_path(),
            dataType: 'json',
            type: 'GET',
            cache: true,
            quietMillis: 50,
            data: function(term) {
              return {
                term: term
              };
            },
            results: function(data) {
              return {
                results: $.map(data, function(item) {
                  return {
                    text: item.label,
                    value: item.value,
                    id: item.id
                  };
                })
              };
            }
          },
          id: function(object) {
            return object.text;
          },
          initSelection: function (element, callback) {
            var skills = self.props.profile.skills.map(function(skill){
              return {id: Math.random(), text: skill.tag}
            });
            callback(skills);
          }
        });
      };
    })(this));
  },

  render: function() {
      if(this.props.profile.markets && this.props.profile.markets.length > 0 ) {
      var markets = this.props.profile.markets.map(function(market){
        return market.tag
      });
    } else {
      var markets = "";
    }

    if(this.props.profile.hobbies && this.props.profile.hobbies.length > 0 ) {
      var hobbies = this.props.profile.hobbies.map(function(hobby){
        return hobby.tag
      });
    } else {
      var hobbies = "";
    }

    if(this.props.profile.skills && this.props.profile.skills.length > 0 ) {
      var skills = this.props.profile.skills.map(function(skill){
        return skill.tag
      });
    } else {
      var skills = "";
    }

    if(this.props.profile.subjects && this.props.profile.subjects.length > 0 ) {
      var subjects = this.props.profile.subjects.map(function(subject){
        return subject.tag
      });
    } else {
      var subjects = "";
    }

    if(this.props.profile.years && this.props.profile.years.length > 0 ) {
      var years = this.props.profile.years.map(function(subject){
        return subject.tag
      });
    } else {
      var subjects = "";
    }

    var loadingClass = classNames({
      'fa fa-spinner fa-spin': this.state.loading
    });

    return(
      <div className="modal fade stick-up" id="editProfileFormPopup" tabIndex="-1" role="dialog" aria-labelledby="editProfileFormPopupLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header clearfix text-left">
                    <button type="button" className="close" onClick={this.props.closeForm}>
                      <i className="pg-close fs-14"></i>
                    </button>
                    <h5 className="b-b b-grey p-b-5 pull-left">Edit your <span className="semi-bold">Profile</span></h5>
                </div>
                <div className="modal-body p-t-20">
                    <div className="editProfile">
                      <div className="panel panel-default no-border">
                        <div className="panel-body no-padding no-border">
                          <form ref="profile_form" noValidate="novalidate" className="edit_user" id="edit_user" method="put" onSubmit={this._onKeyDown} acceptCharset="UTF-8">
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label>Your name</label>
                                  <span className="help"> e.g. "John Doe" <span className="text-danger">required</span></span>
                                  <input className="string required form-control" required="required" aria-required="true" type="text" defaultValue={this.props.profile.name} name="user[name]" id="user_name" />
                              </div>
                              <div className="form-group">
                                  <label>Email</label>
                                  <span className="help"> e.g. "johndoe@example.com" <span className="text-danger">required</span></span>
                                 <input className="string email required form-control" required="required" aria-required="true" type="email" defaultValue={this.props.profile.email}  name="user[email]" id="user_email" />
                              </div>
                              <div className="form-group">
                                  <label>Mini Bio</label>
                                  <span className="help"> e.g. "Student, interested in startups"</span>
                                  <input className="string required form-control" required="required" aria-required="true" type="text" placeholder="I am founder or student of ..." defaultValue={this.props.profile.mini_bio}  name="user[mini_bio]" id="user_mini_bio" />
                              </div>
                              <div className="form-group">
                                <label>Location you are based</label>
                                <span className="help"> e.g. "Lancaster"</span>
                                <input defaultValue={this.props.profile.location_name} className="form-control string optional location_list full-width" data-placeholder="Location where you are based?" type="text" name="user[location_list]" id="locations_select" />
                              </div>
                              <div className="form-group">
                                <label>Select your University/College</label>
                                <input type="text" name="user[school_id]" autoComplete="off" id="school_select" data-placeholder="Type and choose your school from the list" className="form-control full-width" />
                                <small className="fs-8 text-master pull-right p-t-10 p-b-10">Your school is not in the list. <a data-toggle="modal" data-target="#addSchoolPopup" className="pointer">Click here</a></small>
                              </div>
                              <div className="form-group clearfix">
                                <label>Markets interested</label>
                                <span className="help"> e.g. "Ecommerce, SASS"</span>
                                <input defaultValue={markets} className="string optional form-control market_list full-width" data-placeholder="Which markets interests you?" type="text" name="user[market_list]" id="markets_select" />
                              </div>
                              <div className="form-group">
                                <label>Skills</label>
                                <span className="help"> e.g. "Programming, Marketing"</span>
                                <input defaultValue={skills} autoComplete="off" id="skills_select" className="string optional form-control full-width" data-placeholder="What skills do you have?" type="text" name="user[skill_list]" />
                              </div>
                            </div>
                            <div className="col-md-6">

                              <div className="form-group">
                                <label>Education/Subjects Studied</label>
                                <span className="help"> e.g. "Computer Science, Marketing"</span>
                                <input defaultValue={subjects} className="form-control string optional location_list full-width" data-placeholder="Subjects you have studied?" type="text" name="user[subject_list]" id="subjects_select" />
                              </div>

                              <div className="form-group">
                                <label>Graduation year </label>
                                <span className="help"> e.g. "2000, 2001"</span>
                                <input defaultValue={years} className="form-control string optional year_list full-width" data-placeholder="What year you graduated in?" type="text" name="user[year_list]" id="years_select" />
                              </div>

                              <div className="form-group">
                                  <label>Website url</label>
                                  <span className="help"> e.g. "www.example.com"</span>
                                  <input className="string form-control" type="url" placeholder="Enter Website url" defaultValue={this.props.profile.website_url}  name="user[website_url]" id="user_website_url" />
                              </div>
                              <div className="form-group">
                                  <label>Linkedin url</label>
                                  <span className="help"> e.g. "www.linkedin.com/john"</span>
                                  <input className="string form-control" type="url" placeholder="Enter Linkedin url" defaultValue={this.props.profile.linkedin_url}  name="user[linkedin_url]" id="user_linkedin_url" />
                              </div>
                              <div className="form-group">
                                  <label>Facebook url</label>
                                  <span className="help"> e.g. "www.facebook.com/john"</span>
                                  <input className="string form-control" type="url" placeholder="Enter Facebook url" defaultValue={this.props.profile.facebook_url}  name="user[facebook_url]" id="user_facebook_url" />
                              </div>
                              <div className="form-group">
                                  <label>Twitter url</label>
                                  <span className="help"> e.g. "www.twitter.com/john"</span>
                                  <input className="string form-control" type="url" placeholder="Enter Twitter url" defaultValue={this.props.profile.twitter_url}  name="user[twitter_url]" id="user_twitter_url" />
                              </div>

                              <div className="form-group">
                                <label>Interests/Hobbies</label>
                                <span className="help"> e.g. "Games, Football"</span>
                                <input defaultValue={hobbies} autoComplete="off" id="hobbies_select" className="string optional form-control" full-width data-placeholder="Which hobbies or interests you have?" type="text" name="user[hobby_list]" />
                              </div>

                              <div className="m-t-20 pull-right">
                                <button name="commit" className="main-button bold fs-13"><i className={loadingClass}></i> <i className="fa fa-check-circle"></i> Save</button>
                                <a onClick={this.props.closeForm} id="cancel-edit-profile" className="main-button bold fs-13 m-l-10"> <i className="fa fa-remove"></i> Cancel</a>
                              </div>
                            </div>
                          </form>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>

    )
  },

  _onKeyDown: function(event) {
    event.preventDefault();
    if($(this.refs.profile_form).valid()) {
      var formData = $( this.refs.profile_form ).serialize();
      this.props.saveSidebarWidget(formData, this.props.form.action);
    }
  }

});
