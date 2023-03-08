import { RouteLink, ExternalLink } from '@metafox/framework';
import { createElement } from 'react';
import { convertNodeToElement } from './index';
import { THtmlViewerNode } from './types';
import { isExternalLink } from '@metafox/utils';

const IsUrlReg = /^(http|https)?:?\/\//s;

const transform = (node: THtmlViewerNode, index: string): JSX.Element => {
  if (
    'tag' === node.type &&
    'a' === node.name &&
    node.attribs &&
    node.attribs.href
  ) {
    const isExternalUrl = isExternalLink(node.attribs.href);

    if (isExternalUrl || IsUrlReg.test(node.attribs.href)) {
      return createElement(
        ExternalLink,
        {
          ...node.attribs,
          className: 'external-link'
        },
        node.children.map((node, index) =>
          convertNodeToElement(node, index, transform)
        )
      );
    }

    if (node.attribs.id) {
      const id = node.attribs.id;
      const href = node.attribs.href;
      const module = node.attribs.type;

      return createElement(
        RouteLink,
        {
          ...node.attribs,
          target: node.attribs.target ? node.attribs.target : undefined,
          to: href || `/user/${id}`,
          key: `n${index}`,
          className: 'profileLink',
          hoverCard: `/${module || 'user'}/${id}`
        },
        node.children.map((node, index) =>
          convertNodeToElement(node, index, transform)
        )
      );
    }
  }
};

export default transform;
