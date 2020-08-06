import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NavFull from "./navFull";


import "../../App.css";

class Nav extends Component {
  
  constructor() {
    super();
    this.state = {
       errors: {},
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }


  render(){
  
    
    return (
      <div>
        <header>
         
          <NavFull  history={this.props.history}/>
        </header>
      </div>
    );

  }
  
}
Nav.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});


export default connect(mapStateToProps)(Nav);
