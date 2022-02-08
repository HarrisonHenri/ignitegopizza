import { Separator } from '@src/components/ItemSeparator/styles';
import { OrderCard, OrderProps } from '@src/components/OrderCard';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Container, Header, Title } from './styles';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '@src/hooks/auth';
import { Alert } from 'react-native';

export function Orders() {
	const [orders, setOrders] = useState<OrderProps[]>([])
	const { user } = useAuth();

	function handlPizzaDelivered(id: string) {
		Alert.alert('Pedido', 'O pedido foi entregue?', [
			{
				text: 'Não',
				style: 'cancel'
			},
			{
				text: 'Sim',
				onPress: () => firestore().collection('orders').doc(id).update({status: "Entregue"})
			}
		])
	}

	useEffect(() => {
		const subscribe = 
			firestore()
			.collection('orders')
			.where('waiter_id', '==', user?.id)
			.onSnapshot(query => {
				const data = query.docs.map(orderItem => ({
					id: orderItem.id,
					...orderItem.data()
				})) as OrderProps[];

				setOrders(data);
			});

			return () => subscribe();
	}, []);
	

  return (
		<Container>
			<Header>
				<Title>Pedidos</Title>
			</Header>

			<FlatList 
				data={orders}
				keyExtractor={item => item.id}
				renderItem={({ item, index }) => (
					<OrderCard 
						index={index} 
						data={item}
						disabled={item.status === "Entregue"}
						onPress={() => handlPizzaDelivered(item.id)}
					/>
				)}
				numColumns={2}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
				ItemSeparatorComponent={() => <Separator />}
			/>
		</Container>
  );
}
