/** @jsx React.DOM */

var TextWidgetContent = React.createClass({

  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'widget-content': true,
      'hidden': this.props.mode,
      'show': !this.props.mode,
    });
    if(this.props.content) {
      return(
        <div className={classes} dangerouslySetInnerHTML={{__html: this.props.content}}>
        </div>
      )
    } else {
      return(
      <div className="no-content">  Please publish your summary </div>
      )
    }
  }
});
