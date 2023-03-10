import { ImageRatio, ItemShape } from '@metafox/ui';
import * as React from 'react';
import FeedEmbedAlbumTemplate from './FeedEmbedAlbumTemplate';

type Props = {
  title?: string;
  description?: string;
  link?: string;
  host?: string;
  image?: string;
  mediaRatio?: ImageRatio;
  price?: string;
  displayStatistic?: string;
  maxLinesTitle?: number;
  maxLinesDescription?: number;
  highlightSubInfo?: string;
  variant?: 'grid' | 'list';
} & ItemShape;

const FeedArticleGrid = (props: Props) => (
  <FeedEmbedAlbumTemplate
    {...props}
    variant={'grid'}
    widthImage={'100%'}
    mediaRatio={'169'}
  />
);

export default FeedArticleGrid;
