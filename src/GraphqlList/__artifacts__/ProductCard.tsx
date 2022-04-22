/* istanbul ignore file */
import {
	BlueBaseImageProps,
	Card,
	Overline,
	Subtitle1,
	View
} from '@bluebase/components';
import { getComponent, useNavigation, useStyles, useTheme } from '@bluebase/core';
import get from 'lodash.get';
import React, { useCallback } from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

import ProgressiveImage from '../../ProgressiveImage';
import { SkeletonCardProps } from '../../SkeletonCard';

const SkeletonCard = getComponent<SkeletonCardProps>('SkeletonCard');

export interface ProductCardStyles {
	/** Root container styles */
	root: ViewStyle;

	/** Image container styles */
	avatarContainer: ViewStyle;

	/** Image container styles */
	avatar: ImageStyle;

	/** Content container styles */
	content: ViewStyle;

	/** Brand text styles */
	brand: TextStyle;

	/** Product name styles */
	name: TextStyle;
}

export interface ProductCardProps {
	[key: string]: any;
	/** Main Image */
	avatar?: BlueBaseImageProps['source'];

	/** Thumbnail Image */
	thumbnail?: BlueBaseImageProps['source'];

	/** Placeholder Image */
	placeholder?: BlueBaseImageProps['source'];

	/** If true, pressing card will navigate to ProductProfileScreen */
	link?: boolean;

	/** Width of the card */
	width?: number;

	/** Show loading state */
	loading?: boolean;
	onPress?: () => void;

	style?: StyleProp<ViewStyle>;
	styles?: Partial<ProductCardStyles>;
}

/**
 * ProductCard used for listing of available products.
 */
export const ProductCard = (props: ProductCardProps) => {
	const { brand, avatar, thumbnail, link, name, placeholder, width, loading, onPress } = props;

	const { theme } = useTheme();
	const styles = useStyles<ProductCardStyles>('ProductCard', props, {
		root: {},

		avatarContainer: {
			borderTopLeftRadius: theme.shape.borderRadius,
			borderTopRightRadius: theme.shape.borderRadius,
			overflow: 'hidden',
		},

		avatar: {
			backgroundColor: theme.palette.background.dark,
		},

		content: {
			padding: theme.spacing.unit,
		},

		brand: {
			color: theme.palette.text.disabled,
		},

		name: {
			paddingTop: theme.spacing.unit / 2,
		},
	});

	const { navigate } = useNavigation();

	if (loading === true) {
		return <SkeletonCard width={width!} />;
	}

	return (
		<Card
			style={{ ...(styles.root as object), width }}
			onPress={link === true ? useCallback(() => navigate('ProductProfile'), []) : onPress}
		>
			<View style={styles.avatarContainer}>
				<ProgressiveImage
					placeholder={placeholder}
					thumbnail={thumbnail}
					source={avatar}
					style={{ ...styles.avatar, height: width, width }}
				/>
			</View>

			<View style={styles.content}>
				<Overline
					testID="productcard-brand-name-text"
					ellipsizeMode="tail"
					numberOfLines={1}
					style={styles.brand}
				>
					{get(brand, 'name', 'Unknown Brand')}
				</Overline>
				<Subtitle1
					testID="productcard-name-text"
					ellipsizeMode="tail"
					numberOfLines={1}
					style={styles.name}
				>
					{name ? name : 'Untitled'}
				</Subtitle1>
			</View>
		</Card>
	);
};

/**
 *  default props of ProductCard
 * if no props are given then
 * ProductCard will render with
 * these props
 */

ProductCard.defaultProps = {
	link: true,
	placeholder: 'ProductPlaceholder',
	width: 150,
};
