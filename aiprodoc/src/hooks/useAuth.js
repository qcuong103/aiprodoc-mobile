import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

// check token hook
const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);

  const user = useSelector(state => state.user); // select from redux state

  useEffect(() => {
    if (user.token.length && user.loading === false) {
      // if done loading and user already have token
      setIsAuth(true);
      return;
    }
    // if not
    setIsAuth(false);
  }, [user]);

  return isAuth;
};

export default useAuth;
