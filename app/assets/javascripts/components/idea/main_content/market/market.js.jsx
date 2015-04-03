/** @jsx React.DOM */
var converter = new Showdown.converter();
var Market = React.createClass({

  getInitialState: function() {
    return {
      mode: false,
      editable: false,
      loading: false,
      alreadyOpened: false,
      editing_user: "",
      editing_user_id: null
    }
  },

  componentDidMount: function() {
    var self = this;
    $.pubsub('subscribe', 'closeSectionForm', function(msg, data){
      self.setState({loading: data, editable: false});
    });
  },
  
  handleMarketSubmit: function(formData, body) {
    this.setState({loading: true});
    $.ajaxSetup({ cache: false });
    $.ajax({
      data: formData,
      url: Routes.idea_path(this.props.idea.id),
      type: "PUT",
      dataType: "json",
      success: function ( data ) {
        if(data.error) {
          this.setState({error: data.error});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  openMarketForm: function() {
    var idea = this.state.idea;
    this.setState({editable: !this.state.editable});
  },

  showMarkDownModal: function(){
    React.render(
          <MarkDownHelpModal />,
          document.getElementById('markdown-modal')
        );
    $('#markdownPopup').modal('show');
  },

  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'idea-market': true,
      'hidden': this.state.editable,
      'show': !this.state.editable
    });

    if(this.state.error) {
      var error = <span className="alert alert-danger">{this.state.error}</span>;
    }

    var text = this.state.editable ? <span><i className="ion-close"></i> Cancel </span> : <span><i className="ion-edit"></i> Edit market</span>;

    if(this.props.idea.sections && this.props.idea.sections.market) {
      var html = converter.makeHtml(this.props.idea.sections.market);
      var market_classes = "section-content market";
    } else {
      var html = "<div class='no-content'>Describe the market for your idea. <span>Estimated numbers? Any metrices? etc.</span> </div>";
      var market_classes = "section-content canvas-placeholder sales-marketing market";
    }
    
    if(this.props.meta.is_owner) {
      return (
        <div className="widget-box the-market">
          {error}
          <div className="profile-wrapper-title">
              <h4><i className="ion-stats-bars red-link"></i> Market</h4>
              <a className="show-all margin-right" onClick={this.showMarkDownModal}><i className="ion-help-circled"></i> Markdown Help</a>
              <a className="show-all" onClick={this.openMarketForm}>{text}</a>
          </div>

          <div className="section-content market">
            <div className={classes} dangerouslySetInnerHTML={{__html: html}}></div>
            <MarketForm editable={this.state.editable} idea={this.props.idea} loading= {this.state.loading} handleMarketSubmit= {this.handleMarketSubmit} form={this.props.form} />
          </div>
        </div>
      )
    } else {
       return (
      <div className="widget-box the-market">
        <div className="profile-wrapper-title">
            <h4><i className="ion-stats-bars red-link"></i> Market</h4>
        </div>

        <div className={market_classes}>
          <div className={classes} dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
      </div>
    )
    }
  }
});
