import { History, Settings2, Users2 } from 'lucide-react';
import React, { ReactElement } from 'react';

export const enum PAGES {
  PLAYER_HISTORY,
  PLAYER_LIST,
  PREFERENCES,
}

interface MenuItem {
  titleKey: string;
  icon: ReactElement;
  page: PAGES;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    titleKey: 'PLAYERLIST',
    icon: <Users2 />,
    page: PAGES.PLAYER_LIST,
  },
  {
    titleKey: 'PLAYERHISTORY',
    icon: <History />,
    page: PAGES.PLAYER_HISTORY,
  },
  {
    titleKey: 'PREFERENCES',
    icon: <Settings2 />,
    page: PAGES.PREFERENCES,
  },
];
