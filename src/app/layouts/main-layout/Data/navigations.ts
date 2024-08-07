export const navigations: any[] = [
  {
    navName: 'Dashboard',
    navLink: '/dashboard',
    icon: 'fas fa-tachometer-alt',
  },
  {
    navName: 'Menu',
    navLink: '/menu',
    icon: 'fas fa-utensils',
  },
  {
    navName: 'Orders',
    navLink: '/orders',
    icon: 'fas fa-clipboard-list',
  },
  {
    navName: 'Inventory',
    navLink: '/stock',
    icon: 'fas fa-boxes',
    hasDropdown: true,
    sublinks: [
      {
        navName: 'Update Stock',
        navLink: '/admin/purchase',
      },
      {
        navName: 'Transfer Stock',
        navLink: '/admin/stock_transfer',
      },
    ],
  },
  {
    navName: 'Recipes',
    navLink: '/stock',
    icon: 'fas fa-boxes',
    hasDropdown: true,
    sublinks: [
      {
        navName: 'Ingredients',
        navLink: '/admin/ingredients',
      },
      {
        navName: 'Recipes',
        navLink: '/admin/Recipe',
      },
      {
        navName: 'Ingredients Request',
        navLink: '/admin/ingredients-request',
      },
    ],
  },
  {
    navName: 'Setting',
    navLink: '/setting',
    icon: 'fas fa-cog',
    hasDropdown: true,
    sublinks: [
      {
        navName: 'Shifts',
        navLink: '/shifts',
      },
      {
        navName: 'Tables',
        navLink: '/tables',
      },
    ],
  },
  {
    navName: 'Reports',
    icon: 'fas fa-chart-bar',
    hasDropdown: true,
    sublinks: [
      {
        navName: 'Income Report',
        navLink: '/income_reports',
      },
      {
        navName: 'Sales Report',
        navLink: '/sales_reports',
      },
      {
        navName: 'Purchases Report',
        navLink: '/inventory_reports',
      },
      {
        navName: 'Stock Transfer Report',
        navLink: '/admin/stock_transfer_report',
      },
      {
        navName: 'Credit Sales Report',
        navLink: '/credit_sales_report',
      },
      {
        navName: 'Recipes Report',
        navLink: '/recipe-report',
      },
    ],
  },
  {
    navName: 'Admin',
    navLink: '/admin/dashboard',
    icon: 'fas fa-user-shield',
  },
];
