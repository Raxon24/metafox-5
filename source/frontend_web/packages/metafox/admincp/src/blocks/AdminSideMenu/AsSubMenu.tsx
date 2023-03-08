/**
 * @type: ui
 * name: adminSideMenu.as.subMenu
 */
import { RouteLink, useGlobal } from '@metafox/framework';
import { LineIcon, MenuItemViewProps } from '@metafox/ui';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { orderBy } from 'lodash';
import { filterShowWhen } from '@metafox/utils';

export default function MenuItem(props: MenuItemViewProps) {
  const { item, classes, pathname, active: showActive } = props;

  const { useSession, getAcl, getSetting } = useGlobal();

  const [open, setOpen] = React.useState<boolean>(showActive);
  const session = useSession();
  const acl = getAcl();
  const setting = getSetting();

  const handleToggle = () => setOpen(open => !open);

  useEffect(() => {
    setOpen(showActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActive]);

  const items = filterShowWhen(item?.items, { session, acl, setting });

  if (!items?.length) return null;

  return (
    <>
      <div
        className={classes.menuItem}
        onClick={handleToggle}
        data-testid={item.testid || item.name}
      >
        <div className={classes.menuItemLink}>
          <LineIcon icon={item.icon} className={classes.menuItemIcon} />
          <span>{item.label}</span>
        </div>
        <LineIcon
          icon={open ? 'ico-angle-up' : 'ico-angle-down'}
          className={classes.iconArrow}
        />
      </div>
      {open ? (
        <div className={classes.subMenu}>
          {orderBy(items, ['label']).map((subItem, index) => (
            <div
              className={clsx(
                classes.subMenuItem,
                showActive &&
                  subItem.to === pathname &&
                  classes.subMenuItemActive
              )}
              key={index.toString()}
              onClick={null}
            >
              <RouteLink
                to={subItem.to}
                data-testid={subItem.testid || subItem.name}
                target={subItem.target}
                className={classes.subMenuItemLink}
              >
                <span>{subItem.label}</span>
              </RouteLink>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
