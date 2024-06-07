import {createSlice} from '@reduxjs/toolkit';
import axios_auth from '../../request/authRequest';
import axios_base from '../../request/baseRequest';

const initialState = {
  data: {},
  token: '',
  error: {visible: false, message: ''},
  loading: false,
};

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (draft, action) => {
      draft.data = action.payload.data;
      draft.token = action.payload.token;
    },

    showLoginError: (draft, action) => {
      draft.error = {visible: true, message: action.payload};
    },
    dissmissLoginError: draft => {
      draft.error.visible = false;
    },
    showLoading: draft => {
      draft.loading = true;
    },
    dissmissLoading: draft => {
      draft.loading = false;
    },
    logout: draft => (draft = initialState),
  },
});

// Action creators are generated for each case reducer function
const {login, showLoading, dissmissLoading} = counterSlice.actions;
export const {logout, showLoginError, dissmissLoginError} =
  counterSlice.actions;

// async action
export const asyncLogin = payload => async (dispatch, getState) => {
  try {
    dispatch(showLoading());
    // make req to login
    const tokenRes = await axios_base().post(
      '/auth/token/obtain/?format=json',
      {username: payload.username, password: payload.password},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const token = tokenRes.data.token; // token received

    // get user data after login success
    const userDataRes = await axios_auth.get({
      url: '/users/current',
      userToken: token,
    });
    // set data
    dispatch(login({token, data: userDataRes.data}));

    // dissmiss error existed
    if (getState().user.error.visible === true) dispatch(dissmissLoginError());

    // done loading
    dispatch(dissmissLoading());
  } catch (error) {
    const res = error.response;
    let message = '';
    if (res.status === 400) message = "Username or password wasn't correct";
    if (res.status === 404)
      message = 'We are currently on maintenance, please try again later';

    // show message
    dispatch(showLoginError(message));

    // done loading
    dispatch(dissmissLoading());
  }
};

export default counterSlice.reducer;
