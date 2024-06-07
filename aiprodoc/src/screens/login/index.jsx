import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

// utilities import
import {asyncLogin} from '../../redux/slices/userSlice';
import globalStyle from '../../utilities/globalStyle';

// main component
const Login = () => {
  // state
  const userData = useSelector(state => state.user);
  const [user, setUser] = useState({username: '', password: ''});
  const [warning, setWarning] = useState({visible: false, message: ''});
  const [showPassword, setShowPassword] = useState(false);

  // ref
  const username = useRef();
  const password = useRef();

  // other hooks
  const dispatch = useDispatch();

  // handle functions
  const handleDissmissKeyboard = useCallback(() => Keyboard.dismiss(), []);
  const handleUsernameFocus = useCallback(
    () => username.current.focus(),
    [username],
  );

  const handleCloseWarning = useCallback(() => {
    setWarning({...warning, visible: false});
    if (warning.where) {
      warning.where.current.focus();
      return;
    }
    handleUsernameFocus();
  }, [warning]);

  const handleHidePassword = useCallback(() => setShowPassword(false), []);

  const handleShowPassword = useCallback(() => {
    if (user.password.length) {
      setShowPassword(true);
    }
    if (!user.username.length) {
      username.current.focus();
      return;
    }
    if (!user.password.length) {
      password.current.focus();
      return;
    }
  }, [user, username, password]);

  const handleLogin = useCallback(() => {
    if (user.username.length === 0) {
      const warn = {
        visible: true,
        message: 'Username can not be empty',
        where: username,
      };
      setWarning(warn);
      return;
    }
    if (user.password.length === 0) {
      const warn = {
        visible: true,
        message: 'Password can not be empty',
        where: password,
      };
      setWarning(warn);
      return;
    }
    dispatch(asyncLogin(user));
  }, [user, username, password]);

  // effect
  useEffect(() => {
    if (userData.loading === false) {
      setWarning(userData.error);
    }
    return () => {};
  }, [userData.loading]);

  // render
  return (
    <LinearGradient
      style={{flex: 1, backgroundColor: '#0093E9'}}
      colors={['#0093E9', '#80D0C7']}
      locations={[0, 1]}
      useAngle={true}
      angle={160}
      angleCenter={{x: 0, y: 0}}>
      {/* Warning */}
      <Modal
        visible={warning.visible}
        transparent
        onRequestClose={handleCloseWarning}
        animationType={'fade'}
        hardwareAccelerated>
        <TouchableWithoutFeedback onPress={handleCloseWarning}>
          <View style={styles.warning_ctn}>
            <View style={styles.warning}>
              <View style={styles.warning_title}>
                <Text style={[styles.text_warning, styles.text_warning_title]}>
                  Warning!
                </Text>
              </View>
              <View style={styles.warning_content}>
                <Text style={styles.text_warning}>{warning.message}</Text>
              </View>
              <View>
                <Pressable
                  style={styles.warning_btn}
                  android_ripple={{color: '#0ef'}}
                  onPress={handleCloseWarning}>
                  <Text style={{color: Colors.white, textAlign: 'center'}}>
                    OK
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableWithoutFeedback onPress={handleDissmissKeyboard}>
        <View style={styles.body}>
          {/* Tilte */}
          <Text
            style={[styles.title, globalStyle.main_text, globalStyle.text_3xl]}>
            Login
          </Text>

          {/* Input Field */}
          <View style={styles.inputCtn}>
            <View style={styles.input}>
              <TextInput
                ref={username}
                style={[styles.input_text, globalStyle.sub_text]}
                placeholder="Your Username"
                placeholderTextColor="#878680"
                value={user.username}
                onChangeText={value => setUser({...user, username: value})}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.input}>
              <TextInput
                ref={password}
                style={[styles.input_text, globalStyle.sub_text]}
                placeholder="Your Password"
                placeholderTextColor="#878680"
                secureTextEntry={!showPassword}
                value={user.password}
                onChangeText={value => setUser({...user, password: value})}
                autoCapitalize="none"
              />
              {/* showPassword */}
              <Pressable
                style={styles.show_password}
                onPressIn={handleShowPassword}
                onPressOut={handleHidePassword}
                hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                <FontAwesome
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={18}
                  color={showPassword ? '#303133' : '#a8adb5'}
                />
              </Pressable>
            </View>
          </View>

          {/* Submit btn */}
          <Pressable
            style={({pressed}) => [
              {backgroundColor: pressed ? '#005896' : '#21a3ff'},
              styles.btnSubmit,
            ]}
            onPress={userData.loading ? () => {} : handleLogin}>
            <Text
              style={[
                styles.btnText,
                globalStyle.sub_text,
                globalStyle.text_md,
              ]}>
              Login
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    marginBottom: 20,
  },
  inputCtn: {
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#dbdbd7',
    elevation: 10,
    shadowColor: '#1E1E1E',
    shadowOpacity: 20,
    shadowRadius: 1,
  },
  input_text: {
    flex: 1,
    paddingVertical: 10,
    color: '#1f1f1f',
  },
  show_password: {},
  btnSubmit: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#1E1E1E',
    shadowOpacity: 20,
    shadowRadius: 1,
  },
  btnText: {color: '#fff', fontSize: 20, textTransform: 'uppercase'},
  warning_ctn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },
  warning: {
    width: 300,
    height: 150,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  warning_title: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  warning_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_warning_title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_warning: {
    fontSize: 20,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  warning_btn: {
    padding: 10,
    backgroundColor: '#61f',
    borderRadius: 5,
  },
});
