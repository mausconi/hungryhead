var BusinessModelForm = React.createClass({

  render: function() {
    var classes = classNames({
      'business-model-edit-form': true,
      'show': this.props.editable,
      'hidden': !this.props.editable
    });

    var loading_class = classNames({
      'fa fa-spinner fa-spin': this.props.loading
    });

     if(this.props.idea && this.props.idea.business_model) {
      var business_model = this.props.idea.business_model;
     } else {
      var business_model = "";
     }

    return (
      <div className={classes}>
         <form id="business-model-edit-form" ref="business_model_form" className="business-model-edit-form" onSubmit={this._onKeyDown}>
             <label className="m-b-20">Describe the business model for your idea. <span>How do you plan to make revenue from your idea? </span> <small className="clearfix">You can link images using markdown(Click help).</small> </label>
             <textarea ref="description" className="form-control empty" defaultValue={business_model} name="idea[business_model]" placeholder='Describe your business model' autofocus/>
             <div className="form-buttons send-button m-t-10 pull-right">
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
      var formData = $( this.refs.business_model_form ).serialize();
      this.props.handleBusinessModelSubmit(formData, {text: this.refs.description.value});
  }

});
