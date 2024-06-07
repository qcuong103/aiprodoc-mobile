import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

// main component
const TabBottomCreate = ({routeList, screenOptions, ...restProps}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          const iconName = routeList.find(
            item => item.name === route.name,
          ).iconName;
          size = focused ? 24 : 16;
          if (iconName.length)
            return <FontAwesome name={iconName} size={size} color={color} />;
          return null;
        },
        ...screenOptions,
      })}
      {...restProps}>
      {routeList
        ? routeList.map(item => (
            <Tab.Screen
              key={item.key}
              name={item.name}
              options={item.options}
              component={item.component}
            />
          ))
        : null}
    </Tab.Navigator>
  );
};

export default TabBottomCreate;

const styles = StyleSheet.create({});
