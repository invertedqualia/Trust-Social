import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatus } from './importer';

export const REBLOG_REQUEST = 'REBLOG_REQUEST';
export const REBLOG_SUCCESS = 'REBLOG_SUCCESS';
export const REBLOG_FAIL    = 'REBLOG_FAIL';

export const REBLOGS_EXPAND_REQUEST = 'REBLOGS_EXPAND_REQUEST';
export const REBLOGS_EXPAND_SUCCESS = 'REBLOGS_EXPAND_SUCCESS';
export const REBLOGS_EXPAND_FAIL = 'REBLOGS_EXPAND_FAIL';

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
export const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
export const FAVOURITE_FAIL    = 'FAVOURITE_FAIL';

export const UNREBLOG_REQUEST = 'UNREBLOG_REQUEST';
export const UNREBLOG_SUCCESS = 'UNREBLOG_SUCCESS';
export const UNREBLOG_FAIL    = 'UNREBLOG_FAIL';

export const UNFAVOURITE_REQUEST = 'UNFAVOURITE_REQUEST';
export const UNFAVOURITE_SUCCESS = 'UNFAVOURITE_SUCCESS';
export const UNFAVOURITE_FAIL    = 'UNFAVOURITE_FAIL';

export const REBLOGS_FETCH_REQUEST = 'REBLOGS_FETCH_REQUEST';
export const REBLOGS_FETCH_SUCCESS = 'REBLOGS_FETCH_SUCCESS';
export const REBLOGS_FETCH_FAIL    = 'REBLOGS_FETCH_FAIL';

export const FAVOURITES_FETCH_REQUEST = 'FAVOURITES_FETCH_REQUEST';
export const FAVOURITES_FETCH_SUCCESS = 'FAVOURITES_FETCH_SUCCESS';
export const FAVOURITES_FETCH_FAIL    = 'FAVOURITES_FETCH_FAIL';

export const FAVOURITES_EXPAND_REQUEST = 'FAVOURITES_EXPAND_REQUEST';
export const FAVOURITES_EXPAND_SUCCESS = 'FAVOURITES_EXPAND_SUCCESS';
export const FAVOURITES_EXPAND_FAIL = 'FAVOURITES_EXPAND_FAIL';

export const PIN_REQUEST = 'PIN_REQUEST';
export const PIN_SUCCESS = 'PIN_SUCCESS';
export const PIN_FAIL    = 'PIN_FAIL';

export const UNPIN_REQUEST = 'UNPIN_REQUEST';
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
export const UNPIN_FAIL    = 'UNPIN_FAIL';

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
export const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
export const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

export const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
export const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

export const LIKE_REQUEST = 'LIKE_REQUEST';
export const LIKE_SUCCESS = 'LIKE_SUCCESS';
export const LIKE_FAIL = 'LIKE_FAIL';

export const UNLIKE_REQUEST = 'UNLIKE_REQUEST';
export const UNLIKE_SUCCESS = 'UNLIKE_SUCCESS';
export const UNLIKE_FAIL = 'UNLIKE_FAIL';

export const DISLIKE_REQUEST = 'DISLIKE_REQUEST';
export const DISLIKE_SUCCESS = 'DISLIKE_SUCCESS';
export const DISLIKE_FAIL = 'DISLIKE_FAIL';

export const UNDISLIKE_REQUEST = 'UNDISLIKE_REQUEST';
export const UNDISLIKE_SUCCESS = 'UNDISLIKE_SUCCESS';
export const UNDISLIKE_FAIL = 'UNDISLIKE_FAIL';

export const TRUST_REQUEST = 'TRUST_REQUEST';
export const TRUST_SUCCESS = 'TRUST_SUCCESS';
export const TRUST_FAIL = 'TRUST_FAIL';

export const UNTRUST_REQUEST = 'UNTRUST_REQUEST';
export const UNTRUST_SUCCESS = 'UNTRUST_SUCCESS';
export const UNTRUST_FAIL = 'UNTRUST_FAIL';

export const DISTRUST_REQUEST = 'DISTRUST_REQUEST';
export const DISTRUST_SUCCESS = 'DISTRUST_SUCCESS';
export const DISTRUST_FAIL = 'DISTRUST_FAIL';

export const UNDISTRUST_REQUEST = 'UNDISTRUST_REQUEST';
export const UNDISTRUST_SUCCESS = 'UNDISTRUST_SUCCESS';
export const UNDISTRUST_FAIL = 'UNDISTRUST_FAIL';

