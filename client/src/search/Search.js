import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import css from './Search.css'

class Search extends Component {
  state = {
    users: [],
    keyword:""
  }
  
  
  getData = () => {
    axios({
      method:"post",
      url:'/users',
      data: {
       keyword:this.state.keyword,
    }
    })
    .then(function (response) {
      console.log(response);
    })
  }
  takeKeyword = (event) =>{
    this.setState({
      keyword:event.target.value
    })
  }
  
  render() {
    console.log("STATE FROM SEARCH",this.state)
    return (
      <div className='searchMain'>
       <TextField
          onChange={this.takeKeyword}
          id="full-width"
          label="Enter text"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Enter keywords for search"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={this.getData}>
           Search
          </Button>
      </div>
    )
  }
}

export default Search;
