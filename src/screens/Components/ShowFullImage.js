
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from 'react-native';
import images from '../../../assets'
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe';
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  imageStyle: {
     
    height:Dimensions.get('window').height - 240,
    width:Dimensions.get('window').width - 70,
    },
});


export default class ShowFullImage extends Component {

  constructor(props)
  {
    super(props)
    this.state ={
      showData:false,
      player1Muted: false,
      animationValue: new Animated.Value(0),
      currentValue: 0,
      isCoverImageHidden: true,
      image1:this.props.image1,
      image2:this.props.image2,
      interpolate1: '0deg',

    }
    
  }
 

  componentDidMount(){
    this.setState({
      isCoverImageHidden: true,
     // currentValue:0,
      animationValue: new Animated.Value(0)
    })
    this.state.animationValue.addListener(({newValue}) => {
      this.setState({
        currentValue: newValue,
      });
    });
    this.setState({
      interpolate1: this.state.animationValue.interpolate({
        inputRange: [0, 0],
        outputRange: ['0deg', '0deg'],
      }),
    });
  }

  flipAnimation() {
    if (this.state.currentValue >= 90) {
      console.log('current value2 = ' + this.state.currentValue);
      Animated.spring(this.state.animationValue, {
        toValue: 0,
        useNativeDriver: true,
        tension: 10,
        friction: 10,
      }).start();
    } else {
      console.log('current value1 = ' + this.state.currentValue);

      this.setState({
        animationValue: new Animated.Value(0),
        interpolate1: this.state.animationValue.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      });

      Animated.spring(this.state.animationValue, {
        toValue: 180,
        useNativeDriver: true,
        tension: 10,
        friction: 10,
      }).start();
    }
  }
 

  render() {
  const {
    isLoading,image1,image2,type,selectedVideoFile,selectedYoutubeFile,showRotateBtn,
    ...attributes
  } = this.props;
 console.log(type)
var imageURL = this.state.isCoverImageHidden ? image1 : image2
console.log(imageURL)
  return (
    
    <Modal
      transparent
      animationType={'slide'}
      visible={isLoading}
      onRequestClose={() => { console.log('Noop'); }}
    >
       <TouchableOpacity activeOpacity={1} onPress={()=>{
         this.props.callback()
         this.setState({
           showData:false
         })
       }} style={styles.modalBackground}>
          <View style={{marginHorizontal:30,marginVertical:40,borderRadius:10}}>
            <View style={{alignItems:'flex-end'}}>
       {showRotateBtn === false ? null : type === '0' ?
            <TouchableOpacity
            style={{width:50,height:50,justifyContent:'center',
            alignItems:'center'}}
                  onPress={() => {
                    this.setState(
                      {
                        isCoverImageHidden: !this.state.isCoverImageHidden,
                      },
                      () => {
                        this.flipAnimation();
                      },
                    );
                  }}>
                  <Image
                    source={images.flip}
                    style={{width: 40, height: 40, marginHorizontal: 45,tintColor:'white'}}
                  />
                </TouchableOpacity> : null
                }
            {/* <TouchableOpacity style={{width:50,height:50,justifyContent:'center',
            alignItems:'center',backgroundColor:'black',borderRadius:25}}
             onPress={()=>{
             
                  this.props.callback()
                  this.setState({
                    showData:false
                  })
                  console.log('jjjj')
            }}>
                <Image  source={images.close} 
                style={{tintColor:'white',width:20,height:20}}
                 width={20} height={20}/>
            </TouchableOpacity> */}
            </View>
            {type === '0' ?
            // <TouchableOpacity activeOpacity={1}>
            <Animated.View
            style={{
              
              transform: [{rotateY: this.state.interpolate1}],
            }}><Image height={Dimensions.get('window').height - 240} 
        width={Dimensions.get('window').width - 70} 
         resizeMode={'contain'} style={styles.imageStyle} source={imageURL}/>
         </Animated.View>
        //  </TouchableOpacity>
         : type === '1' ? 
         <TouchableOpacity activeOpacity={1} onPress={()=>{
           this.setState({
            player1Muted:!this.state.player1Muted
           })
         }}>
          <Video
         source={{
           uri: selectedVideoFile,
         }}
         style={{width: (width - 60), height: 200}}
         volume={100}
         transparent={true}
        //  ref={ref => {
        //    this.player2 = ref;
        //  }}
        onVideoProgress={(data)=>{
          console.log(data)
        }}
        paused={this.state.player1Muted}
           controls={true}
         pictureInPicture={true}
         resizeMode="cover"
       />  
       
       <Image
                    source={images.play}
                    style={{
                      shadowColor: 'gray',
                      shadowOffset: {x: 0, y: 2},
                      shadowRadius: 3,
                      shadowOpacity: 0.8,
                      width: 30,
                      tintColor: 'white',
                      height: 30,
                      position: 'absolute',
                      top: 90,
                      right: (width - 60) / 2 - 15,
                    }}
                    resizeMode={'contain'}
                    width={30}
                    height={30}
                  />
       </TouchableOpacity>
        
         : 
         <TouchableOpacity activeOpacity={1}>
         <YoutubePlayer
         height={240}
         width={width - 60}
         play={true}
         videoId={'PIrWquI_mQ0'}
         onChangeState={even => {
           console.log(
             'current state of youyube player = ' + even,
           );
         }}
       /></TouchableOpacity>
         }
         </View>
      </TouchableOpacity>
     </Modal>
  );
        }
};

 