export function reblog(status, visibility) {
  return function (dispatch, getState) {
    dispatch(reblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`, { visibility }).then(function (response) {
      // The reblog API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.reblog));
      dispatch(reblogSuccess(status));
    }).catch(function (error) {
      dispatch(reblogFail(status, error));
    });
  };
}

export function unreblog(status) {
  return (dispatch, getState) => {
    dispatch(unreblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unreblogSuccess(status));
    }).catch(error => {
      dispatch(unreblogFail(status, error));
    });
  };
}

export function reblogRequest(status) {
  return {
    type: REBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function reblogSuccess(status) {
  return {
    type: REBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function reblogFail(status, error) {
  return {
    type: REBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unreblogRequest(status) {
  return {
    type: UNREBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unreblogSuccess(status) {
  return {
    type: UNREBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unreblogFail(status, error) {
  return {
    type: UNREBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function favourite(status) {
  return function (dispatch, getState) {
    dispatch(favouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(favouriteSuccess(status));
    }).catch(function (error) {
      dispatch(favouriteFail(status, error));
    });
  };
}

export function unfavourite(status) {
  return (dispatch, getState) => {
    dispatch(unfavouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unfavouriteSuccess(status));
    }).catch(error => {
      dispatch(unfavouriteFail(status, error));
    });
  };
}

export function favouriteRequest(status) {
  return {
    type: FAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function favouriteSuccess(status) {
  return {
    type: FAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function favouriteFail(status, error) {
  return {
    type: FAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unfavouriteRequest(status) {
  return {
    type: UNFAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteSuccess(status) {
  return {
    type: UNFAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteFail(status, error) {
  return {
    type: UNFAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function bookmark(status) {
  return function (dispatch, getState) {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(bookmarkFail(status, error));
    });
  };
}

export function unbookmark(status) {
  return (dispatch, getState) => {
    dispatch(unbookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };
}

export function bookmarkRequest(status) {
  return {
    type: BOOKMARK_REQUEST,
    status: status,
  };
}

export function bookmarkSuccess(status, response) {
  return {
    type: BOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function bookmarkFail(status, error) {
  return {
    type: BOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function unbookmarkRequest(status) {
  return {
    type: UNBOOKMARK_REQUEST,
    status: status,
  };
}

export function unbookmarkSuccess(status, response) {
  return {
    type: UNBOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function unbookmarkFail(status, error) {
  return {
    type: UNBOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function like(status) {
  return function (dispatch, getState) {
    dispatch(likeRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/like`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(likeSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(likeFail(status, error));
    });
  };
}

