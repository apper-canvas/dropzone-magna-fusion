import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: DashboardPage
  }
};

export const routeArray = Object.values(routes);