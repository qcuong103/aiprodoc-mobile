import Home from '../../../screens/home';
import DocumentAll from '../../../screens/documentAll';
import UserDetail from '../../../screens/userDetail';
import DocumentSearch from '../../../screens/documentSearch';

export default [
  {
    key: '1',
    name: 'Home',
    component: Home,
    options: {},
    iconName: 'home',
  },
  {
    key: '2',
    name: 'Document Search',
    component: DocumentSearch,
    options: {},
    iconName: 'search',
  },
  {
    key: '3',
    name: 'Document List',
    component: DocumentAll,
    options: {},
    iconName: 'list-alt',
  },
  {
    key: '4',
    name: 'User Detail',
    component: UserDetail,
    options: {},
    iconName: 'user',
  },
];
