import {
  getPagingSelector,
  GlobalState,
  initPagingState,
  ListViewBlockProps,
  PagingState,
  useGetItem,
  useGlobal,
  useScrollEnd,
  useSession,
  useHasScroll
} from '@metafox/framework';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import { filterShowWhen } from '@metafox/utils';
// layout
import { Grid } from '@mui/material';
// components
import { isArray, range, get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Pagination, LoadMoreListingButton } from '@metafox/ui';

export default function ListViewBase({
  title,
  itemView,
  startItemView,
  itemProps = {},
  gridItemProps = {},
  gridContainerProps = { spacing: 2 },
  displayLimit = 4,
  pagingId,
  canLoadMore,
  buttonMessageLoadmore,
  messagePagination,
  handleUpdateLastRead,
  canLoadSmooth,
  loadMore,
  numberOfItemsPerPage,
  emptyPage = 'core.block.no_content',
  emptyPageProps,
  isLoadMoreScroll,
  isLoadMoreButton,
  isLoadMorePagination,
  errorPage,
  hasSort = false,
  titleBackend = false,
  moduleName,
  resourceName,
  actionName
}: ListViewBlockProps) {
  const { jsxBackend, usePageParams, i18n } = useGlobal();
  const { loggedIn, user: authUser } = useSession();
  const pageParams = usePageParams();
  const item = useGetItem(pageParams?.identity);
  const { page } = pageParams;
  const ItemView = jsxBackend.get(itemView);
  const Skeleton = jsxBackend.get(`${itemView}.skeleton`);
  const currentPageInitial = isLoadMorePagination ? parseInt(page || 1, 10) : 1;
  const [hasSCroll, checkSCrollExist] = useHasScroll(true);

  // check show startItemView
  let startItemViews = [];

  if (startItemView) {
    const isAuthUser =
      authUser?.id && pageParams?.id && authUser.id === parseInt(pageParams.id);

    const condition = { pageParams, authUser, loggedIn, isAuthUser, item };

    startItemViews = filterShowWhen(startItemView, condition).map(
      ({ as: c, ...props }, index) => ({
        component: c,
        props: {
          key: index.toString(),
          ...props
        }
      })
    );
  }

  const [currentPage, setCurrentPage] =
    React.useState<number>(currentPageInitial);

  const paging =
    useSelector<GlobalState, PagingState>((state: GlobalState) =>
      getPagingSelector(state, pagingId)
    ) || initPagingState();

  useScrollEnd(
    isLoadMoreScroll ? () => setCurrentPage(prev => prev + 1) : undefined
  );

  const triggerLoadmore = React.useCallback(() => {
    loadMore();
    setCurrentPage(prev => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagingId]);

  React.useEffect(() => {
    if (checkSCrollExist) {
      checkSCrollExist();
    }
  }, [paging?.page, checkSCrollExist]);

  React.useEffect(() => {
    if (isLoadMoreScroll && !paging?.ended && !paging?.loading && !hasSCroll) {
      triggerLoadmore();
    }
  }, [
    paging?.loading,
    paging?.page,
    isLoadMoreScroll,
    paging?.ended,
    hasSCroll,
    triggerLoadmore
  ]);
  const perPage = numberOfItemsPerPage || 20;
  const limit = isLoadMorePagination ? perPage : Math.min(displayLimit, 4);
  const { loading, refreshing, error, ended, initialized, pagesOffset } =
    paging ?? {};
  const isLoadingPagination = isLoadMorePagination && loading;
  const isLoadingLoadMoreScroll = isLoadMoreScroll && !ended;
  const isLoadingLoadMoreButton = isLoadMoreButton && loading;
  const showLoadSmooth =
    canLoadSmooth &&
    (isLoadingLoadMoreScroll || isLoadingPagination || isLoadingLoadMoreButton);

  let data = canLoadMore
    ? paging.ids.slice(0, currentPage * perPage)
    : paging.ids.slice(0, displayLimit || paging.ids.length);

  if (isLoadMorePagination) {
    data = paging.pages[currentPage]?.ids || [];
  }

  React.useEffect(() => {
    if (handleUpdateLastRead) {
      handleUpdateLastRead();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  React.useEffect(() => {
    if (!isLoadMorePagination) return;

    setCurrentPage(parseInt(pageParams?.page || pagesOffset?.current_page, 10));
  }, [isLoadMorePagination, pageParams?.page, pagesOffset?.current_page]);

  React.useEffect(() => {
    if (
      (initialized && isLoadMoreScroll && !loading && loadMore && !ended) ||
      refreshing
    ) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, refreshing]);

  if (!startItemViews.length && !ItemView) return null;

  if (!gridItemProps.xs) {
    gridItemProps.xs = 12;
  }

  if (error) {
    if (errorPage === 'hide') return null;

    const message =
      get(error, 'response.data.error') || get(error, 'response.data.message');

    const errorName =
      get(error, 'response.status') === 403
        ? 'core.block.error403'
        : 'core.block.error404';
    const ErrorBlock = jsxBackend.get(errorName);

    return <ErrorBlock title={message} />;
  }

  if ((!data.length && ended) || error) {
    if (emptyPage === 'hide') return null;

    const NoResultsBlock = jsxBackend.get(emptyPage);

    const { noBlock, contentStyle } = emptyPageProps || {};

    if (noBlock) {
      return React.createElement(NoResultsBlock, { ...emptyPageProps });
    }

    return (
      <Block>
        <BlockHeader title={title} />
        <BlockContent {...contentStyle}>
          {React.createElement(NoResultsBlock, { ...emptyPageProps })}
        </BlockContent>
      </Block>
    );
  }

  if (!initialized) {
    if (!Skeleton) {
      return <div>{i18n.formatMessage({ id: 'loading_dots' })}</div>;
    }

    return (
      <Block>
        <BlockHeader title={title} />
        <BlockContent>
          <Grid container {...gridContainerProps}>
            {range(0, limit).map(index => (
              <Skeleton
                wrapAs={Grid}
                wrapProps={gridItemProps}
                itemProps={itemProps}
                key={index.toString()}
              />
            ))}
          </Grid>
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block>
      {titleBackend ? (
        <BlockHeader title={pagesOffset?.title} />
      ) : (
        <BlockHeader title={title} />
      )}

      <BlockContent>
        {isLoadMorePagination ? (
          <Pagination
            currentPage={currentPage}
            from={paging.pages[currentPage]?.from}
            to={paging.pages[currentPage]?.to}
            total={pagesOffset?.total_item || pagesOffset?.total}
            itemsPerPage={perPage}
            message={messagePagination}
            hasSort={hasSort}
            moduleName={moduleName}
            resourceName={resourceName}
            actionName={actionName}
          />
        ) : null}
        <Grid container {...gridContainerProps}>
          {isArray(startItemViews) &&
            startItemViews.map((item, idx) => {
              const Item = jsxBackend.get(item.component);

              return (
                <Item
                  key={idx}
                  itemProps={itemProps}
                  wrapAs={Grid}
                  wrapProps={gridItemProps}
                />
              );
            })}
          {isArray(data) &&
            data.map(id => (
              <ItemView
                identity={id}
                itemProps={itemProps}
                key={id.toString()}
                wrapAs={Grid}
                wrapProps={gridItemProps}
                pagingId={pagingId}
              />
            ))}
          {showLoadSmooth && Skeleton && loading
            ? range(0, isLoadMorePagination && data.length ? 1 : limit).map(
                index => (
                  <Skeleton
                    wrapAs={Grid}
                    wrapProps={gridItemProps}
                    itemProps={itemProps}
                    key={index.toString()}
                  />
                )
              )
            : null}
        </Grid>
        {isLoadMorePagination && !hasSort ? (
          <Pagination
            currentPage={currentPage}
            from={paging.pages[currentPage]?.from}
            to={paging.pages[currentPage]?.to}
            total={pagesOffset?.total_item}
            itemsPerPage={perPage}
            message={messagePagination}
          />
        ) : null}
        {isLoadMoreButton && !ended && !loading ? (
          <LoadMoreListingButton
            handleClick={triggerLoadmore}
            message={buttonMessageLoadmore}
          />
        ) : null}
      </BlockContent>
    </Block>
  );
}
