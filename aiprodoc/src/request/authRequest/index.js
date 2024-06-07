import axios from 'axios';
import {BASE_URL} from '../../utilities/constant';
import {logout, showLoginError} from '../../redux/slices/userSlice';
import store from '../../redux';

const dispatch = store.dispatch;

// const axios_auth = token =>
//   axios.create({
//     baseURL: BASE_URL,
//     headers: {Authorization: `Token ${token}`},
//   });

// export default axios_auth;

const handleError = err => {
  if (err.response) {
    if (axios.isCancel(err)) return;
    switch (err.response.status) {
      case 401:
      case 403: {
        dispatch(
          showLoginError('Something has gone wrong, please login again'),
        );
        dispatch(logout());
        break;
      }
      default:
        throw err;
    }
  }
  if (err.request) {
    throw err;
  }
};

export default {
  get: function ({url, userConfig, userToken}) {
    const token = store.getState().user.token;
    let config = {
      baseURL: BASE_URL,
      headers: {Authorization: `Token ${userToken ? userToken : token}`},
    };
    if (userConfig) config = {...config, ...userConfig};
    return axios
      .get(url, config)
      .then(res => res)
      .catch(error => {
        handleError(error);
      });
  },
  post: function ({url, data, userConfig, userToken}) {
    const token = store.getState().user.token;
    let config = {
      baseURL: BASE_URL,
      headers: {Authorization: `Token ${userToken ? userToken : token}`},
    };
    if (userConfig) config = {...config, ...userConfig};
    return axios
      .post(url, data, config)
      .then(res => res)
      .catch(error => {
        handleError(error);
      });
  },
  put: function ({url, data, userConfig, userToken}) {
    const token = store.getState().user.token;
    let config = {
      baseURL: BASE_URL,
      headers: {Authorization: `Token ${userToken ? userToken : token}`},
    };
    if (userConfig) config = {...config, ...userConfig};
    return axios
      .put(url, data, config)
      .then(res => res)
      .catch(error => {
        handleError(error);
      });
  },
  patch: function ({url, data, userConfig, userToken}) {
    const token = store.getState().user.token;
    let config = {
      baseURL: BASE_URL,
      headers: {Authorization: `Token ${userToken ? userToken : token}`},
    };
    if (userConfig) config = {...config, ...userConfig};

    return axios
      .patch(url, data, config)
      .then(res => res)
      .catch(error => {
        handleError(error);
      });
  },
  delete: function ({url, data, userConfig, userToken}) {
    const token = store.getState().user.token;
    let config = {
      baseURL: BASE_URL,
      headers: {Authorization: `Token ${userToken ? userToken : token}`},
      data,
    };
    if (userConfig) config = {...config, ...userConfig};
    return axios
      .delete(url, config)
      .then(res => res)
      .catch(error => {
        handleError(error);
      });
  },
};
