var SetIntervalMixin = {
    componentWillMount: function() {
        this.intervals = [];
    },
    setInterval: function(fn, ms) {
        this.intervals.push(setInterval(fn, ms));
    },
    componentWillUnmount: function() {
        this.intervals.forEach(clearInterval);
    }
};
var FriendsNotifications = React.createClass({
  getInitialState: function(){
    return {
      feed: [],
      next_page: null,
      closed: true,
      count: null,
      loading: true
    };
  },

  componentDidMount: function() {
    if(this.isMounted()){
      this.fetchNotifications();
      $.Pages.init();
      if(channel) {
        channel.bind(this.props.channel_event, function(data){
          var new_item = this.buildElements([data.data])
          var newState = React.addons.update(this.state, {
              feed : {
                $unshift : new_item
              }
          });
          this.setState(newState);
          $("#feed_"+data.data.id).effect('highlight', {color: '#f7f7f7'} , 5000);
          $("#feed_"+data.data.id).addClass('animated fadeInDown');
        }.bind(this));
      }
    }

  },

  buildElements: function(feed) {
      var elements = [];
      _.map(feed, function(item){
        if(item.verb === "invested") {
          elements.push(<FriendsNotificationInvestmentItem key={Math.random()} item={item} />)
        } else if(item.verb === "followed") {
          elements.push(<FriendsNotificationFollowItem key={Math.random()} item={item} />)
        } else if(item.verb === "feedbacked") {
          elements.push(<FriendsNotificationFeedbackItem key={Math.random()} item={item} />)
        } else if(item.verb === "pitched"){
          elements.push(<FriendsNotificationIdeaItem key={Math.random()} item={item} />)
        } else if(item.verb === "joined"){
          elements.push(<FriendsNotificationJoinItem key={Math.random()} item={item} />)
        } else if(item.verb === "commented"){
          elements.push(<FriendsNotificationCommentItem key={Math.random()} item={item} />)
        } else if(item.verb === "voted"){
          elements.push(<FriendsNotificationVoteItem key={Math.random()} item={item} />)
        } else if(item.verb === "mentioned"){
          elements.push(<FriendsNotificationMentionItem key={Math.random()} item={item} />)
        }
      });
      return elements;
  },

  loadMoreNotifications: function() {
    var self = this;
    if(!self.state.done) {
      $.ajax({
        url: this.props.path + "?page=" + this.state.next_page,
        success: function(data) {
          var feed = self.state.feed;
          var new_elements = self.buildElements(data.items)
          self.setState({next_page: data.next_page, isInfiniteLoading: false,  feed: self.state.feed.concat(new_elements)});
          if(self.state.next_page === null) {
            self.setState({done: true, isInfiniteLoading: false});
            event.stopPropagation();
          }
        }
      });
    }
  },

  handleInfiniteLoad: function() {
    if(this.state.next_page != null) {
      this.loadMoreNotifications();
    }
  },

  elementInfiniteLoad: function() {
    return;
  },


  fetchNotifications: function(){
    $.getJSON(this.props.path, function(json, textStatus) {
      this.setState({
        feed: this.buildElements(json.items),
        next_page: json.next_page,
        loading: false
    });
    }.bind(this));
  },

  render: function(){

    if(this.state.loading) {
      var content = <div className="no-content hint-text">Loading <i className="fa fa-spinner fa-spin"></i></div>;
    } else {
        if(this.state.feed.length > 0) {
          var content  = <Infinite elementHeight={65}
                   containerHeight={$(window).height() - 40}
                   infiniteLoadBeginBottomOffset={200}
                   onInfiniteLoad={this.handleInfiniteLoad}
                   loadingSpinnerDelegate={this.elementInfiniteLoad()}
                   isInfiniteLoading={this.state.isInfiniteLoading}
                   >
                    {this.state.feed}
                   </Infinite>;
        } else {
          var content = <div className="text-center fs-22 font-opensans text-master light p-t-40 p-b-40">
          <i className="fa fa-list"></i>
          <span className="clearfix">No friends notifications</span>
        </div>;
        }
    }

    return(

      <div id="notificationsPanel" className="quickview-wrapper p-b-20" data-pages="quickview">
        <div className="tab-content">
          <div className="tab-pane fade  in active no-padding" id="quickview-notifications">
            <div className="view-port clearfix" id="notifications">
              <div className="view bg-white">
                <div className="navbar navbar-default navbar-sm bg-solid">
                  <div className="navbar-inner">
                    <div className="view-heading text-white">
                      Friends Notifications
                    </div>
                    <a className="btn-link inline action p-r-10 pull-right link text-white" data-toggle-element="#notificationsPanel" data-toggle="sidePanel"><i className="pg-close"></i></a>
                  </div>
                </div>
                  <div className="list-view boreded no-top-border">
                    <ul className="no-style no-padding no-margin p-b-20">
                      {content}
                    </ul>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      );
  }
});