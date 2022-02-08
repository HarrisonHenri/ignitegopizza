import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '@screens/Home';
import { Orders } from '@screens/Orders';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { BottomMenu } from '@src/components/BottomMenu';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@src/hooks/auth';

const { Navigator, Screen } = createBottomTabNavigator();

export function UserTabRoutes() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState('0')
  const { COLORS } = useTheme();

	useEffect(() => {
		const subscribe = 
			firestore()
			.collection('orders')
			.where('status', '==', 'Pronto')
			.where('waiter_id', '==', user?.id)
			.onSnapshot(query => {
				setNotifications(String(query.docs.length));
			});

			return () => subscribe();
	}, []);

  return (
    <Navigator 
      screenOptions={{ 
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0
        }
    }}>
      <Screen 
        name="home" 
        component={Home} 
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardápio" color={color} />
          )
        }}
      />
      <Screen 
        name="orders" 
        component={Orders} 
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Pedidos" color={color} notifications={notifications} />
          )
        }}
      />
    </Navigator>
  );
}