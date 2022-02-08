import React, { useEffect, useState } from 'react';
import { ScrollView, Platform, TouchableOpacity, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ProductNavigationProps } from '@src/@types/navigation';

import { InputPrice } from '../../components/InputPrice';
import { ButtonBack } from '../../components/ButtonBack';
import { Button } from '../../components/Button';
import { Photo } from '../../components/Photo';
import { Input } from '../../components/Input';

import {
	Container,
	Header,
	Title,
	DeleteLabel,
	Upload,
	PickImageButton,
	Form,
	Label,
	InputGroup,
	InputGroupHeader,
	MaxCharacters,
} from './styles';
import { ProductProps } from '@src/components/ProductCard';

type PizzaResponse = ProductProps & {
	prices_sizes: {
		p: string,
		m: string,
		g: string,
	},
	photo_path: string;
}

export function Product() {
	const { goBack, navigate } = useNavigation();
	const [image, setImage] = useState('');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [priceSizeP, setPriceSizeP] = useState('');
	const [priceSizeM, setPriceSizeM] = useState('');
	const [priceSizeG, setPriceSizeG] = useState('');
	const [photoPath, setPhotoPath] = useState('');
	const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

	async function handlePickerImage() {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				aspect: [4, 4],
			});

			if (!result.cancelled) {
				setImage(result.uri);
			}
		}
	}

	async function handleAdd() {
		if (!name.trim()) {
			Alert.alert('Cadastro', 'Informe o nome da Pizza');
			return;
		}

		if (!description.trim()) {
			Alert.alert('Cadastro', 'Informe a descrição da Pizza');
			return;
		}

		if (!image) {
			Alert.alert('Cadastro', 'Selecione a imagem da Pizza');
		}

		if (!priceSizeP || !priceSizeM || !priceSizeG) {
			Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da Pizza');
			return;
		}

		setIsLoading(true);

		const fileName = new Date().getTime();
		const reference = storage().ref(`pizzas/${fileName}.png`);

		await reference.putFile(image);
		const photo_url = await reference.getDownloadURL();

		firestore()
			.collection('pizzas')
			.add({
				name,
				name_insensitive: name.toLowerCase().trim(),
				description,
				prices_sizes: {
					p: priceSizeP,
					m: priceSizeM,
					g: priceSizeG,
				},
				photo_url,
				photo_path: reference.fullPath,
			})
			.then(() => {
				navigate('home');
			})
			.catch(() => {
				Alert.alert('Cadastro', 'Não foi possível cadastrar a Pizza');
			});
			
		setIsLoading(false);
	}

	async function handleDelete() {
		setIsLoading(true);

		firestore()
			.collection('pizzas')
			.doc(id)
			.delete()
			.then(() => {
				storage()
				.ref(photoPath)
				.delete()
				.then(() => Alert.alert('Remoção', 'Pizza removida com sucesso!'))	
			});
			
		setIsLoading(false);
	}

	function handleGoBack() {
		goBack();
	}

	useEffect(() => {
		if (id){
			firestore()
			.collection('pizzas')
			.doc(id)
			.get()
			.then(response => {
				const data = response.data() as PizzaResponse;

				setDescription(data.description);
				setPhotoPath(data.photo_path);
				setName(data.name);
				setImage(data.photo_url);
				setPriceSizeG(data.prices_sizes.g);
				setPriceSizeM(data.prices_sizes.m);
				setPriceSizeP(data.prices_sizes.p);
			})
		}
	}, []);
	

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<Header>
					<ButtonBack onPress={handleGoBack} />
					<Title>Cadastrar</Title>
					{id ? <TouchableOpacity onPress={handleDelete}>
						<DeleteLabel>Deletar</DeleteLabel>
					</TouchableOpacity> : <View style={{ width: 20 }} />}
				</Header>
				<Upload>
					<Photo uri={image} />
					{!id && <PickImageButton
						title="Carregar"
						type="secondary"
						onPress={() => {
							handlePickerImage();
						}}
					/>}
				</Upload>
				<Form>
					<InputGroup>
						<Label>Nome</Label>
						<Input
							onChangeText={(text) => {
								setName(text);
							}}
							value={name}
						/>
					</InputGroup>

					<InputGroup>
						<InputGroupHeader>
							<Label>Descrição</Label>
							<MaxCharacters>0 de 60 caracteres</MaxCharacters>
						</InputGroupHeader>

						<Input
							multiline
							maxLength={60}
							style={{ height: 80 }}
							onChangeText={(text) => {
								setDescription(text);
							}}
							value={description}
						/>
					</InputGroup>

					<InputGroup>
						<Label>Tamanhos e Preços</Label>

						<InputPrice
							size="P"
							onChangeText={(text) => {
								setPriceSizeP(text);
							}}
							value={priceSizeP}
						/>
						<InputPrice
							size="M"
							onChangeText={(text) => {
								setPriceSizeM(text);
							}}
							value={priceSizeM}
						/>
						<InputPrice
							size="G"
							onChangeText={(text) => {
								setPriceSizeG(text);
							}}
							value={priceSizeG}
						/>
					</InputGroup>

					{!id && <Button
						title="Cadastrar pizza"
						isLoading={isLoading}
						onPress={() => {
							handleAdd();
						}}
					/>}
				</Form>
			</Container>
		</ScrollView>
	);
}