<<<<<<< HEAD
import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/login';
import MainPage from './src/main';
 
 const Stack = createStackNavigator();
 
 class App extends Component {
   render() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name='Login' component={LoginPage}/>
           <Stack.Screen name='Main' component={MainPage}/>
         </Stack.Navigator>
       </NavigationContainer>
     )
   }
 }
 
 const styles = StyleSheet.create({
   background: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center'
   }
 });
 
 export default App;
=======
import React, {Component, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ImageBackground,
  Alert,
  Dimensions,
  Platform,
  DrawerLayoutAndroidBase,
  TouchableOpacity,
  TouchableOpacityBase,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import { computeDestinationPoint, getDistance, getPreciseDistance } from 'geolib';
import haversine from "haversine";
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {};
let driveState = "주행 시작"
let driveFlag = false;

// const LATITUDE = 29.95539;
// const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      color : "green",
      textPoint: "",
      textDistance: "",
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      drivePoint: 0,
    };
  }

  componentDidMount() {
    const { coordinate } = this.state;

    this.watchID = Geolocation.watchPosition(
      position => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "ios") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          // distanceTravelled:
          //   distanceTravelled + this.calcDistance(newCoordinate),
          distanceTravelled:
            (driveFlag) ? distanceTravelled + this.calcDistance(newCoordinate) : distanceTravelled,
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  calcDistance = newLatLng => {
    var pointTemp = parseInt(this.state.distanceTravelled * 100);
    this.state.drivePoint = parseInt(pointTemp/100);

    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  confirmDriveFunc = () => {
    if (!driveFlag)
    {
      Alert.alert(
        '주행을 시작하시겠습니까?',
        '',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this._updateDriveState()},
        ],
        { cancelable: false }
      )
    }
    else
    {
      Alert.alert(
        '주행을 종료하시겠습니까?',
        '',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this._updateDriveState()},
        ],
        { cancelable: false }
      )
    }
  }

  openLuckyBoxFunc = () => {
    if (this.state.drivePoint >= 1)
    {
      Alert.alert(
        '럭키박스',
        '\n100 Point로 럭키박스를 여시겠습니까?',
        [
          {text: '네'},
          {text: '아니오'},
        ],
        { cancelable: false }
      )
    }
    else
    {
      Alert.alert(
        '럭키 박스',
        '\nPoint가 부족합니다.\n\n럭키박스를 여시려면\n100 Point가 필요합니다.',
        [
          {text: '종료'},
        ],
        { cancelable: false }
      )
    }
  }

  paymentFunc = () => {
    if (this.state.distanceTravelled >= 1000)
    {
      Alert.alert(
        '상품 지급',
        '\n미션을 충족하였습니다!\n\n고객님의 연락처로 상품을 전달해드렸습니다!',
        [
          {text: '종료'},
        ],
        { cancelable: false }
      )
    }
    else
    {
      Alert.alert(
        '상품 지급',
        '\n미션을 충족하지 못하였습니다!\n\n 미션 충족 조건: 누적 주행거리 1000km',
        [
          {text: '종료'},
        ],
        { cancelable: false }
      )
    }
  }

  noticeFunc = () => {
    Alert.alert(
      '럭키박스 경품 이벤트 규칙!',
      '\n· 카모마일(carmoremile) 럭키박스 이벤트는 Google 혹은 Apple의 후원 및 지원을 받지 않습니다.\n\n· 경품은 선정은 무작위 추첨 방식으로 진행되며 준비한 상품의 수량이 모두 소진 시 선착순 마감될 수 있습니다.',
      [
        {text: '확인했어요!'},
      ],
      { cancelable: false }
    )
  }

  _updateDriveState() {
    if (!driveFlag)
    {
      driveState = "주행 중🐎"
      this.setState({color:"red"});
      driveFlag = true;
    }
    else
    {
      driveState = "주행 시작"
      this.setState({color:"green"});
      driveFlag = false;
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <ImageBackground style={styles.image} source={require('./images/camo_main.png')} resizeMode="cover">
          
          <View style={styles.header}>
            <Text style={styles.header_font_1}>오늘따라 더 달리고 싶다.</Text>
            <Text style={styles.header_font_2}>카모마일.</Text>
          </View>
          
          <View style={styles.title}>
            <View style={styles.button_container}>
              <Button
                color={this.state.color}
                title={driveState}
                onPress={this.confirmDriveFunc.bind(this)} />
            </View>
            
            <Text></Text>
            <Text>누적 포인트</Text>
            <Text style={{fontSize: 20}}>{this.state.drivePoint} Point</Text>
            <Text>총 {parseFloat(this.state.distanceTravelled).toFixed(2)} km 주행</Text>
          </View>

          <TouchableOpacity style={styles.content_caution} onPress={() => this.noticeFunc()}>
            <Text style={{color: 'red'}}>(클릭)경품 추첨 주의 사항!</Text>
          </TouchableOpacity>
          
          <View style={styles.content_title}>
            <Text>럭키박스를 눌러서 열어보세요! ▼</Text>
          </View>

          <TouchableOpacity style={styles.content} onPress={() => this.openLuckyBoxFunc()}>
            <Image style={{height:'100%', width:'100%', resizeMode:'contain'}} source={require('./images/camo_gift_box.png')} />
          </TouchableOpacity>

          <View style={styles.footer_1}>
            <View style={styles.footer_1_1}>
              <Text style={{color: "white", fontSize: 12}}>럭키박스 경품     ※당첨자가 모두 선발되면, 이벤트가 종료됩니다.</Text>
            </View>
            <View style={styles.footer_1_2}>
              <Image style={{marginTop: 10, borderRadius: 30, backgroundColor: "rgb(249, 192, 46)", height: '60%', width:'20%', resizeMode:'contain'}} source={require('./images/camo_gift.png')} />
              <Image style={{marginTop: 10, borderRadius: 30, backgroundColor: "rgb(249, 192, 46)", height: '60%', width:'20%', resizeMode:'contain'}} source={require('./images/camo_gift.png')} />
              <Image style={{marginTop: 10, borderRadius: 30, backgroundColor: "rgb(249, 192, 46)", height: '60%', width:'20%', resizeMode:'contain'}} source={require('./images/camo_gift.png')} />
              <Image style={{marginTop: 10, borderRadius: 30, backgroundColor: "rgb(249, 192, 46)", height: '60%', width:'20%', resizeMode:'contain'}} source={require('./images/camo_gift.png')} />
            </View>
            <View style={styles.footer_1_3}>
              <Text style={{color: "white", fontSize: 8}}>스타벅스 아메리카노</Text>
              <Text style={{color: "white", fontSize: 8}}>스타벅스 아메리카노</Text>
              <Text style={{color: "white", fontSize: 8}}>스타벅스 아메리카노</Text>
              <Text style={{color: "white", fontSize: 8}}>스타벅스 아메리카노</Text>
            </View>
          </View>
        
          <View style={styles.footer_2_title}>
            <Text>미션에 도전해보세요! ▼</Text>
          </View>
          
          <View style={styles.footer_2}>
            <View style={styles.footer_2_1}>
              <Text style={{color: "white"}}>현재 누적 주행거리</Text>
              <Text style={{color: "white", fontSize: 20}}>{parseInt(this.state.distanceTravelled)} / 1000 km</Text>
              <Text style={{color: "white"}}>누적 주행거리</Text>
              <Text style={{color: "white"}}>1000 km 달성시 상품 증정</Text>
            </View>

            <View style={styles.footer_2_2}>
              <Image style={{marginTop: 5, marginLeft: 55, borderRadius: 30, backgroundColor: "rgb(249, 192, 46)", height: '40%', width:'40%', resizeMode:'contain'}} source={require('./images/camo_gift.png')} />
              <Text style={{color: "white", marginLeft: 25}}>스타벅스 아메리카노</Text>
            
              <TouchableOpacity style={styles.footer_2_button_container} onPress={() => this.paymentFunc()}>
                <Text style={{marginTop: 4, marginLeft: 18, color:'white'}}>지급 받기</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ImageBackground>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  header: {
    // marginTop: 10,
    // paddingTop: 50,
    // paddingLeft: 20,
    paddingTop: 50,
    paddingLeft: 20,
    width:'100%',
    height:'15%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header_font_1: {
    fontSize: 20,
    color: 'white',
  },
  header_font_2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  button_container: {
    backgroundColor: "rgb(249, 192, 46)",
    // width: 220,
    // height: 40,
    width: "60%",
    height: "30%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  title: {
    marginTop: '5%',
    marginLeft: '15%',
    width: '70%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  content_title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: '25%',
    backgroundColor: "rgb(249, 192, 46)",
    width: '50%',
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content_caution: {
    marginTop: 10,
    marginLeft: '30%',
    backgroundColor: "rgb(249, 192, 46)",
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  footer_1: {
    marginLeft: '10%',
    marginTop: 10,
    width:'80%',
    height:'20%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    borderWidth: 1,
    opacity: 0.5,
  },
  footer_1_1: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_1_2: {
    marginTop: 30,
    height: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer_1_3: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  footer_2_title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '30%',
    marginBottom: 10,
    backgroundColor: "rgb(249, 192, 46)",
    width: '40%',
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  footer_2: {
    flex: 1,
    marginLeft: '10%',
    width:'80%',
    height:'15%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    borderWidth: 1,
    opacity: 0.5,
  },
  footer_2_1: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  footer_2_2: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  footer_2_button_container: {
    marginLeft: 35,
    marginBottom: 5,
    backgroundColor: "rgb(171, 68, 67)",
    width: "70%",
    height: "30%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
>>>>>>> 1bd6ab6bd695ef65dd3e95a26b8f70db4db9fa94
