import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Container, Form, FormRow, Header, InputGroup, Photo, Sizes, Label, Price, ContentScroll, Title } from './styles';
import firestore from '@react-native-firebase/firestore';

import { useNavigation, useRoute } from '@react-navigation/native';
import { ButtonBack } from '@src/components/ButtonBack';
import { RadioButton } from '@src/components/RadioButton';
import { PIZZA_TYPES } from '@src/utils/pizzaTypes';
import { Input } from '@src/components/Input';
import { Button } from '@src/components/Button';
import { OrderNavigationProps } from '@src/@types/navigation';
import { ProductProps } from '@src/components/ProductCard';
import { useAuth } from '@src/hooks/auth';

type PizzaResponse = ProductProps & {
	prices_sizes: {
		p: string,
		m: string,
		g: string,
	},
}

export function Order() {
	const [size, setSize] = useState<'p'|'m'|'g'|null>(null);
	const [quantity, setQuantity] = useState(0);
	const [tableNumber, setTableNumber] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);

	
	const amount = size ? Number(pizza.prices_sizes[size]) * quantity : "0,00";
	const { goBack, navigate } = useNavigation();
	const { user } = useAuth();
	const route = useRoute();
	const { id } = route.params as OrderNavigationProps;

	async function handleAdd() {
		if (!size) {
			Alert.alert('Pedido', 'Informe o tamanho da Pizza');
			return;
		}

		if (!tableNumber) {
			Alert.alert('Pedido', 'Informe o número da mesa');
			return;
		}

		if (!quantity) {
			Alert.alert('Pedido', 'Informe a quantidade');
		}

		setIsLoading(true);

		firestore()
			.collection('orders')
			.add({
				quantity,
				amount,
				pizza: pizza.name,
				size,
				table_number: tableNumber,
				status: "Preparando",
				waiter_id: user?.id,
				image: pizza.photo_url
			})
			.then(() => {
				navigate('home');
			})
			.catch(() => {
				Alert.alert('Pedido', 'Não foi possível realizar o pedido');
			});
			
		setIsLoading(false);
	}

	function handleGoBack() {
		goBack();
	}

	function handleChangeSize(s: 'p'|'m'|'g') {
		setSize(s);
	}

	useEffect(() => {
		if (id) {
			firestore()
			.collection('pizzas')
			.doc(id)
			.get()
			.then(response => {
				const data = response.data() as PizzaResponse;

				setPizza(data);
			})
			.catch(() => {
				Alert.alert('Pedido', 'Não foi possível carregar o produto');
			});
		}
	}, []);
	

  return (
		<Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<ContentScroll>
				<Header>
					<ButtonBack onPress={handleGoBack} style={{ marginBottom: 108 }} />
				</Header>

				<Photo source={{ uri: pizza.photo_url }} />

				<Form>
					<Title>{pizza.name}</Title>
					<Label>Selecione um tamanho</Label>		
					<Sizes>
						{
							PIZZA_TYPES.map(item => (
								<RadioButton 
									key={item.id}
									{...item}
									selected={size === item.id}
									onPress={() => handleChangeSize(item.id)}
								/>
							))
						}
					</Sizes>

					<FormRow>
						<InputGroup>
							<Label>Número da mesa</Label>
							<Input
								keyboardType="numeric"
								onChangeText={setTableNumber}
							/>
						</InputGroup>

						<InputGroup>
							<Label>Quantidade</Label>
							<Input
								keyboardType="numeric"
								onChangeText={(value) => setQuantity(Number(value))}
							/>
						</InputGroup>
					</FormRow>

					<Price>Valor de R$ {amount}</Price>

					<Button 
						title="Confirmar pedido"
						onPress={handleAdd}
						isLoading={isLoading}
					/>
				</Form>
			</ContentScroll>
		</Container>
  );
}
