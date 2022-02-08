import React, { useCallback, useState } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Container, Gretting, GrettingEmoji, GrettingText, Header, MenuHeader, MenuItemsNumber, NewProductButton, Title } from './styles';
import firestore from '@react-native-firebase/firestore';

import happyEmoji from '@assets/happy.png';
import { useTheme } from 'styled-components';
import { Search } from '@src/components/Search';
import { ProductCard, ProductProps } from '@src/components/ProductCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '@src/hooks/auth';

export function Home() {
	const { signOut, user } = useAuth();
	const [search, setSearch] = useState("");
	const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const { COLORS } = useTheme();
	const { navigate } = useNavigation();

	function fetchPizzas(value: string) {
		const formattedValue = value.toLocaleUpperCase().trim();

		firestore()
		.collection('pizzas')
		.orderBy('name_insensitive')
		.startAt(formattedValue)
		.endAt(`${formattedValue}\uf8ff`)
		.get()
		.then(response => {
			const data = response.docs.map(pizza => ({
				id: pizza.id,
				...pizza.data()
			})) as ProductProps[];

			setPizzas(data);
		})
		.catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta'));
	}

	function handleSearch() {
		fetchPizzas(search)
	}

	function handleSearchClear() {
		setSearch('');
		fetchPizzas('');
	}

	function handleOpen(id: string) {
		const route = user?.isAdmin ? 'product' : 'order';
		navigate(route, { id });
	}

	function handleAdd() {
		navigate('product', {});
	}

	useFocusEffect(useCallback(() => {
		fetchPizzas('');
	}, []));
	

  return (
    <Container>
      <Header>
        <Gretting>
          <GrettingEmoji source={happyEmoji} />
          {user?.isAdmin && <GrettingText>Olá, Admin</GrettingText>}
        </Gretting>

        <TouchableOpacity onPress={signOut}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search 
				value={search} 
				onChangeText={setSearch} 
				onSearch={handleSearch} 
				onClear={handleSearchClear} 
			/>

      <MenuHeader>
				<Title>Cardápio</Title>
				<MenuItemsNumber>{pizzas.length} pizzas</MenuItemsNumber>
			</MenuHeader>

			<FlatList
				data={pizzas}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ProductCard
						data={item}
						onPress={() => handleOpen(item.id)}
					/>
				)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingTop: 20,
					paddingBottom: 125,
					marginHorizontal: 24,
				}}
			/>

			{user?.isAdmin && <NewProductButton 
				title="Cadastrar pizza" 
				type="secondary" 
				onPress={handleAdd}
			/>}
    </Container>
  );
}
