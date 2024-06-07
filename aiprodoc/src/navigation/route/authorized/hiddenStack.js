import DocumentDetail from '../../../screens/documentDetail';
import DocumentDetailHeader from '../../../screens/documentDetail/header';
import VisibleTabBottomLayout from '../../../_layout/visibleTabBTLayout';

export default [
  {
    key: '1',
    name: 'Dashboard',
    component: VisibleTabBottomLayout,
    options: {},
  },
  {
    key: '2',
    name: 'Document Detail',
    component: DocumentDetail,
    options: {header: DocumentDetailHeader},
  },
];
