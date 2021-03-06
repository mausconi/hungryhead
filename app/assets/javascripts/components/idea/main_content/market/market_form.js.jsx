var MarketForm = React.createClass({

  render: function() {
    var classes = classNames({
      'market-edit-form': true,
      'show': this.props.editable,
      'hidden': !this.props.editable
    });

    var loading_class = classNames({
      'fa fa-spinner fa-spin': this.props.loading
    });

     if(this.props.idea && this.props.idea.market) {
      var market = this.props.idea.market;
     } else {
      var market = "";
     }

    return (
      <div className={classes}>
         <form id="market-edit-form" ref="market_form" className="market-edit-form" onSubmit={this._onKeyDown}>
             <label className="m-b-20">Describe the market for your idea. <span>People you are targeting? Estimated numbers? </span> <small className="clearfix">You can link images using markdown(Click help).</small> </label>
             <textarea ref="description" className="form-control empty" defaultValue={market} name="idea[market]" placeholder='Describe your market' autofocus/>
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
      var formData = $( this.refs.market_form ).serialize();
      this.props.handleMarketSubmit(formData, {text: this.refs.description.value});
  }

});