export function unlike(status) {
  return function (dispatch, getState) {
    dispatch(unlikeRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unlike`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(unlikeSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(unlikeFail(status, error));
    });
  };
}



export function likeRequest(status) {
  return {
    type: LIKE_REQUEST,
    status: status,
  };
}

export function likeSuccess(status, response) {
  return {
    type: LIKE_SUCCESS,
    status: status,
    response: response,
  };
}

export function likeFail(status, error) {
  return {
    type: LIKE_FAIL,
    status: status,
    error: error,
  };
}

export function unlikeRequest(status) {
  return {
    type: UNLIKE_REQUEST,
    status: status,
  };
}

export function unlikeSuccess(status, response) {
  return {
    type: UNLIKE_SUCCESS,
    status: status,
    response: response,
  };
}

export function unlikeFail(status, error) {
  return {
    type: UNLIKE_FAIL,
    status: status,
    error: error,
  };
}



export function dislike(status) {
  return function (dispatch, getState) {
    dispatch(dislikeRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/dislike`).then(function (response) {
    // api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      // const testData = {...response.data, ...{ disliked: true }};
      dispatch(importFetchedStatus(response.data));
      dispatch(dislikeSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(dislikeFail(status, error));
    });
  };
}

export function undislike(status) {
  return function (dispatch, getState) {
    dispatch(undislikeRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/undislike`).then(function (response) {
    // api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      // const testData = {...response.data, ...{ disliked: false }};
      dispatch(importFetchedStatus(response.data));
      dispatch(undislikeSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(undislikeFail(status, error));
    });
  };
}

export function dislikeRequest(status) {
  return {
    type: DISLIKE_REQUEST,
    status: status,
  };
}

export function dislikeSuccess(status, response) {
  return {
    type: DISLIKE_SUCCESS,
    status: status,
    response: response,
  };
}

export function dislikeFail(status, error) {
  return {
    type: DISLIKE_FAIL,
    status: status,
    error: error,
  };
}

export function undislikeRequest(status) {
  return {
    type: UNDISLIKE_REQUEST,
    status: status,
  };
}

export function undislikeSuccess(status, response) {
  return {
    type: UNDISLIKE_SUCCESS,
    status: status,
    response: response,
  };
}

export function undislikeFail(status, error) {
  return {
    type: UNDISLIKE_FAIL,
    status: status,
    error: error,
  };
}

export function fetchReblogs(id) {
  return (dispatch, getState) => {
    dispatch(fetchReblogsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchReblogsFail(id, error));
    });
  };
}

export function fetchReblogsRequest(id) {
  return {
    type: REBLOGS_FETCH_REQUEST,
    id,
  };
}

export function fetchReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchReblogsFail(id, error) {
  return {
    type: REBLOGS_FETCH_FAIL,
    id,
    error,
  };
}

export function expandReblogs(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'reblogged_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandReblogsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandReblogsFail(id, error)));
  };
}

export function expandReblogsRequest(id) {
  return {
    type: REBLOGS_EXPAND_REQUEST,
    id,
  };
}

export function expandReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandReblogsFail(id, error) {
  return {
    type: REBLOGS_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchFavourites(id) {
  return (dispatch, getState) => {
    dispatch(fetchFavouritesRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFavouritesFail(id, error));
    });
  };
}

export function fetchFavouritesRequest(id) {
  return {
    type: FAVOURITES_FETCH_REQUEST,
    id,
  };
}

export function fetchFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchFavouritesFail(id, error) {
  return {
    type: FAVOURITES_FETCH_FAIL,
    id,
    error,
  };
}

export function expandFavourites(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'favourited_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandFavouritesRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandFavouritesFail(id, error)));
  };
}

export function expandFavouritesRequest(id) {
  return {
    type: FAVOURITES_EXPAND_REQUEST,
    id,
  };
}

export function expandFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandFavouritesFail(id, error) {
  return {
    type: FAVOURITES_EXPAND_FAIL,
    id,
    error,
  };
}

export function pin(status) {
  return (dispatch, getState) => {
    dispatch(pinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };
}

export function pinRequest(status) {
  return {
    type: PIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function pinSuccess(status) {
  return {
    type: PIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function pinFail(status, error) {
  return {
    type: PIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function unpin (status) {
  return (dispatch, getState) => {
    dispatch(unpinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };
}

export function unpinRequest(status) {
  return {
    type: UNPIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function unpinSuccess(status) {
  return {
    type: UNPIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function unpinFail(status, error) {
  return {
    type: UNPIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function trust(status) {
  return function (dispatch, getState) {
    dispatch(trustRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/trust`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(trustSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(trustFail(status, error));
    });
  };
}

export function untrust(status) {
  return function (dispatch, getState) {
    dispatch(untrustRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/untrust`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(untrustSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(untrustFail(status, error));
    });
  };
}

export function trustRequest(status) {
  return {
    type: TRUST_REQUEST,
    status: status,
  };
}

export function trustSuccess(status, response) {
  return {
    type: TRUST_SUCCESS,
    status: status,
    response: response,
  };
}

export function trustFail(status, error) {
  return {
    type: TRUST_FAIL,
    status: status,
    error: error,
  };
}

export function untrustRequest(status) {
  return {
    type: UNTRUST_REQUEST,
    status: status,
  };
}

export function untrustSuccess(status, response) {
  return {
    type: UNTRUST_SUCCESS,
    status: status,
    response: response,
  };
}

export function untrustFail(status, error) {
  return {
    type: UNTRUST_FAIL,
    status: status,
    error: error,
  };
}

export function distrust(status) {
  return function (dispatch, getState) {
    dispatch(distrustRequest(status));
    api(getState).post(`/api/v1/statuses/${status.get('id')}/distrust`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(distrustSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(distrustFail(status, error));
    });
  };
}

export function undistrust(status) {
  return function (dispatch, getState) {
    dispatch(undistrustRequest(status));
    api(getState).post(`/api/v1/statuses/${status.get('id')}/undistrust`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(undistrustSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(undistrustFail(status, error));
    });
  };
}

export function distrustRequest(status) {
  return {
    type: DISTRUST_REQUEST,
    status: status,
  };
}

export function distrustSuccess(status, response) {
  return {
    type: DISTRUST_SUCCESS,
    status: status,
    response: response,
  };
}

export function distrustFail(status, error) {
  return {
    type: DISTRUST_FAIL,
    status: status,
    error: error,
  };
}

export function undistrustRequest(status) {
  return {
    type: UNDISTRUST_REQUEST,
    status: status,
  };
}

export function undistrustSuccess(status, response) {
  return {
    type: UNDISTRUST_SUCCESS,
    status: status,
    response: response,
  };
}

export function undistrustFail(status, error) {
  return {
    type: UNDISTRUST_FAIL,
    status: status,
    error: error,
  };
}
