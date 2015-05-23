var ListingWidget = React.createClass({

  getInitialState: function() {
    return {
      listing: this.props.listing,
      count: this.props.count,
      path: this.props.path
    }
  },

  loadAll: function() {
    this.setState({loading: true});
    var path = this.props.path;
    $('body').append($('<div>', {class: 'listing_modal', id: 'listing_modal'}));
    React.render(
      <ModalListing path={path} key={Math.random()}  />,
      document.getElementById('listing_modal')
    );
    this.setState({loading: false});
    $('#modalListingPopup').modal('show');
    ReactRailsUJS.mountComponents();
  },

  render: function() {

    var items = _.map(this.state.listing, function(item){
      return <ListingWidgetItem item={item} key={Math.random()} />
    });

    if(this.state.count > 7) {
      var count =  <li onClick={this.loadAll} className="pointer">
            <div className="thumbnail-wrapper d32 circular b-white">
                <div className="bg-master text-center text-white">
                    <span>+{this.state.count - 7}</span>
                </div>
            </div>
         </li>;
    } else {
      var count = "";
    }

    return (
      <ul className="list-unstyled">
        {items}
        {count}
      </ul>
    );
  }
});