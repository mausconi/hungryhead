
var LatestUserActivityFollowItem = React.createClass({
  render: function() {
    var html_id = "feed_"+this.props.item.id;

    if(window.currentUser.name === this.props.item.recipient.recipient_name) {
      var recipient = "You"
    } else {
      var recipient = this.props.item.recipient.recipient_name.split(' ')[0];
    }

    return (
        <li id={html_id} className="pointer p-b-10 p-t-10 fs-13 clearfix">
          <span className="inline text-master">
            <span className="verb b-b b-grey p-b-5">
              <i className="fa fa-user-plus"></i> {this.props.item.verb}
            </span>
            <span className="recipient p-l-5">
              <a href={this.props.item.recipient.recipient_url}>{recipient}</a>
            </span>
          </span>
        </li>
      );
  }
});