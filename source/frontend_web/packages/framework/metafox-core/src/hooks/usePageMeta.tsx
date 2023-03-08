/**
 * @type: service
 * name: usePageMeta
 */

import { useEffect, useState } from 'react';
import { LOAD_PAGE_META } from '@metafox/framework';
import useGlobal from './useGlobal';

export default function usePageMeta() {
  const { dispatch, getSetting, usePageParams } = useGlobal();
  const { pageMetaName, id } = usePageParams();

  const root = getSetting<{
    description: string;
    keywords: string;
    title: string;
    site_title: string;
  }>('core.general');

  const [data, setData] = useState(root);

  useEffect(() => {
    dispatch({
      type: LOAD_PAGE_META,
      payload: { pageMetaName, params: { id } },
      meta: { onSuccess: setData }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageMetaName]);

  return data;
}
