import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


interface IState {
  list: object[],
  inputValue:string,
  search:object[],
  btnType:string
}
interface IProps{

}
interface IPropsItem{
  itemObj:any,
  onDeleteItem:any
  onEditItem:any
}
interface IStateItem{
  name:string,
  show:boolean
}
interface IRefKey{
  input?:any
}
class ItemInput extends Component<IPropsItem,IStateItem>{
  refKey:IRefKey={};
  constructor(props:IPropsItem){
    super(props);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.changeEditInput = this.changeEditInput.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.state = {
      name:this.props.itemObj.name,
      show:true
    }
  }
  deleteItem(event:any){
    let id:number = event.target.getAttribute('data-id');
    this.props.onDeleteItem(id);
  }
  editItem(){
    this.setState((prevState,prevProp)=> ({
        show:!prevState.show,
        name:prevProp.itemObj.name
    }),()=>{
      this.refKey.input.focus();
    });
   
  }
  handleKeydown(event:any){
    if(event.keyCode === 13){
      let id = event.target.getAttribute('data-id');
      let name = this.state.name;
      if(name == this.props.itemObj.name){
        this.setState((prevState)=> ({
          show:!prevState.show
        }))
      }else{
        this.props.onEditItem(id,name);
      }
    }
  }
  changeEditInput(event:any){
    this.setState({
      name:event.target.value
    })
  }
  render(){
    let id = this.props.itemObj.id;
    let name = this.props.itemObj.name;
    let stateName = this.state.name;
    let show = this.state.show;

    return (
       <li>
        <span style={{display:show?'':'none'}}>{name}</span>
        <input style={{display:show?'none':''}} type="text" ref={(ref:any)=>this.refKey.input = ref}  value={stateName} onChange={this.changeEditInput} onKeyDown={this.handleKeydown} data-id={id} />
        <input type="button" value="X" onClick={this.deleteItem} data-id={id}/>
        <input type="button" value={show?'Edit':'Cancel Edit'} onClick={this.editItem}  data-id={id}/>
      </li>
    )
  }
}


class App extends Component<IProps, IState>  {
  constructor(props:IProps){
    super(props);
    this.state = {
      list:[],
      inputValue:'',
      search:[],
      btnType:''
    }
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.searchItem = this.searchItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }
  changeInput(event:any){
    this.setState({inputValue:event.target.value});
  }
  editItem(id:number,name:string){
    let newList = JSON.parse(JSON.stringify(this.state.list))
    newList.forEach((element:any) => {
      if(element.id == id){
        element.name = name;
      }
    });
    this.setState((prevState)=> ({
      list:newList
    }))
  }
  searchItem(){
    let list :object[] = this.state.list.concat();
    let value = this.state.inputValue;
    let result :object[] = list.filter((item:any) => item.name.indexOf(value)>-1);
    this.setState({
      search:result,
      btnType:'search'
    })
  }
  deleteItem(id:number){
      this.setState((prevState)=> ({
        list:prevState.list.filter((item:any)=> (item.id!=id)),
        btnType:'delete'
      }))
  }
  addItem(){
    if(this.state.inputValue === ''){
      return;
    }
    this.setState((prevState:any)=> ({
      list:prevState.list.concat({'name':this.state.inputValue,'id':Date.now()}),
      btnType:'add'
    }))
  }
  render() {
    let value :string = this.state.inputValue;
    let btnType = this.state.btnType;//add，delete，search
    let lis = null;
    let arr :object[]= [];

    arr = btnType === 'search'?this.state.search:this.state.list
    lis = arr.map((item:any) => 
      <ItemInput key={item.id} onDeleteItem={this.deleteItem} onEditItem ={this.editItem} itemObj={item} />
    )
    return (
      <div className="App">
        <input type="text" value={value} onChange={this.changeInput}/>
        <input type="button" value="Add" onClick={this.addItem} />
        <input type="button" value="Search" onClick={this.searchItem} />
        <ul>
          {lis}
        </ul>

      </div>
    );
  }
}

export default App;
