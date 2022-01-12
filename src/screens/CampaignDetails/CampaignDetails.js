import React, { Component } from 'react'
import { Image, View,StyleSheet,TouchableOpacity,ScrollView,Dimensions,Text,Alert } from 'react-native'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import images from '../../../assets'
import Appcolor from '../../../Appcolor'
import CustomeFont from '../../../CustomeFont'
import MyStatusBar from '../Components/MyStatusBar'
import {
    getUserType,
   getAccessToken,
  } from '../../Utilities/LocalStorage';
import Moment from 'moment';
import ShowFullImage from '../Components/ShowFullImage';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export default class CampaignDetails extends Component {

 

constructor(props){
    super(props);
    this.state={
      accessToken:'',
      campaignsDetails:{},
      isLoading:false,
      showFullImageModal:false
    };
  }


componentDidMount()
  {
    
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {
        if (this.state.accessToken === undefined || this.state.accessToken === '')
        {
            getAccessToken().then(token=>{
                console.log(token)
                this.setState({
                  accessToken:token
                },()=>{
                  console.log('yyyyyyyyyy888888 ====  ')
                  console.log(token)
                  this.getDetails()
                                      })
              }) 
       
        }
        else
        {
            this.getDetails()
        }
    });
  
    
  }

getDetails() {
    const formData = new FormData();
    formData.append('campaign_id', this.props.route.params.campaingn_id);
    const requestOptions = {
        method: 'GET',
        headers: { 'Accept': 'application/json','Content-Type': 'application/json',
        "Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken,
       // body: formData,
    },
       
    };
    console.log(requestOptions)
    console.log("https://www.pixidium.net/rest/campaign-detail/?id=" + this.props.route.params.campaingn_id)
     fetch("https://www.pixidium.net/rest/campaign-detail/?id=" + this.props.route.params.campaingn_id, requestOptions)
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
                    campaignsDetails:responseData.data
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
        Moment.locale('en');

        let Image_Http_URL ={ uri: this.state.campaignsDetails.cover_image};
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />

<CommonLoginHeader paddingEnd={70} onPress={()=>{
    this.props.navigation.replace('Login')
}} isBackBtn={true} pop={()=>{this.props.navigation.pop()}} pageTitle={"PIXIDIUM"}/>
         
         <ShowFullImage
          callback={() => {
            this.setState({
              showFullImageModal: false,
            });
          }}
          selectedYoutubeFile={this.state.youtube_video_link}
          selectedVideoFile={this.state.promotional_video}
          type={'0'}
          isLoading={this.state.showFullImageModal}
          image1={Image_Http_URL}
          showRotateBtn = {this.state.campaignsDetails.back_cover_image === '' ? false : true} 
          image2 = {{uri:this.state.campaignsDetails.back_cover_image}} 

        />
           <View style={{flexDirection:'row',marginTop:10}}>
           {/* <TouchableOpacity
            onPress={() => {
              this.props.navigation.pop();
              console.log('ddddddd');
            }}
            style={this.styles.backButton}>
            <Image source={images.arrow_back} style={this.styles.backButtonImg} 
            width={25} height={25} resizeMethod={'resize'} resizeMode={'contain'}/>
          </TouchableOpacity> */}
          <Text style={this.styles.title}>{this.state.campaignsDetails.title}</Text>
           </View>
           <ScrollView>
           <View style={this.styles.box2ImageContainer}>
           <TouchableOpacity
                    style={this.styles.imageContainer}
                    activeOpacity={1}
                    onPress={() => {
                      console.log('image press');
                      this.setState({
                        showFullImageModal: true,
                       });
                    }}>
                        <Image source={Image_Http_URL} style={this.styles.image} width={width - 70} height={160} resizeMode={'contain'}/>
                        </TouchableOpacity>
                    </View>
               {/* <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,marginTop:30}}> */}
                <View>
                  <View  style={{...this.styles.containerV,marginTop:40}}>
            {this.boxView(this.state.campaignsDetails.client_name,'Client Name')}
            {this.boxView(this.state.campaignsDetails.total_circulations,"Total Circulations")}

            </View>
            {/* {this.boxView(this.state.campaignsDetails.title,"Title")} */}
            <Text numberOfLines={1} style={{...this.styles.box1Title,fontSize:11,fontFamily:CustomeFont.Helvetica_Bold,marginBottom:6,marginStart:20}}>Description</Text>

            <View style={{...this.styles.descBoxContainer}}> 

            <Text numberOfLines={1} style={this.styles.box1Title}>{this.state.campaignsDetails.description}</Text>
            <TouchableOpacity onPress={()=>{
                 Alert.alert(
                    "Description",
                    this.state.campaignsDetails.description,
                    [
                      
                      { text: "Ok", onPress: () => {
                       }}
                    ]
                  );
                 
             }}><Text style={{color:Appcolor.appColor}}>read more...</Text></TouchableOpacity>
        </View>
        <View  style={this.styles.containerV}>

            {this.boxView(Moment(this.state.campaignsDetails.start_date).format('MM/DD/YYYY'),"Start Date")}
            {this.boxView(Moment(this.state.campaignsDetails.end_date).format('MM/DD/YYYY') ,"End Date")}
            </View>
            {/* <View  style={this.styles.containerV}>

            {this.boxView(this.state.campaignsDetails.pending_circulations,"Pending Circulations")}

            {this.boxView(this.state.campaignsDetails.delivered_circulations,"Delivered Circulations")}
</View> */}
                </View>
                <View>
                <View  style={this.styles.containerV}>
                   
            {this.boxView(this.state.campaignsDetails.amount,"Amount")}
</View>
                </View>
               {/* </View> */}
           </ScrollView>
           </View>
        )
    }

boxView = (text,title) =>{
    return (
        <View>
        <Text numberOfLines={1} style={{...this.styles.box1Title,fontSize:11,fontFamily:CustomeFont.Helvetica_Bold,marginBottom:6}}>{title}</Text>
        <View style={{...this.styles.box1Container}}> 
            <Text numberOfLines={1} style={this.styles.box1Title}>{text}</Text>
        </View>
        </View>
    )
}


    styles = StyleSheet.create({
        backButton:{
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
           // backgroundColor: 'red',
            marginStart: 10,
        },
        backButtonImg:{
            width: 25, height: 25
        },
        title:{
            fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:18,
          //  textDecorationLine:'underline',
            color:'black',
            flex:1,
            textAlign:'center',
         },
        box1Container:{
            paddingVertical:6,
            width:160,
            justifyContent:'center' ,
            borderWidth:1,
            borderColor:'#D3D3D3',
            marginBottom:15,
            paddingStart:10
            
        },
        descBoxContainer:{
          paddingVertical:6,
           justifyContent:'center' ,
          borderWidth:1,
          borderColor:'#D3D3D3',
          marginBottom:15,
          paddingHorizontal:10,
          marginHorizontal:20
          
      },
        box1Title:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:13,
            color:'black'
        },
        box2ImageContainer:{
            height:120,
            marginHorizontal:35,
            justifyContent:'center' ,
            alignItems:'center',
          //  borderWidth:1,
            borderColor:'black',
            marginTop:20,
            padding: 20,
        },
        image:{
            height:160,
            marginHorizontal:35,
            marginVertical:20
        },
        imageContainer:{
          height:180,
          justifyContent:'center',
          alignContent:'center',
          marginVertical:20,
           paddingVertical:20
        },
        containerV:{
          flexDirection:'row',
          justifyContent:'space-between',marginHorizontal:20,
         }
    })
}
