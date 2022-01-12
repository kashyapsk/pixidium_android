import React, {Component, createRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Clipboard,
  Share,
  Linking,
  Alert,
} from 'react-native';
import MyStatusBar from '../Components/MyStatusBar';
import CommonLoginHeader from '../Components/CommonLoginHeader';
import Appcolor from '../../../Appcolor';
import images from '../../../assets';
import CustomeFont from '../../../CustomeFont';
import {
  saveUserType,
  getUserType,
  getAccessToken,
} from '../../Utilities/LocalStorage';
import NoDataFound from '../Components/NoDataFound';
import Video from 'react-native-video';
import SmartLoader from '../Components/SmartLoader';
import SoundPlayer from 'react-native-sound-player';
import YoutubePlayer from 'react-native-youtube-iframe';
import ShowFullImage from '../Components/ShowFullImage';
 
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class CampaignPreview extends Component {
  playerRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      userType: getUserType(),
      campaignsDetails: {},
      campaignsArray: [],
      animationValue: new Animated.Value(0),
      currentValue: 0,
      isPayV: false,
      player1Muted: true,
      player2Muted: true,
      isPlaying: false,
      intervalId: '',
      endTime: 0,
      showTopMenu: false,
      isCoverImageHidden: true,
      video1: false,
      video2: false,
      normalImg: true,
      isForPromotionalAudio: false,
      interpolate2: '0deg',
      showFullImageModal: false,
      showDescV: false,
      descHeight: 40,
      selectedVideoFile: '',
      type: '0',
      promotional_video: '',
      youtube_video_link: '',
      youtubePlay: false,
      boxHeight:40,
      shareLink_id:''
    };
    console.log(this.props);
  }

  _onFinishedPlayingSubscription = null;
  _onFinishedLoadingSubscription = null;
  _onFinishedLoadingFileSubscription = null;
  _onFinishedLoadingURLSubscription = null;

  componentDidMount() {
    this.state.animationValue.addListener(({newValue}) => {
      this.setState({
        currentValue: newValue,
      });
    });
    this.setState({
      interpolate2: this.state.animationValue.interpolate({
        inputRange: [0, 0],
        outputRange: ['0deg', '0deg'],
      }),
    });

    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        console.log('finished playing', success);
      },
    );
    this._onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      'FinishedLoading',
      ({success}) => {
        console.log('finished loading', success);
      },
    );
    this._onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      ({success, name, type}) => {
        console.log('finished loading file', success, name, type);
      },
    );
    this._onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({success, url}) => {
        console.log('finished loading url', success, url);
        if (success === true) {
          if (
            this.state.isForPromotionalAudio === true
              ? this.setState({
                  isLoading: false,
                })
              : (this.timer = setTimeout(() => {
                  console.log('inside timersff');
                  SoundPlayer.stop();
                  this.clearTimer();
                }, this.state.endTime))
          )
            this.setState({
              isLoading: false,
            });
          // this.setState({intervalId})
        }
      },
    );
    getUserType().then(type => {
      this.setState({
        userType: type,
      });
    });

    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.load();
    });
  }

  clearTimer() {
    // Handle an undefined timer rather than null
    this.timer !== undefined ? clearTimeout(this.timer) : null;
  }

  copyToClipboard = () => {
    Clipboard.setString(this.state.shareLink_id)
    alert("Data copied")
  }


  onShare = async () => {
    try {
      const result = await Share.share({
        message:
        this.state.shareLink_id,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  // Subscribe to event(s) you want when component mounted

  // Remove all the subscriptions when component will unmount
  componentWillUnmount() {
    this._onFinishedPlayingSubscription.remove();
    this._onFinishedLoadingSubscription.remove();
    this._onFinishedLoadingURLSubscription.remove();
    this._onFinishedLoadingFileSubscription.remove();
    this.stop();
  }

  load() {
    if (this.state.accessToken === undefined || this.state.accessToken === '') {
      getAccessToken().then(token => {
        console.log(token);
        this.setState(
          {
            accessToken: token,
          },
          () => {
            if (
              this.state.accessToken !== '' &&
              this.state.accessToken !== undefined
            ) {
              this.setState({
                showLoginBtn: false,
              });
            } else {
              this.setState({
                showLoginBtn: true,
              });
            }
            console.log('yyyyyyyyyy888888 ====  ');
            console.log(token);
          },
        );
      });
    } else if (
      this.state.accessToken !== '' &&
      this.state.accessToken !== undefined
    ) {
      this.setState({
        showLoginBtn: false,
      });
    }

    this.getDetails();
  }


  getSharelink(type) {
    this.setState({
      isLoading: true,
    });
    const formData = new FormData();
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          this.state.userType === 'ambassdor'
            ? 'Bearer ' + this.state.accessToken
            : '',
      },
    };
    console.log(requestOptions);
    console.log(this.props.route.params.id)

    console.log('https://www.pixidium.net/rest/get-share-link/',this.props.route.params.id)
    var url =
      'https://www.pixidium.net/rest/get-share-link/';
    fetch(url + this.props.route.params.id, requestOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            console.log(responseData);
            if (responseData !== undefined && responseData.status === 200) {
              this.setState(
                {
                  shareLink_id: responseData.link,
                },
                () => {
                  console.log('data == ',this.state.shareLink_id);
                  if (type === '1')
                  {
                    this.copyToClipboard()
                  }
                  else if (type === '0')
                  {
                    this.onShare()
                  }
                 },
              );
            }
          },
        );
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
      });
  }


  getDetails() {
    this.setState({
      isLoading: true,
    });
    const formData = new FormData();
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          this.state.userType === 'ambassdor'
            ? 'Bearer ' + this.state.accessToken
            : '',
      },
    };
    console.log(requestOptions);
    var url =
      this.state.userType === 'ambassdor'
        ? 'https://www.pixidium.net/rest/in-progress-preview/?campaign_id='
        : 'https://www.pixidium.net/rest/campaign-preview/?campaign_id=';
    fetch(url + this.props.route.params.camp_id, requestOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            console.log(responseData);
            if (responseData !== undefined && responseData.status === 200) {
              this.setState(
                {
                  campaignsDetails: responseData.data,
                },
                () => {
                  console.log('data == ');
                  console.log(this.state.campaignsDetails.youtube_video_link);
                  this.setProductListArray();
                },
              );
            }
          },
        );
      })
      .catch(error => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
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

        interpolate2: this.state.animationValue.interpolate({
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

  showLoginRequired() {
    Alert.alert('Login Required', '', [
      {
        text: 'Login',
        onPress: () => {
          this.props.navigation.replace('Login');
        },
      },
      {text: 'Cancel', onPress: () => {}},
    ]);
  }

  ListHeader = () => {
    //View to set in Header
    return (
      //   <View style={this.styles.headerFooterStyle}>
      this.rowView(
        '#',
        'Title',
        'Description',
        'Price £',
        1,
        '',
        '',
        0,
        this.state.campaignsDetails.audio_files.length > 0 ? 'Play Demo' : '',
      )
      //   </View>
    );
  };

  playSound(index) {
    try {
      // or play from url
      console.log(this.state.campaignsArray[index].audio_file);
      this.clearTimer();
      SoundPlayer.playUrl(this.state.campaignsArray[index].audio_file);
      SoundPlayer.seek(this.state.campaignsArray[index].start_point);
      this.setState({
        isLoading: true,
        endTime:
          (this.state.campaignsArray[index].end_point -
            this.state.campaignsArray[index].start_point) *
            1000 +
          5000,
      });
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  stop() {
    this.clearTimer();
    SoundPlayer.stop();
  }

  stopTimer = () => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervelId);
    }
  };

  rowView = (indexTitle, title, t3, priceTitle, topBorder, t5, t6, index, t7) => {
    return (
      <TouchableOpacity
      activeOpacity={1}
        style={{
          ...this.styles.rowViewContainer,
          // borderBottomWidth: 1,
          //borderStartWidth: 1,
          //borderStartColor: 'black',
          //borderBottomColor: 'black',
          //borderRightWidth: 1,
          // borderRightColor: 'black',
          //borderTopWidth: topBorder,
          //borderTopColor: 'black',
          backgroundColor: topBorder === 1 ? Appcolor.buttonBGColor : 'white',
        }}>
        <View
          style={{
            ...this.styles.rowTitleContainer,
            width: 30,
            backgroundColor: topBorder === 1 ? Appcolor.appColor : 'white',
          }}>
          <Text
            numberOfLines={1}
            style={{...
              topBorder === 1
                ? this.styles.rowHeaderTitle
                : this.styles.rowTitleText
            }}>
            {indexTitle}
          </Text>
          {/* <View style={this.styles.separatorVertical}></View> */}
        </View>
        <View
          style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
          <View style={{...this.styles.rowTitleContainer, flex: 1}}>
            <Text
              numberOfLines={1}
              style={{...
                topBorder === 1
                  ? this.styles.rowHeaderTitle
                  : this.styles.rowTitleText
              ,paddingHorizontal:10}}>
              {title}
            </Text>
            {/* <View style={this.styles.separatorVertical}></View> */}
          </View>
          <View style={{...this.styles.rowTitleContainer, flex: 1}}>
            <Text
              numberOfLines={1}
              style={{...
                topBorder === 1
                  ? this.styles.rowHeaderTitle
                  : this.styles.rowTitleText
              ,paddingHorizontal:10}}>
              {t3}
            </Text>
            {/* <View style={this.styles.separatorVertical}></View> */}
          </View>
          {t7 === '' ? null : (
            <View
              style={{
                ...this.styles.rowTitleContainer,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                marginStart: 4,
              }}>
              {t7 === 'Play Demo' ? (
                <Text
                  numberOfLines={1}
                  style={
                    topBorder === 1
                      ? this.styles.rowHeaderTitle
                      : this.styles.rowTitleText
                  }>
                  {t7}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.updateAudioFilesData(index);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#4968E2',
                    width: 20,
                    height: 20,
                  }}>
                  <Image
                    style={{width: 10, height: 10, tintColor: 'white'}}
                    width={10}
                    height={10}
                    source={
                      this.state.campaignsArray[index].isSoundPlaying
                        ? images.pause
                        : images.play_button
                    }
                  />
                </TouchableOpacity>
              )}
              {/* <View style={this.styles.separatorVertical}></View> */}
            </View>
          )}
          <View style={{...this.styles.rowTitleContainer, width: 70}}>
            {topBorder === 1 ? (
              <TouchableOpacity activeOpacity={topBorder}>
                <Text
                  style={{
                    ...this.styles.rowHeaderTitle,
                    textDecorationLine: topBorder === 0 ? 'underline' : 'none'
                  }}>
                  {priceTitle}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingEnd: 15,
                }}>
                <Text
                  style={{
                    fontFamily: CustomeFont.Helvetica,
                    fontSize: 12,
                    color: 'black',
                  }}>
                  £{t5}
                </Text>
                {t6 === true ? (
                  <TouchableOpacity
                    onPress={() => {
                      var tmp = this.state.campaignsArray;
                      tmp[index].isSelected = false;
                      this.setState({
                        campaignsArray: tmp,
                      });
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: 'black',
                      width: 15,
                      height: 15,
                      marginStart: 8,
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    <Image
                      source={images.check_mark}
                      width={14}
                      height={14}
                      style={{width: 14, height: 14}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      var tmp = this.state.campaignsArray;
                      tmp[index].isSelected = true;
                      this.setState({
                        campaignsArray: tmp,
                      });
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: 'black',
                      width: 15,
                      height: 15,
                      marginStart: 8,
                    }}></TouchableOpacity>
                )}
              </View>
            )}
            {/* <View style={this.styles.separatorVertical}></View> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  topSideMenu(img1, img2, img3) {
    return (
      <View style={this.styles.topSideV}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              normalImg: true,
              video1: false,
              video2: false,
            });
          }}
          style={{...this.styles.topVImg, marginTop: 4}}>
          <Image
            source={img1}
            style={this.styles.topVImg}
            width={70}
            height={40}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        {this.state.campaignsDetails.promotional_video === undefined ||
        this.state.campaignsDetails.promotional_video === null ? null : (
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  video1: true,
                  normalImg: false,
                  video2: false,
                },
                () => {
                  this.stop();
                },
              );
            }}>
            <Video
              source={{
                uri: img2,
              }}
              style={this.styles.topVImg}
              volume={0}
              paused={true}
              controls={true}
              pictureInPicture={true}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {this.state.campaignsDetails.promotional_video === undefined ||
        this.state.campaignsDetails.promotional_video === null ? null : (
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  video2: true,
                  video1: false,
                  normalImg: false,
                },
                () => {
                  this.stop();
                },
              );
            }}>
            <Video
              source={{
                uri: img3,
              }}
              style={this.styles.topVImg}
              volume={0}
              paused={true}
              controls={true}
              pictureInPicture={true}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  openLinkPage = link => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
      }
    });
  };

  setProductListArray() {
    var tmpArray = [];
    if (this.state.campaignsDetails.audio_files.length > 0) {
      for (
        let index = 0;
        index < this.state.campaignsDetails.audio_files.length;
        index++
      ) {
        const element = this.state.campaignsDetails.audio_files[index];
        tmpArray[index] = {
          id: element.id,
          title: element.title,
          desc: element.description,
          price: element.price,
          isSelected: false,
          isSoundPlaying: false,
          audio_file: element.audio_file,
          start_point: element.start_point,
          end_point: element.end_point,
        };
      }
    } else if (this.state.campaignsDetails.products.length > 0) {
      for (
        let index = 0;
        index < this.state.campaignsDetails.products.length;
        index++
      ) {
        const element = this.state.campaignsDetails.products[index];
        tmpArray[index] = {
          id: index + 1,
          title: element.Title,
          desc: element.Description,
          price: element.Price,
          isSelected: false,
          isSoundPlaying: false,
        };
      }
    }
    this.setState({
      campaignsArray: tmpArray,
    },()=>{
      if (this.state.userType === 'ambassdor')
      {
        this.getSharelink()
      }
    });
  }

  updateAudioFilesData(index1) {
    var tmp = this.state.campaignsArray;
    tmp.map((item, index) => {
      if (index === index1) {
        item.isSoundPlaying = !item.isSoundPlaying;
      } else {
        item.isSoundPlaying = false;
      }
      return item;
    });

    this.setState(
      {
        campaignsArray: tmp,
      },
      () => {
        if (this.state.campaignsArray[index1].isSoundPlaying) {
          this.playSound(index1);
        } else {
          this.stop();
        }
      },
    );
  }

  playPromotionalSound() {
    try {
      // or play from url
      console.log(this.state.campaignsDetails.promotional_audio);
      this.clearTimer();
      SoundPlayer.playUrl(this.state.campaignsDetails.promotional_audio);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  }

  checkProductSelected() {
    var tmp = [];
    var count = 0;
    for (let index = 0; index < this.state.campaignsArray.length; index++) {
      const element = this.state.campaignsArray[index];
      if (element.isSelected) {
        tmp[count] = element;
        count += 1;
      }
    }
    return tmp;
  }

  render() {
    let Image_Http_URL = {
      uri: this.state.isCoverImageHidden
        ? this.state.campaignsDetails.cover_image
        : this.state.campaignsDetails.back_cover_image,
    };
    let userImage = {
      uri:
        (this.state.campaignsDetails.user_image !== undefined &&
          this.state.campaignsDetails.user_image.length) > 0
          ? this.state.campaignsDetails.user_image
          : 'kkk',
    };
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <MyStatusBar
          backgroundColor={Appcolor.appColor}
          barStyle="light-content"
        />
        <SmartLoader isLoading={this.state.isLoading} />
        <ShowFullImage
          callback={() => {
            this.setState({
              showFullImageModal: false,
            });
          }}
          selectedYoutubeFile={this.state.youtube_video_link}
          selectedVideoFile={this.state.promotional_video}
          type={this.state.type}
          isLoading={this.state.showFullImageModal}
          image1={Image_Http_URL}
          image2 ={{uri:this.state.campaignsDetails.back_cover_image}}
          showRotateBtn = {(this.state.campaignsDetails.back_cover_image === undefined || this.state.campaignsDetails.back_cover_image === null) ? false : true}
        />
        <CommonLoginHeader
          isBackBtn={true}
          pop={() => {
            this.props.navigation.pop();
          }}
          openProfile={() => {
            this.props.navigation.navigate('Account');
          }}
          isProfileBtn={!this.state.showLoginBtn}
          isLoginBtn={this.state.showLoginBtn}
          pageTitle={'PIXIDIUM'}
          onPress={() => {
            this.props.navigation.replace('Login');
          }}
        />
        <TouchableOpacity
        activeOpacity={1}
          style={{flex: 1}}
          activeOpacity={1}
          onPress={() => {
            console.log('outside');
            this.setState({
              showTopMenu: false,
            });
          }}>
          <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginHorizontal: 15,
                marginVertical: 10,
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: Appcolor.border_color_gray,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: 21.5,
                    borderColor: 'white',
                    borderWidth: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={userImage}
                    resizeMode={'cover'}
                    width={40}
                    height={40}
                    style={{width: 40, height: 40,borderRadius:20}}
                  />
                </View>
              </View>
              <View >
              <View
                style={{
                  padding: 5,
                  width: Dimensions.get('window').width - 100,
                  borderWidth: 1,
                  borderColor: Appcolor.border_color_gray,
                 marginStart:10,
                  borderRadius: 8,
                  height:this.state.boxHeight,
                  marginTop:4,
                 // backgroundColor:'red'
                }}>
                <View
                  style={{
                    height: 30,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingBottom:6
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: CustomeFont.Helvetica,
                      fontSize: 15,
                       marginEnd: 15,
                      marginStart:4,
                       height:24,
                       color:'black'
                    }}>
                    {this.state.campaignsDetails.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.descHeight === 40) {
                        this.setState({
                          descHeight: 200,
                          boxHeight: this.state.campaignsDetails.facebook_link !== undefined &&
                          this.state.campaignsDetails.facebook_link.length > 0 ? 300 : 140
                        });
                      } else {
                        this.setState({
                          descHeight: 40,
                          boxHeight:40
                        });
                      }
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      paddingBottom:4,
                       justifyContent: 'center',
                      alignContent: 'center',
                      // backgroundColor:'red',
                    }}>
                    <Image
                      source={images.more}
                      style={{width: 20, height: 20,marginStart:4}}
                    />
                  </TouchableOpacity>
                </View>
                {this.state.descHeight == 40 ? null : (
                  <>
                    {this.state.campaignsDetails.location_str.length > 0 ? (
                      <View style={{flexDirection: 'row', marginTop: 8}}>
                        <Image
                          source={images.map}
                          style={{width: 14, height: 14}}
                        />
                        <Text
                          numberOfLines={1}
                          style={{fontSize: 14, marginStart: 4, marginEnd: 15,color:'black'}}>
                          {this.state.campaignsDetails.location_str}
                        </Text>
                      </View>
                    ) : null}

                    <View style={{flexDirection: 'row', marginTop: 8}}>
                      <Image
                        source={images.phone_call}
                        style={{width: 14, height: 14}}
                      />
                      <Text style={{fontSize: 14, marginStart: 4,color:'black'}}>
                        {this.state.campaignsDetails.phone}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginBottom: 8,
                        marginTop: 8,
                        flexDirection: 'row',
                        marginEnd: 10,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 14,
                          marginStart: 4,
                          width: width - 200,
                          color:'black'
                        }}>
                        {this.state.campaignsDetails.description}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Description',
                            this.state.campaignsDetails.description,
                            [{text: 'Ok', onPress: () => {}}],
                          );
                        }}>
                        <Text style={{color: Appcolor.appColor, fontSize: 14}}>
                          read more...
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {this.state.campaignsDetails.facebook_link !== undefined &&
                    this.state.campaignsDetails.facebook_link.length > 0 ? (
                      <Text style={{marginBottom: 8,color:'black'}}>
                        Facebook {'\n'}
                        <TouchableOpacity
                          onPress={() => {
                            this.openLinkPage(
                              this.state.campaignsDetails.facebook_link,
                            );
                          }}
                          style={{justifyContent: 'center'}}>
                          <Text style={{color: 'blue', paddingTop: 3}}>
                            {this.state.campaignsDetails.facebook_link}
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    ) : null}
                    {this.state.campaignsDetails.twitter_link !== undefined &&
                    this.state.campaignsDetails.twitter_link.length > 0 ? (
                      <Text style={{marginBottom: 8,color:'black'}}>
                        Twitter {'\n'}
                        <TouchableOpacity
                          onPress={() => {
                            this.openLinkPage(
                              this.state.campaignsDetails.twitter_link,
                            );
                          }}
                          style={{justifyContent: 'center'}}>
                          <Text style={{color: 'blue', paddingTop: -3}}>
                            {this.state.campaignsDetails.twitter_link}
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    ) : null}
                    {this.state.campaignsDetails.instagram_link !== undefined &&
                    this.state.campaignsDetails.instagram_link.length > 0 ? (
                      <Text style={{marginBottom: 8,color:'black'}}>
                        Instagram {'\n'}
                        <TouchableOpacity
                          onPress={() => {
                            this.openLinkPage(
                              this.state.campaignsDetails.instagram_link,
                            );
                          }}
                          style={{justifyContent: 'center'}}>
                          <Text style={{color: 'blue', paddingTop: 3}}>
                            {this.state.campaignsDetails.instagram_link}
                          </Text>
                        </TouchableOpacity>
                      </Text>
                    ) : null}
                  </>
                )}
              </View>
          
           </View>
            </TouchableOpacity>

            <View>
              
              <View style={this.styles.imageContainer}>
                 <Animated.View
                  style={{
                    ...this.styles.imageContainer,
                    transform: [{rotateY: this.state.interpolate2}],
                  }}>
                   <TouchableOpacity
                    style={this.props.imageV}
                    activeOpacity={1}
                    onPress={() => {
                      console.log('image press');
                      this.setState({
                        showFullImageModal: true,
                        type: '0',
                      });
                    }}>
                    <Image
                      source={Image_Http_URL}
                      resizeMode={'cover'}
                      style={this.props.imageV}
                      width={width - 30}
                      height={width * 0.9}
                    />
                  </TouchableOpacity>
                </Animated.View>
               
                {this.props.route.params.isFromInProgress === true ? null : this
                    .state.campaignsArray.length > 0 ? (
                  <View style={[this.styles.imageContainer]}>
                    {this.state.isPayV ? (
                      <View>
                        {this.ListHeader()}

                        {this.state.campaignsArray.length > 0 ? (
                          this.state.campaignsArray.map((item, index) => {
                            return this.rowView(
                              item.id,
                              item.title,
                              item.desc,
                              '',
                              0,
                              item.price,
                              item.isSelected,
                              index,
                              this.state.campaignsDetails.audio_files.length > 0
                                ? 'll'
                                : '',
                            );
                          })
                        ) : (
                          <Text
                            style={{
                              marginTop: 50,
                              textAlign: 'center',
                              flex: 1,
                              color:'black'
                            }}>
                            No Data Found
                          </Text>
                        )}
                      </View>
                    ) : null}
                    <View style={this.styles.button1}>
                      {!this.state.isPayV ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.stop();
                            this.setState({
                              isPayV: true,
                            });
                          }}>
                          <Text style={this.styles.buttontitle}>OPEN</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              this.stop();
                              this.setState({
                                isPayV: false,
                              });
                            }}>
                            <Text style={this.styles.buttontitle}>CLOSE</Text>
                          </TouchableOpacity>
                          <Text style={{width:50,textAlign:'center'}}>/</Text>
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.showLoginBtn) {
                                this.showLoginRequired();
                              } else {
                                var selectedItems = this.checkProductSelected();
                                if (selectedItems.length > 0) {
                                  this.props.navigation.navigate(
                                    'AddUserAddress',
                                    {
                                      selectedItems: selectedItems,
                                      campaign_id:
                                        this.props.route.params.camp_id,
                                    },
                                  );
                                } else {
                                  alert('Please select at-least one product');
                                }
                              }
                            }}>
                            <Text style={this.styles.buttontitle}>PAY</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 15}}>
              {this.state.campaignsDetails.promotional_video === undefined ||
              this.state.campaignsDetails.promotional_video === null ? (
                <Text></Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.isForPromotionalAudio) {
                      SoundPlayer.stop();
                    } else {
                      SoundPlayer.stop();
                    }
                    this.setState({
                      isForPromotionalAudio:false,
                      showFullImageModal: true,
                      promotional_video:
                        this.state.campaignsDetails.promotional_video,
                      type: '1',
                      youtubePlay: false,
                    });
                  }}
                  style={this.styles.videov1}>
                   <Image
                    source={{
                      uri: this.state.campaignsDetails.promotional_video_thumbnail,
                    }}
                    style={{
                      resizeMode:'cover' ,
                        height: 140,
                        width: (width - 60) / 2,
                         
                      }}
                      height={120}
                      width={(width - 60) / 2}
                    resizeMode="contain"
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
                      top: 45,
                      right: (width - 60) / 2 / 2 - 15,
                    }}
                    resizeMode={'contain'}
                    width={30}
                    height={30}
                  />
                </TouchableOpacity>
              )}
              {this.state.campaignsDetails.youtube_video_link === undefined ||
              this.state.campaignsDetails.youtube_video_link === null ||
              this.state.campaignsDetails.youtube_video_link === '' ? (
                <Text></Text>
              ) : (
                <View
                  
                  style={{...this.styles.videov1}}>
                  
                  <Image
                    source={{
                      uri:this.state.campaignsDetails.youtube_video_link_thumbnail}}
                   height={120}
                   width={(width - 60) / 2}
                   
                    style={{
                    resizeMode:'cover' ,
                      height: 120,
                      width: (width - 60) / 2,
                    }}
                  />
                    <TouchableOpacity
                  onPress={() => {
                    if (this.state.isForPromotionalAudio) {
                      SoundPlayer.stop();
                    } else {
                      SoundPlayer.stop();
                    }
                    this.setState({
                      showFullImageModal: true,
                      youtube_video_link:
                        this.state.campaignsDetails.youtube_video_link.substring(
                          this.state.campaignsDetails.youtube_video_link.lastIndexOf(
                            '/',
                          ) + 1,
                          this.state.campaignsDetails.youtube_video_link.length,
                        ),
                      type: '2',
                      youtubePlay: false,
                    });
                  }} style={{position:'absolute',backgroundColor:'rgba(0,0,0,0)',...this.styles.videov1}}></TouchableOpacity>
                 
                </View>
              )}
              {/* } */}
            </View>
       {this.state.campaignsDetails.promotional_audio === undefined || this.state.campaignsDetails.promotional_audio === null ? null : 
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
                marginBottom: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    this.state.campaignsDetails.promotional_audio !==
                      undefined &&
                    this.state.campaignsDetails.promotional_audio !== null
                  ) {
                    this.setState(
                      {
                        isLoading: true,
                        youtubePlay: false,
                        isForPromotionalAudio:
                          !this.state.isForPromotionalAudio,
                      },
                      () => {
                        if (this.state.isForPromotionalAudio) {
                          this.playPromotionalSound();
                        } else {
                          this.setState({
                            isLoading: false,
                          });
                          SoundPlayer.stop();
                        }
                      },
                    );
                  } else {
                    this.setState({
                      youtubePlay: false,
                    });
                  }
                }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  borderWidth: 1,
                  borderColor: 'gray',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={images.megaphone}
                  style={{
                    width: 22,
                    height: 22,
                    tintColor: this.state.isForPromotionalAudio
                      ? 'black'
                      : 'gray',
                  }}
                />
              </TouchableOpacity>
              
            </View>}
            {this.props.route.params.isFromInProgress === true ? (
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontFamily: CustomeFont.Helvetica,
                    color: 'black',
                    textAlign: 'center',
                    fontSize: 16,
                    marginTop: 5,
                    marginBottom: 10,
                  }}>
                  Share
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={this.styles.socialButton}
                    onPress={() => {
                      this.openLinkPage('https://www.facebook.com/');
                    }}>
                    <Image
                      source={images.facebook}
                      style={this.styles.socialImage}
                      width={15}
                      height={15}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={this.styles.socialButton}
                    onPress={() => {
                      this.openLinkPage('https://twitter.com/?lang=en');
                    }}>
                    <Image
                      source={images.twitter}
                      style={this.styles.socialImage}
                      width={15}
                      height={15}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={this.styles.socialButton}
                    onPress={() => {
                      this.openLinkPage(
                        'https://www.instagram.com/accounts/login/?hl=en',
                      );
                    }}>
                    <Image
                      source={images.instagram}
                      style={this.styles.socialImage}
                      width={15}
                      height={15}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={this.styles.socialButton}
                    onPress={() => {
                      if (this.state.shareLink_id === '')
                      {
                        this.getSharelink('0')
                      }
                      else
                      {
                        this.onShare()
                      }
                    }}>
                    <Image
                      source={images.share}
                      style={this.styles.socialImage}
                      width={15}
                      height={15}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={this.styles.socialButton}
                    onPress={() => {
                      if (this.state.shareLink_id === '')
                      {
                        this.getSharelink('1')
                      }
                      else
                      {
                      this.copyToClipboard()
                      }
                    }}>
                    <Image
                      source={images.clip_board}
                      style={this.styles.socialImage}
                      width={15}
                      height={15}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </TouchableOpacity>
        {this.state.showTopMenu === true
          ? this.topSideMenu(
              Image_Http_URL,
              this.state.campaignsDetails.promotional_video,
              this.state.campaignsDetails.promotional_video,
            )
          : null}
      </View>
    );
  }

  styles = StyleSheet.create({
    imageContainer: {
      marginHorizontal: 10,
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8,
    },
    imageV: {
      width: width - 30,
      height: width * 0.9,
    },
    videov1: {
      justifyContent: 'center',
      alignItems: 'center',
      width: (width - 60) / 2,
      height: 120,
      shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8,
      // backgroundColor:'red',
      marginTop: 20,
      marginHorizontal: 15,
    },
    videoV: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width - 30,
      height: 240,
      shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8,
      //backgroundColor:'red',
      marginTop: 20,
      marginHorizontal: 15,
    },
    videoImage: {
      width: (width - 60) / 2,
      height: 120,
    },
    sideV: {
      position: 'absolute',
      left: 5,
      top: (width * 0.9) / 2 - 50,
      width: 30,
      height: 100,
      backgroundColor: 'gray',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sideVText: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 12,
      color: 'white',
      width: 10,
    },
    rowViewContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 40,
      // alignItems:'center'
    },
    rowHeaderTitle: {
      fontFamily: CustomeFont.Helvetica_Bold,
      fontSize: 14,
      color: 'white',
      textAlign: 'center',
      // backgroundColor:'red'
    },
    rowTitleText: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 12,
      color: 'gray',
      textAlign: 'center',
    },
    separatorVertical: {
      height: 48,
      width: 1,
      backgroundColor: 'black',
      marginHorizontal: 7,
    },
    rowTitleContainer: {
      height: 40,
      justifyContent: 'center',
      // backgroundColor:'red',
      alignContent: 'center',
    },
    button: {
      height: 30,
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      width: width - 90,
      borderRadius: 4,
    },
    button1: {
      height: 30,
      backgroundColor: '#F8F8F8',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      width: width - 90,
      borderRadius: 4,
      flexDirection: 'row',
    },
    buttontitle: {
      fontFamily: CustomeFont.Helvetica,
      fontSize: 13,
      color: Appcolor.appColor,
      letterSpacing: 1,
    },
    socialButton: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Appcolor.appColor,
      marginEnd: 3,
    },
    socialImage: {
      width: 15,
      height: 15,
      tintColor: 'white',
    },
    topSideV: {
      position: 'absolute',
      right: 0,
      top: Platform.OS === 'ios' ? 100 : 86,
      width: 100,
      height: 134,
      backgroundColor: 'white',
      shadowColor: 'gray',
      shadowOffset: {x: 0, y: 2},
      shadowRadius: 3,
      shadowOpacity: 0.8,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
    },
    topVImg: {
      width: 70,
      height: 40,
      marginBottom: 4,
      borderWidth: 0.5,
      borderColor: 'gray',
    },
  });
}
