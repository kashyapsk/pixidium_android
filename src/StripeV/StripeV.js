import {CardField, useStripe} from '@stripe/stripe-react-native';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import {CardForm, createPaymentMethod} from '@stripe/stripe-react-native';

export default class StripeV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
    };
  }

  handleCardPayPress = async () => {
    try {
      this.props.instance.setState({isLoading: true});

      const {paymentMethod, error} = await createPaymentMethod({
        type: 'Card',
      });
      this.props.instance.setState({isLoading: false});
      console.log('stripe response = ' + JSON.stringify(paymentMethod));
      console.log('errrr =' + JSON.stringify(error));
      if (paymentMethod !== undefined)
      {
         this.props.instance.setState({
            stripeToken:paymentMethod.id
        },()=>{
            this.props.paymentDoneCallBack()
        })
      }
      else
      {
          alert('Error during payment process')
      }
      
    } catch (error) {
      console.log(error);
      this.props.instance.setState({isLoading: false});
    }
  };

  render() {
    return (
      <Modal
        transparent={false}
        animationType={'slide'}
        visible={this.props.isLoading}
        onRequestClose={() => {
          console.log('Noop');
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              marginHorizontal: 20,
              
            }}>
            <TouchableOpacity
              disabled={!this.state.isValid}
              style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.handleCardPayPress();
              }}>
              <Text
                style={{color: this.state.isValid === true ? 'blue' : 'black'}}>
                Done
              </Text>
            </TouchableOpacity>
            <Text style={{flex: 1}}></Text>
            <TouchableOpacity
               style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.dismissPop()
              }}>
              <Text
                style={{color: 'blue'}}>
                Cancel
              </Text>
            </TouchableOpacity>
            </View>
            <CardForm
              onFormComplete={cardDetails => {
                console.log('cardDetails', cardDetails);
                if (cardDetails.complete && cardDetails.postalCode) {
                  console.log('complete');
                 this.setState({isValid:true})
                } else {
                    this.setState({isValid:false})
                }
 
              }}
              style={{flex: 1}}
            />
          </View>
        
      </Modal>
    );
  }
}
