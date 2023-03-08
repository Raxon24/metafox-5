/**
 * @type: block
 * name: core.block.html
 * title: Html Block
 * keywords: general
 * description: Custom Html
 */

import { createBlock } from '@metafox/framework';
import React from 'react';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import HtmlViewer from '@metafox/html-viewer';

function HtmlBlock({ title, content }) {
  return (
    <Block>
      <BlockHeader title={title} />
      <BlockContent>
        <HtmlViewer html={content} />
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: HtmlBlock,
  defaults: {
    title: 'Custom Html'
  },
  custom: {
    content: {
      component: 'Editor',
      name: 'content',
      variant: 'outlined',
      label: 'Html'
    }
  }
});
