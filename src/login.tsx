import React, { Component, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert
} from 'react-native';
 
import {
  KakaoOAuthToken,
  KakaoProfile,
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';

import { appleAuth } from '@invertase/react-native-apple-authentication';

export default class LoginPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      login_accessToken : "",
      login_distanceTravelled : "",
      login_drivePoint: "",
    };
  }
  
  signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
  
    var result = JSON.stringify(token.accessToken);

    this.state.login_accessToken = token.accessToken;

    if (result === null)
    {
      //None
    }
    else
    {
      this.props.navigation.navigate('Main', {
        login_accessToken : this.state.login_accessToken,
      });
    }
  };

  signOutWithKakao = async (): Promise<void> => {
    const message = await logout();

    var result = message;
  };
  
  getProfile = async (): Promise<void> => {
    const profile: KakaoProfile = await getKakaoProfile();

    var result = JSON.stringify(profile);
  };
  
  unlinkKakao = async (): Promise<void> => {
    const message = await unlink();

    var result = messgae;
  };

  appleLogin = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      this.props.navigation.navigate('Main');
    }
  };

  render() {
    return (
      <View style={styles.background}>
        <ImageBackground style={styles.image} source={require('../images/main.jpeg')} resizeMode="cover">
          <View style={styles.button_container}>
            <TouchableOpacity style={styles.button_login_kakao} onPress={() => this.signInWithKakao()}>
              <Text style={{marginTop: 5, fontSize: 20, color:'white'}}>Sign in with Kakao</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.button_login_apple} onPress={() => this.appleLogin()}>
              <Text style={{marginTop: 5,fontSize: 20, color:'white'}}>Sign in with Apple</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  button_container: {
    marginTop: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button_login_kakao: {
    backgroundColor: "rgb(249, 192, 46)",
    alignItems: 'center',
    width: "60%",
    height: "25%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#fff',
  },
  button_login_apple: {
    backgroundColor: "rgb(249, 192, 46)",
    alignItems: 'center',
    width: "60%",
    height: "25%",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#fff',
  },
})

export default LoginPage;