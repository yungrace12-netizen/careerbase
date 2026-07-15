import {
  Archive,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  FileStack,
  LucideIcon,
  Settings,
  UserRound,
  UsersRound,
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const desktopNavigationItems: NavigationItem[] = [
  {
    label: '캘린더',
    href: '/',
    icon: CalendarDays,
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Applications',
    href: '/applications',
    icon: FileStack,
  },
  {
    label: 'Interview',
    href: '/interview',
    icon: UsersRound,
  },
  {
    label: 'Experience',
    href: '/experience',
    icon: BookOpenText,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
  },
  {
    label: 'Archive',
    href: '/archive',
    icon: Archive,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const mobilePrimaryNavigationItems: NavigationItem[] = [
  {
    label: '캘린더',
    href: '/',
    icon: CalendarDays,
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
  },
];

export const mobileMoreNavigationItems: NavigationItem[] = [
  {
    label: 'Applications',
    href: '/applications',
    icon: FileStack,
  },
  {
    label: 'Interview',
    href: '/interview',
    icon: UsersRound,
  },
  {
    label: 'Experience',
    href: '/experience',
    icon: BookOpenText,
  },
  {
    label: 'Archive',
    href: '/archive',
    icon: Archive,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function getCurrentNavigationItem(pathname: string): NavigationItem {
  return (
    desktopNavigationItems.find((item) => {
      if (item.href === '/') {
        return pathname === '/';
      }

      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }) ?? desktopNavigationItems[0]
  );
}

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
