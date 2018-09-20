import React, { Component } from 'react';
import styled from 'styled-components'
import * as _ from 'lodash'
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Header = styled.header`
  background-color: lightgray;
  padding: 5px;
  display: flex;
  height: 50px;
  position: fixed;
  width: 100%;
  align-items: center;
  .button{
    display: inline-block;
    color: palevioletred;
    margin: 5px;
    padding: 5px 20px;
    border: 2px solid palevioletred;
    border-radius: 3px;
  }
  .right{
    margin-left: auto;
    margin-right: 20px
    color: green;
    border: 2px solid green;
  }
  .search{
    position: relative;
    input{
      padding: 5px 20px;
      border: 2px solid palevioletred;
      border-radius: 3px;
      margin: 5px;
      color: palevioletred;
    }
    span{
      display: flex;
      flex-direction: column;
      justify-content:center;
      align-items:center;
      position: absolute;
      height: 24px;
      padding: 5px 10px;
      width: max-content;
      bottom: -36px;
      background-color: palevioletred;
      color: white;
      font-size: 18px;
      font-weight: bold;
      border-radius: 10px;
      border: 2px dashed white;
    }
  }
`
const List = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: gray;
  display: flex;
  flex: 1;

  justify-content: center;
  align-items: center;
  .nolist{
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h2{
      color: darkgray;
    }
  }
  .list{
    overflow: auto;
    flex: 1;
    padding: 0px;
    margin: 0px;
    .loto{
      padding-left: 40px;
      list-style-type: decimal;
      background-color: darkgray;
      li{
        height: 48px;
        padding-left: 20px;
        background-color: gray;
        .numeros{
          display: flex;
          flex-direction: row;
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          li{
            display: inline;
            a {
              background-color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 32px;
              height: 32px;
              border-radius: 16px;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
`

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  h5{
      color: gray;
  }
`

class App extends Component {
  constructor (props) {
    super(props)
    this.openFileChangedHandler = this.openFileChangedHandler.bind(this)
    this.saveLotoFile = this.saveLotoFile.bind(this)
    this.saveToFile = this.saveToFile.bind(this)
    this.generate = this.generate.bind(this)
    this.print = this.print.bind(this)
    this.inputSearchOnChange = this.inputSearchOnChange.bind(this)

    this.test1 = this.test1.bind(this)
    this.test2 = this.test2.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.state = {
      author: 'seddikbenz',
      date: new Date(),
      list: [],
      displayedList: [],
      print: false,
      inputSearch: '',
      showInfo: false
    }
  }

  print () {
    if(this.state.list.length !== 0 ) {
      this.setState({print: true},()=>{
        try {
          window.print()
          this.setState({print: false})
        } catch (error) {
          console.error(error)
          alert('error whene printing')
        }
      })
    } else {
      alert('No Loto List to Print')      
    }
  }

  componentDidMount () {
    this.setState({print: false})
  }

  inputSearchOnChange (e) {
    let value = e.target.value
    if(value.match(/^(\d+,?\d?)*$/)){
      this.setState({inputSearch: value})
      let t = eval('[' + e.target.value + ']')
      if(t.length < 4) {
        this.setState({displayedList: this.state.list, showInfo: true})
      }
      else {
        try {
          let t = eval('[' + e.target.value + ']')
          let displayedList = _.filter(this.state.list, (tab) => {
            return _.intersection(t,tab).length >= 4
          })
          this.setState({displayedList, showInfo: false})
        } catch (error) {
        }
      }
    }
  }

  test1(t) {
    let i, j;
    for (i = 0; i < t.length; i++)
      for (j = i + 1; j < t.length; j++)
        if (t[i] == t[j])
          return false;
    return true;
  }
  
  test2(t) {
    for (let i = 0; i < 6; i++) {
      for (let j = 1; j < 6; j++) {
        let diff1 = Math.abs( t[j] - t[i] )
        let diff2 = Math.abs( t[j + 1] - t[j] )
        if ((diff1 == 1) && (diff2 == 1)) return false;
      }
    }
    return true;
  }
  
  getRandomInt () {
    let min = Math.ceil(1);
    let max = Math.floor(35);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }


  saveToFile(content, fileName, contentType) {
    if(this.state.list.length === 0 ) {
      alert('No Loto list to Save')
    } else{
      let a = document.createElement("a");
      let file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
  }

  openFileChangedHandler (event) {
    const file = event.target.files[0]
    let fr = new FileReader();
    fr.onload = (e) => {
      let lines = e.target.result;
      let state = JSON.parse(lines);
      if(state.hasOwnProperty('author') && state.hasOwnProperty('date') && state.hasOwnProperty('list'))
        this.setState(state)
    }
    try {
      fr.readAsText(file);
    } catch (error) {
      console.error(error)
      alert('error whene reading the file')
    }
  }

  saveLotoFile(){
    var data = this.state
    var jsonData = JSON.stringify(data);
    this.saveToFile(jsonData, 'loto.data', 'application/json');
  }

  generate () {
    let list = []
    let n = 0
    while(n<200){
      let t = [];
      for (let i = 0; i < 7; i++){
        t[i] = this.getRandomInt()
      }
      t = t.sort((a, b) => a-b)
      if ( this.test1(t)  && this.test2(t) ) {
        list.push(t)
        n++
      }
      
    }
    this.setState({list: [...list], displayedList: [...list], date: new Date()})
  }

  render() {
    return (
      <StyledContainer>
          {
            !this.state.print && 
            <Header>
                <input type='file' onChange={this.openFileChangedHandler} className='button' />
                <button onClick={this.saveLotoFile} className='button' >Save</button>
                <button onClick={this.print} className='button' >Print</button>
                <div className='search'>
                  <input 
                    onBlur={()=>this.setState({showInfo: false})}
                    onFocus={()=>this.setState({showInfo: true})}
                    value={this.state.inputSearch} placeholder='example: 1,2,3,4,5,6,7' type='text' onChange={this.inputSearchOnChange} />
                  {this.state.showInfo && <span>You must put 4 numbers !</span>}
                </div>
                <button onClick={this.generate} className='button right'>Generate</button>
            </Header>
          }

        <List>
          {
            this.state.list.length === 0 && 
            <div className='nolist' >
              <h1>No <u>Loto list</u> to show</h1>
              <h2><u>Choose</u> saved file or click <u>generate</u> new Loto list</h2>
            </div>
          }
          {
            this.state.displayedList.length === 0 && this.state.list.length !== 0 &&
            <div className='nolist' >
              <h1>Oops !!</h1>
              <h2>No <u>Loto list</u> found</h2>
            </div>
          }
          {
            this.state.displayedList.length !== 0 &&
            <div className='list'>
              <ul className='loto'>
                {this.state.displayedList.map((l, i)=>(
                  <li key={i}>
                    <ul className='numeros'>
                    {
                      l.map((e,ei)=>(
                        <li key={ei}><a >{e} </a></li>
                      ))
                    }
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          }
        </List>
        {
          !this.state.print && 
            < Footer>
              <h5>{this.state.date.toString()}</h5>
            </Footer>
        }
      </StyledContainer>
    );
  }
}

export default App;
