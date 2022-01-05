import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import CommonLoginHeader from '../Components/CommonLoginHeader';
import images from '../../../assets';
import Appcolor from '../../../Appcolor';
import CustomeFont from '../../../CustomeFont';
import MyStatusBar from '../Components/MyStatusBar';
import {getAccessToken} from '../../Utilities/LocalStorage'
import SmartLoader from '../Components/SmartLoader';
import NoDataFound from '../Components/NoDataFound'

const width = Dimensions.get('window').width;
export default class CategoryView extends Component {
  constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsArray:[],
      isLoading:false,
      showLoginBtn:true,
       campaignsArray :[]

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
     
      this.getCampsList()
   
  }
  
   

getCampsList() {

  const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/json','Content-Type': 'application/json'
  },
     
  };
  console.log(requestOptions)
   fetch("https://dev.pixidium.net/rest/campaign-listing/?"+this.props.route.params.catStr, requestOptions)
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
                
               this.setState({
                campaignsArray:responseData.data
              })
            }
        })       
      })
              .catch(error =>{ console.log(error)
              this.setState({
                isLoading:false
              })});


   
}



  render() {
    return (
      <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
            <SmartLoader isLoading={this.state.isLoading}/>

<CommonLoginHeader openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={!this.state.showLoginBtn} isLoginBtn={this.state.showLoginBtn} onPress={()=>{
    this.props.navigation.replace('Login')
}} isBackBtn={true} pop={()=>{this.props.navigation.pop()}} pageTitle={"PIXIDIUM"}/>
         
         <FlatList
          style={{marginBottom: 0}}
          data={this.state.campaignsArray}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (this.row(item))}
        />
      </View>
    );
  }

row=(item)=>{
  let Image_Http_URL ={ uri: item.cover_image};
 console.log(item)
  return (
    <TouchableOpacity 
    onPress={()=>{
      this.props.navigation.navigate("CampaignPreview",{isFromInProgress:false,camp_id:item.campaign_id})
    }}
    style={this.styles.itemRow} activeOpacity={0.8}>
      <Image
        style={this.styles.imageV}
        source={Image_Http_URL}
        resizeMode={'cover'}
      />
    </TouchableOpacity>
  )
}

  styles = StyleSheet.create({
    itemRow: {
      width: width / 2 - 20,
      height: 160,
      marginVertical: 10,
      marginHorizontal: 10,
      shadowColor: 'gray',
    shadowOffset: {x: 0, y: 2},
    shadowRadius: 3,
    shadowOpacity: 0.8,
    backgroundColor:'white',
    elevation:5
    },
    imageV: {
      width: '100%',
      height: '100%',
    },
    topV: {
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      flexDirection: 'row',
      borderBottomColor: Appcolor.appColor,
      marginTop: 20,
    },
    title: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 17,
      flex: 1,
      textAlign: 'center',
      marginStart: -25,
    },
  });
}
