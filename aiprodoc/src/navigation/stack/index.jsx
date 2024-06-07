import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

// main component
const StackCreate = ({routeList, options}) => {
  return (
    <Stack.Navigator screenOptions={options ? options : null}>
      {routeList
        ? routeList.map(item => (
            <Stack.Screen
              key={item.key}
              name={item.name}
              options={item.options}
              component={item.component}
            />
          ))
        : null}
    </Stack.Navigator>
  );
};

export default StackCreate;
