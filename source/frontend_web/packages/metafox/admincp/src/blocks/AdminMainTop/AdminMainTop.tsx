/**
 * @type: block
 * name: core.block.AdminMainTop
 * title: AdminCP - BreadCrumbs & Secondary Menu
 * bundle: admincp
 * experiment: true
 */
import {
  createBlock,
  getPageMetaDataSelector,
  GlobalState,
  PageMetaShape,
  useGlobal,
  useLocation
} from '@metafox/framework';
import { styled } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import AdminBreadCrumb from './AdminBreadCrumb';
import SecondaryMenu from './SecondaryMenu';

const BlockWrapper = styled('div', {
  name: 'AdminMainTop',
  slot: 'block'
})({
  padding: '8px 16px 8px 16px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

const AdminMainTop = () => {
  const { usePageParams, getSetting } = useGlobal();
  const { appName, pageMetaName } = usePageParams();

  const data = useSelector<GlobalState, PageMetaShape>(
    state => getPageMetaDataSelector(state, pageMetaName),
    (prev, next) => prev?.name === next?.name
  );
  const { pathname } = useLocation();

  const menuName = data?.secondary_menu || `${appName}.admin`;

  const homePage = getSetting<{ url: string; title: string }>(
    `core.adminHomePages.${appName}`
  );

  const breadcrumbs = [{ label: 'Dashboard', to: '/admincp' }];

  if (pathname === '/admincp') return null;

  if (homePage) {
    breadcrumbs.push({
      to: pathname === homePage.url ? undefined : homePage.url,
      label: homePage.title
    });
  }

  if (data?.title) {
    breadcrumbs.push({ to: '', label: data.title });
  }

  return (
    <BlockWrapper>
      <AdminBreadCrumb appName={appName} breadcrumbs={breadcrumbs} />
      <SecondaryMenu appName={appName} menuName={menuName} />
    </BlockWrapper>
  );
};

export default createBlock({
  extendBlock: AdminMainTop,
  defaults: {
    title: 'AdminMainTop'
  }
});
