import React, { Component } from 'react';
import styled from 'styled-components'

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

    this.test1 = this.test1.bind(this)
    this.test2 = this.test2.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.state = {
      author: 'seddikbenz',
      date: Date.now(),
      list: [],
      print: false
    }
  }

  print () {
    this.setState({print: true},()=>{
      try {
        window.print()
        this.setState({print: false})
      } catch (error) {
        console.error(error)
        alert('error whene printing')
      }
    })
  }

  componentDidMount () {
    this.setState({print: false})
  }

  test1(t) {
    let i, j;
    for (i = 0; i < t.length; i++)
      for (j = i + 1; j < t.length; j++)
        if (t[i] == t[j])
          return 0;
    return 1;
  }
  
  test2(t) {
    for (let i = 0; i < 7; i++) {
      for (let j = 1; i < 9; i++) {
        let diff1 = t[j] - t[i];
        let diff2 = t[j + 1] - t[j];
        if ((diff1 == 1) && (diff2 == 1))
          return 0;
      }
    }
    return 1;
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
      t = t.sort(function(a, b){return a-b})
      if ((this.test1(t) == 1) && (this.test2(t) == 1)) {
        list.push(t)
        //console.log(n + ' : ' + t);
        n++
      }
      
    }
    this.setState({list: [...list]})
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
            this.state.list.length !== 0 &&
            <div className='list'>
              <ul className='loto'>
                {this.state.list.map((l, i)=>(
                  <li key={i}>
                    <ul className='numeros'>
                    {
                      l.map((e,ei)=>(
                        <li><a key={ei}>{e} </a></li>
                      ))
                    }
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          }
        </List>
        <Footer>
          <h5>{Date(this.state.date).toString()}</h5>
        </Footer>
      </StyledContainer>
    );
  }
}

export default App;
