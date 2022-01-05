import React, { Component } from 'react'
import { Text, View,StyleSheet,TouchableOpacity,StatusBar,FlatList,Dimensions } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyStatusBar from '../Components/MyStatusBar'
import {getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';
import NoDataFound from '../Components/NoDataFound'
  

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class Home extends Component {
 

constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsArray:[],
      isLoading:false,
      showLoginBtn:true,
       campaignsArray :[],
       show:false

    };
    console.log('home token == ')
    
    
  }

 
  componentDidMount()
  {
    setTimeout(() => {
        this.setState({
          isLoading:false
        })
      }, 4000);
    this.load()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
       this.load()
      
    });
  
    
  }
  
  load = () =>{
     if (this.state.accessToken === undefined || this.state.accessToken === '')
    {
        getAccessToken().then((token)=>{
            this.setState({
                accessToken:token
            },()=>{
                
                if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
                {
                    this.setState({
                        showLoginBtn:false
                    })
                }
                else
                {
                   
                    this.setState({
                        showLoginBtn:true
                    })  
                }
            })
        })
    }
    else if (this.state.accessToken !== '' && this.state.accessToken !== undefined)
    {
            this.setState({
                showLoginBtn:false
            })   
    }
   


   
    this.setState({
        isLoading:true
      })
     
      this.getCatArray()
   
  }
  
  getSelectedCatStr(){
      var str = ""
      var count = 1
      for (let index = 0; index < this.state.campaignsArray.length; index++) {
          const item = this.state.campaignsArray[index];
          if (item.isSelected)
          {
              if (str === "")
              {
                  str = "list"+count+"="+item.name
              }
              else
              {
                  str += "&list"+count+"="+item.name
              }
               
          }
      }
      console.log("selected str == " + str)
      return str
  }



  handleCardPayPress = () => {
    
     
      }
    

getCatArray() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json'
  },
     
  };
  console.log(requestOptions)
   fetch("https://dev.pixidium.net/rest/categories-listing/", requestOptions)
      .then(response => {
         return response.json()
      }
          )
      .then(responseData =>
        {
          this.setState({
            isLoading:false
          },()=>{
            console.log(responseData)
             if (responseData !== undefined && responseData.status === 200 )
            {
                var tmparray = []
                 responseData.data.map((item,index)=>{
                     if (index === 0)
                    {
                        var newobj = {name:item.name,isSelected:false,lightBG:false}
                        tmparray[index] = newobj
                    }
                    else if (index === 1)
                    {
                        var newobj = {name:item.name,isSelected:false,lightBG:true}
                         
                        tmparray[index] = newobj
                    }
                    else if (index%2 === 0)
                        {
                           
                            var newobj = {name:item.name,isSelected:false,lightBG:true}
                            tmparray[index] = newobj
                        }
                        else
                        {
                            
                            var newobj = {name:item.name,isSelected:false,lightBG:false}
                            tmparray[index] = newobj
                        }
                         
                   
                })
               this.setState({
                campaignsArray:tmparray
              })
            }
        })       
      })
              .catch(error =>{ console.log(error)
              this.setState({
                isLoading:false
              })});


   
}





checkCatSelected (){
    
    for (let index = 0; index < this.state.campaignsArray.length; index++) {
        const element = this.state.campaignsArray[index];
        if (element.isSelected === true)
        {
        return true
        }
    }
    return false
}

    render() {
        return (
            <View style={{flex:1}}>
                <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

                {/* <View style={this.styles.topV}>
                    <Text style={this.styles.title}>PIXIDIUM</Text>
                </View> */}
                          <SmartLoader isLoading={this.state.isLoading}/>
                          
                <CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={!this.state.showLoginBtn} paddingStart={10} isLoginBtn={this.state.showLoginBtn} onPress={()=>{
    this.props.navigation.replace('Login')
}} pageTitle={"PIXIDIUM"}/>
                <Text style={this.styles.subtitle}>
                    SELECT THE CATEGORIES OF YOUR CHOICE
                </Text>
                <FlatList
                style={{height:height - 320,backgroundColor:Appcolor.appColor,marginHorizontal:4,paddingBottom:6}}
                data={this.state.campaignsArray}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem = {({item,index}) => 
                <TouchableOpacity onPress={()=>{
                    var tmp = item
                    tmp.isSelected = !item.isSelected
                    this.updateArray(index,tmp)
                }} style={{...this.styles.itemRow,backgroundColor: item.lightBG === false ? Appcolor.buttonBGColor : Appcolor.light_bg_color, borderWidth: item.isSelected ? 6 : 0,borderColor:'white'}}>
                <Text style={{...this.styles.rowTitle,color: item.lightBG === false ? Appcolor.white : 'black'}}>{item.name.toUpperCase()}</Text>
                 </TouchableOpacity>}
               />
             
             <TouchableOpacity style={this.styles.button} onPress={() =>{
                 var str = this.getSelectedCatStr()
                 if (str !== "")
                 {
                    this.props.navigation.navigate('CategoryView',{catStr:str})
                 }
               else
               {
               alert('Please select at-least one category')
               }
            }}>
            <Text style={this.styles.buttontitle}>CONTINUE</Text>
            </TouchableOpacity>

            </View>
        )
    }

    updateArray = (index,obj) =>{
        var tmp = this.state.campaignsArray
        tmp[index] = obj
        this.setState({campaignsArray:tmp})
    }

    styles = StyleSheet.create({
        itemRow:{
            width:(width/2 - 20),
            paddingVertical:15,
            justifyContent:'center',
            alignItems:'center', 
            marginVertical:7,
            marginHorizontal:8
        },
        imageV:{
            width:'100%',
            height:'100%',
             
        },
        topV:{
            paddingVertical:12,
            justifyContent:'center',
            alignItems:'center',
            borderBottomWidth:1,
            borderBottomColor:Appcolor.appColor,
            marginTop:20
        },
        title:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:17
        },
        subtitle:{
            fontFamily:CustomeFont.helvetica_light,
            fontSize:13,
            paddingStart:15,
            marginVertical:15,
            color:'black'
        },
        rowTitle:{
            fontFamily:CustomeFont.MYRIADPRO_BOLD,
            fontSize:19,
            paddingTop:4,
            textAlign:'center'
        },
        button:{
            marginHorizontal:30,
            height:48,
            backgroundColor:Appcolor.buttonBGColor,
            justifyContent:'center',
            alignItems:'center',
            marginTop:20,
            marginBottom:20,
            borderRadius:10
         },
         buttontitle:{
             fontFamily:CustomeFont.MYRIADPRO_BOLD,
             fontSize:20,
             color:Appcolor.white,
             letterSpacing:1
         }
    })
}




