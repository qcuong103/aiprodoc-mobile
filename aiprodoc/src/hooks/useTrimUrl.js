import {BASE_URL} from '../utilities/constant';

// trym url base url
const useTrimUrl = url => {
  if (url) return url.replace(BASE_URL, '');
  return null;
};

export default useTrimUrl;
