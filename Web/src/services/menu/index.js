import general from 'utils/general'
import { Home2 } from 'iconsax-react';

export default async function getMenuData() {

  var menu = []
  menu.push({
    title: 'Dashboard',
    key: 'dashboard/alpha',
    url: '/dashboard/alpha',
    Icon: Home2,
  });

  return menu
}
