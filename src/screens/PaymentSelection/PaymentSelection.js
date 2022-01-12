import React, { Component } from 'react'
import { Text, View,Dimensions,StyleSheet,ScrollView,TouchableOpacity,Alert } from 'react-native'
import MyStatusBar from '../Components/MyStatusBar'
import CommonLoginHeader from '../Components/CommonLoginHeader'
import Appcolor from '../../../Appcolor'
import images from '../../../assets'
import CustomeFont from '../../../CustomeFont'
import { TextInput } from 'react-native-gesture-handler'
import {getAccessToken} from '../../Utilities/LocalStorage'
 import SmartLoader from '../Components/SmartLoader'
import StripeV from '../../StripeV/StripeV'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class PaymentSelection extends Component {
   
constructor(props)
{
    super(props)
    this.state={
        accessToken:'',
        isLoading:false,
       showLoginBtn:true,
        orderObject:this.props.route.params.orderObject,
        price : 0,
        stripeToken:'',
        btnLoading:false,
        showPaymentModel:false
    }
}

componentDidMount()
{
    this.calculatePrice()
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
}

      
      ListHeader = () => {
        //View to set in Header
        return (
        //   <View style={this.styles.headerFooterStyle}>
            this.rowView("#","Title","Description","Price £",1)
        //   </View>
        );
      };
    
      rowView = (t1,t2,t3,t4,topBorder,t5) =>{
          return (
              <View style={{...this.styles.rowViewContainer,borderBottomWidth:1, borderStartWidth:1,
                borderStartColor:'black',borderBottomColor:'black', borderRightWidth:1,
                borderRightColor:'black', borderTopWidth: topBorder,borderTopColor:'black',backgroundColor: topBorder === 1 ? Appcolor.appColor : 'white'}}>
                   <View style={{...this.styles.rowTitleContainer,width:40}}>
                  <Text style={topBorder === 1 ? this.styles.rowHeaderTitle : this.styles.rowTitleText}>{t1}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{flexDirection:'row',flex:1}}>
                  <View style={{...this.styles.rowTitleContainer, flex:1/3}}>
                  <Text style={topBorder === 1 ? this.styles.rowHeaderTitle : this.styles.rowTitleText}>{t2}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{...this.styles.rowTitleContainer, flex:1}}>
                  <Text style={topBorder === 1 ? this.styles.rowHeaderTitle : this.styles.rowTitleText}>{t3}</Text>
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  <View style={{...this.styles.rowTitleContainer, flex:1/3}}>
                      {topBorder === 1 ? 
                      <TouchableOpacity activeOpacity={topBorder}>
                  <Text style={{...this.styles.rowHeaderTitle,textAlign:'left',textDecorationLine: topBorder === 0 ? 'underline' : 'none'}}>{t4}</Text>
                  </TouchableOpacity>
                  : 
                        
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginEnd:5}}>
                      <Text style={{fontFamily:CustomeFont.Helvetica,fontSize:12,color:'black'}}>£{t5}</Text>
                      {/* <TouchableOpacity style={{borderWidth:1,borderColor:'black',width:15,height:15,marginStart:8}}>

                      </TouchableOpacity> */}
                  </View>
                  }
                  {/* <View style={this.styles.separatorVertical}></View> */}
                  </View>
                  </View>
              </View>
          )
      }


      calculatePrice(){
          var price1 = 0
          for (let index = 0; index < this.state.orderObject.selectedItems.length; index++) {
              const element = this.state.orderObject.selectedItems[index];
              price1 += element.price
          }
          this.setState({
              price:price1
          })
      }

      paymentAPI(){
        console.log(this.state.orderObject)
        console.log(this.state.stripeToken)
             var itemsId = []
             const formData = new FormData();

            for (let index = 0; index < this.state.orderObject.selectedItems.length; index++) {
                const element = this.state.orderObject.selectedItems[index];
                itemsId[index] = element.id
                

             }

             formData.append('campaign_id', this.state.orderObject.campaign_id);
             formData.append('product_ids[]', itemsId);
             formData.append('plan_price', this.state.price);
             formData.append('name', this.state.orderObject.name);
             formData.append('address', this.state.orderObject.billing_address);
             formData.append('phone', this.state.orderObject.phone);
             formData.append('email', this.state.orderObject.email);
             formData.append('billing_address', this.state.orderObject.billing_address);
             formData.append('delivery_address', this.state.orderObject.delivery_address);
             formData.append('paymentMethodId', this.state.stripeToken);
             formData.append('type', "csv");
             var data = {
                "campaign_id": this.state.orderObject.campaign_id,
                "product_ids": itemsId,
                "plan_price":this.state.price,
                "name":this.state.orderObject.name,
                "address":this.state.orderObject.billing_address,
                "phone":this.state.orderObject.phone,
                "email":this.state.orderObject.email,
                "billing_address":this.state.orderObject.billing_address,
                "delivery_address":this.state.orderObject.delivery_address,
                "paymentMethodId":this.state.stripeToken,
                "type":"csv"
             }

             this.submitPayment(data)
      }

        submitPayment(params){
            
                  this.setState({
                   isLoading: true,
                 });
                
                 const requestOptions = {
                   method: 'POST',
                   headers: { 'Accept': 'application/json', 'Content-Type': 'application/json',"Authorization": this.state.accessToken === undefined ? "" : "Bearer " + this.state.accessToken
                },                   body: JSON.stringify(params),
                 };
                 console.log(requestOptions);
                 fetch('https://www.pixidium.net/rest/campaigns-payment/', requestOptions)
                   .then(response => {
                     return response.json();
                   })
                   .then(data => {
                       console.log('kkkk ')
                     console.log(data); //REF 1;
                     this.setState({
                       isLoading: false,
                     });
                     if (data !== undefined && data.status === 200) {
                         Alert.alert(
                             data.success,
                             "",
                             [
                               
                               { text: "Ok", onPress: () => {
                                this.props.navigation.navigate('Home')                               }}
                             ]
                           );
                          
                          
                     }
                     else if (data.non_field_errors !== undefined)
                     {
                         alert(data.non_field_errors[0].message)
                     }
                     else if (data.message !== undefined)
                     {
                         alert(data.message)
                     }
                     else if (data.error !== undefined)
                     {
                         alert(data.error)  
                     }
                   })
                   .catch(err => {
                     console.log('ERROR: ' + err);
                     this.setState({
                       isLoading: false,
                     });
                   });
                 
               

        }


    render() {
        return (
            <View style={{backgroundColor:'white', flex:1}}>
            <MyStatusBar backgroundColor={Appcolor.appColor} barStyle="light-content" />
            <SmartLoader isLoading={this.state.isLoading}/>
            <StripeV isLoading={this.state.showPaymentModel} instance = {this} dismissPop={()=>{
                this.setState({showPaymentModel:false})
               
            }} 
            paymentDoneCallBack={()=>{
                this.setState({showPaymentModel:false,isLoading:true},()=>{
                    this.paymentAPI() 
                })

                   
            }}
            />
            <CommonLoginHeader isBackBtn={true} pop={()=>{this.props.navigation.pop()}} openProfile={()=>{
                  this.props.navigation.navigate('Account')
                }} isProfileBtn={true} pageTitle={"PIXIDIUM"} onPress={()=>{
    this.props.navigation.replace('Login')
}}/>
<ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:'white',width:"97%",
                paddingBottom:6,marginTop:15,height:height - 330}}
                nestedScrollEnabled={true}>
            {this.ListHeader()}
            {this.state.orderObject.selectedItems.map((item,index)=>{
                return this.rowView(index+1,item.title,item.desc,'',0,item.price)
            })}
            
            </ScrollView>
            <Text style={{marginVertical:10,color:'black',textAlign:'right', marginHorizontal:20}}>Total Price: £{this.state.price}</Text>
            <TouchableOpacity 
            onPress={() =>{
               // this.paymentAPI() 
                this.setState({showPaymentModel:true})
                // this.props.navigation.navigate('Home')
            }}
            style={this.styles.button}>
            <Text style={this.styles.buttontitle}>SUBMIT</Text>
          </TouchableOpacity>
            </View>
        )
    }

    styles = StyleSheet.create({
        rowViewContainer:{
            flexDirection:'row',
           //  width:'96%',
            height:40,
            marginStart:10
           // marginHorizontal:10
           // alignItems:'center'
        },
        rowHeaderTitle:{
            fontFamily:CustomeFont.Helvetica_Bold,
            fontSize:14,
            color:'white',
            textAlign:'center'
           // backgroundColor:'red'
        },
        rowTitleText:{
            fontFamily:CustomeFont.Helvetica,
            fontSize:12,
            color:'gray',
            textAlign:'center'
        }
        ,
        separatorVertical:{
            height:48,
            width:1,
            backgroundColor:'black',
            marginHorizontal:7 
        },
        rowTitleContainer:{
            height:40,
            justifyContent:'center',
           // backgroundColor:'red',
            alignContent:'center',
           
         },
         button: {
             height: 44,
            backgroundColor: Appcolor.buttonBGColor,
            justifyContent: 'center',
            alignItems: 'center',
             marginTop:10,
             marginHorizontal: 20,
             marginBottom:20,
             borderRadius:4
          },
          buttontitle: {
            fontFamily: CustomeFont.Helvetica,
            fontSize: 17,
            color: Appcolor.white,
            letterSpacing: 1,
          },
    })
}
