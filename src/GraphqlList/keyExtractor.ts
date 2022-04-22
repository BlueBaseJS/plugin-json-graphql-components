import get from 'lodash.get';

export const keyExtractor = (item: any, index: number) => get(item, 'id', index.toString());
