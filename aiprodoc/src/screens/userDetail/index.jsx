import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';

// utilities import
import {logout} from '../../redux/slices/userSlice';
import globalStyle from '../../utilities/globalStyle';

//main component
const UserDetail = () => {
  const dispatch = useDispatch();

  // handle functions
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, []);

  // render
  return (
    <View>
      <Text>This is User Detail</Text>

      {/* logout btn */}
      <Pressable
        style={({pressed}) => [
          {backgroundColor: pressed ? '#005896' : '#21a3ff'},
          styles.btnLogout,
          {marginTop: 10},
        ]}
        // onPress={userData.loading ? () => {} : handleLogin}>
        onPress={handleLogout}>
        <Text style={[styles.btnText, globalStyle.sub_text]}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default UserDetail;

const styles = StyleSheet.create({
  btnLogout: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#1E1E1E',
    shadowOpacity: 20,
    shadowRadius: 1,
  },
  btnText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
});
