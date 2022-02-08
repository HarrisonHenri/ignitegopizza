import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

type TitleProps = {
	color: string;
};

type NotificationProps = {
	noNotifications: boolean;
};

export const Container = styled.View`
	flex-direction: row;
	align-items: center;
`;

export const Title = styled.Text<TitleProps>`
	font-size: 18px;
	${({ theme, color }) => css`
		color: ${color};
		font-family: ${theme.FONTS.TITLE};
	`}
`;

export const Notification = styled.View<NotificationProps>`
	height: 20px;
	border-radius: 12px;
	justify-content: center;
	align-items: center;
	padding: 0 12px;
	margin-left: 8px;

	${({ theme, noNotifications }) => !noNotifications && css`
		background-color: ${theme.COLORS.SUCCESS_900};
	`}

	${({ theme, noNotifications }) => noNotifications && css`
		background-color: transparent;
		border: 1px solid ${theme.COLORS.SHAPE};
	`}
`

export const Quantity = styled.Text<NotificationProps>`
	font-size: 12px;

	${({ theme, noNotifications }) => css`
		font-family: ${theme.FONTS.TEXT};
		color: ${noNotifications ? theme.COLORS.SECONDARY_500 : theme.COLORS.TITLE};
	`}
`;