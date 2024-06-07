import axios from 'axios';
import {BASE_URL} from '../../utilities/constant';

// normal request non-authentication token
const axios_base = () =>
  axios.create({
    baseURL: BASE_URL,
  });
export default axios_base;
