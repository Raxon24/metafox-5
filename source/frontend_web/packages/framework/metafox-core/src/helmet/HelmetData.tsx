import { useGlobal } from '@metafox/framework';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { isPlainObject, map } from 'lodash';

export default function HelmetData() {
  const { usePageMeta, useSubject, i18n, getSetting, usePageParams } =
    useGlobal();
  const data = usePageMeta();
  const pageParams = usePageParams();
  const values = useSubject<Record<string, any>>();
  const transform = msg =>
    (msg
      ? i18n.formatMessage(
          { id: msg, defaultMessage: msg },
          { ...values, search_text: pageParams?.q }
        )
      : '');

  const {
    title_append: append = 1,
    title_delim,
    site_name
  } = getSetting<Record<string, unknown>>('core.general', {});
  let title = transform(data?.title);
  const description = transform(data?.description);
  const keywords = transform(data?.keywords);

  if (append) {
    title = title ? `${title}${title_delim}${site_name}` : `${site_name}`;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {data?.meta && isPlainObject(data.meta)
        ? map(data.meta, (item, index) =>
            React.createElement('meta', {
              ...item,
              key: index.toString()
            })
          )
        : null}
    </Helmet>
  );
}
