import { atom } from 'recoil';

export const footerVisibleAtom = atom({
  key: 'showFooter',
  default: true,
});

export const navigationSidebarAtom = atom({
  key: 'showNavigationSidebar',
  default: false,
});

export const navigationBarVisibleAtom = atom({
  key: 'showNavigationBar',
  default: true,
});

export const navigationSidebarComponentKeyAtom = atom({
  key: 'navigationSidebarComponentKeyAtom',
  default: false,
});
