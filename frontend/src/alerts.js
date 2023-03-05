import React from "react";

class Alerts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
    this.timer = null;
  }

  //Update at each changes
  componentDidUpdate(prevProps) {
    //Verify if it's a new request
    if (prevProps.requestId !== this.props.requestId) {
      //if yes reset the old timer
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // Set a new timer of 5 secs
      this.timer = setTimeout(() => {
        this.setState({ isVisible: false });
      }, 5000);
      // set state to visible
      this.setState({ isVisible: true });
    }
  }

  render() {
    console.log("Refresh Alert");
    const isVisible = this.state.isVisible;
    const {message,status} = this.props;

    return (
      <div>
        {isVisible && message && (
          <div className={`alertmessage ${status === 200 ? "good" : "bad"}`}>
            <p>{message}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Alerts;
