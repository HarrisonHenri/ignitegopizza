
  
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import {
	Container,
	Content,
	Image,
	Details,
	Name,
	Identification,
	Description,
	Line,
} from './styles';
import { TouchableOpacityProps } from 'react-native';

export type ProductProps = {
  id: string;
  photo_url: string;
  name: string;
  description: string;
}

type Props = TouchableOpacityProps & {
  data: ProductProps;
}

export function ProductCard({data, ...rest}: Props){
  const { COLORS } = useTheme();

  return(
    <Container>
      <Content {...rest}>
        <Image source={{uri: data.photo_url}} />

        <Details>
          <Identification>
            <Name>{data.name}</Name>
            <Feather name="chevron-right" size={18} color={COLORS.SHAPE} />
          </Identification>

          <Description>{data.description}</Description>
        </Details>
      </Content>
      <Line />
    </Container>
  )
}