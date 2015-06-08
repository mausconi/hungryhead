
var LatestUserActivityInvestmentItem = React.createClass({

  loadActivity: function() {
    $.getScript(Routes.activity_path(this.props.item.activity_id));
  },

  render: function() {
    var html_id = "feed_"+this.props.item.id;

    return (
        <li id={html_id} className="pointer p-b-10 p-t-10 fs-13 clearfix">
          <span className="inline text-master">
            <span className="verb">
              <i className="fa fa-dollar bold"></i> {this.props.item.verb}
               in <a href={this.props.item.recipient.recipient_url}> {this.props.item.recipient.recipient_name}</a>
            </span>
          </span>
        </li>
      );
  }
});