var VideoForm = React.createClass({

  render: function() {
    var classes = classNames({
      'plan-edit-form': true,
      'show': this.props.editable,
      'hidden': !this.props.editable
    });

     var loading_class = classNames({
      'fa fa-spinner fa-spin': this.props.loading
    });

    return (
      <div className={classes}>
         <form id="plan-edit-form" ref="video_form" className="video-edit-form" onSubmit={this._onKeyDown}>
             <label className="margin-bottom">Add a 3 minute video pitch. <span>Introduce your idea and team.</span></label>
             <input ref="video" className="form-control empty" defaultValue= {this.props.idea.video} name="idea[video]" placeholder='Enter youtube or vimeo url' />
             <div className="form-buttons send-button">
              <div>
                <button type="submit" id="post_feedback_message" className="main-button"><i className={loading_class}></i> Save </button>
              </div>
            </div>
          </form>
      </div>
    )
  },

  _onKeyDown: function(event) {
      event.preventDefault();
      var formData = $( this.refs.video_form ).serialize();
      this.props.handleVideoSubmit(formData);
  }

});
