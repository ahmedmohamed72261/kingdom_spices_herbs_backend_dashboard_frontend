'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  CubeIcon, 
  AcademicCapIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon,
  TagIcon,
  InboxIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    categories: 0,
    certificates: 0,
    team: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard overview data from backend
      const response = await api.get('/dashboard/overview');
      const { stats: backendStats, recentActivities: backendActivities, systemStatus } = response.data.data;

      // Set stats from backend
      setStats({
        categories: backendStats.categories.count,
        certificates: backendStats.certificates.count,
        team: backendStats.team.count,
        messages: backendStats.messages.count,
        unreadMessages: backendStats.unreadMessages.count,
        products: backendStats.products.count,
        contactMethods: backendStats.contactMethods.count
      });

      // Map backend activities to frontend format with icons
      const activitiesWithIcons = backendActivities.map(activity => {
        let icon, color;
        switch (activity.type) {
          case 'category':
            icon = TagIcon;
            color = 'text-green-600';
            break;
          case 'product':
            icon = CubeIcon;
            color = 'text-blue-600';
            break;
          case 'certificate':
            icon = AcademicCapIcon;
            color = 'text-purple-600';
            break;
          case 'team':
            icon = UsersIcon;
            color = 'text-orange-600';
            break;
          case 'message':
            icon = InboxIcon;
            color = 'text-red-600';
            break;
          default:
            icon = ChatBubbleLeftRightIcon;
            color = 'text-gray-600';
        }
        return {
          ...activity,
          icon,
          color
        };
      });

      setRecentActivities(activitiesWithIcons);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to basic data if API fails
      setStats({
        categories: 0,
        certificates: 0,
        team: 0,
        messages: 0,
        unreadMessages: 0,
        products: 0,
        contactMethods: 0
      });
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      name: 'Categories',
      value: stats.categories,
      icon: TagIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      change: '+2',
      changeType: 'increase',
      href: '/dashboard/categories'
    },
    {
      name: 'Products',
      value: stats.products,
      icon: CubeIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: '+5',
      changeType: 'increase',
      href: '/dashboard/products'
    },
    {
      name: 'Certificates',
      value: stats.certificates,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: '+1',
      changeType: 'increase',
      href: '/dashboard/certificates'
    },
    {
      name: 'Team Members',
      value: stats.team,
      icon: UsersIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      change: '+1',
      changeType: 'increase',
      href: '/dashboard/team'
    },
    {
      name: 'Total Messages',
      value: stats.messages,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      change: '+3',
      changeType: 'increase',
      href: '/dashboard/messages'
    },
    {
      name: 'Unread Messages',
      value: stats.unreadMessages,
      icon: InboxIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      change: '+2',
      changeType: 'increase',
      href: '/dashboard/messages'
    }
  ];

  const quickActions = [
    {
      name: 'Add Category',
      href: '/dashboard/categories',
      icon: TagIcon,
      color: 'hover:border-green-500 hover:bg-green-50',
      iconColor: 'group-hover:text-green-500'
    },
    {
      name: 'Add Product',
      href: '/dashboard/products',
      icon: CubeIcon,
      color: 'hover:border-blue-500 hover:bg-blue-50',
      iconColor: 'group-hover:text-blue-500'
    },
    {
      name: 'Add Certificate',
      href: '/dashboard/certificates',
      icon: AcademicCapIcon,
      color: 'hover:border-purple-500 hover:bg-purple-50',
      iconColor: 'group-hover:text-purple-500'
    },
    {
      name: 'Add Team Member',
      href: '/dashboard/team',
      icon: UsersIcon,
      color: 'hover:border-orange-500 hover:bg-orange-50',
      iconColor: 'group-hover:text-orange-500'
    },
    {
      name: 'View Messages',
      href: '/dashboard/messages',
      icon: InboxIcon,
      color: 'hover:border-red-500 hover:bg-red-50',
      iconColor: 'group-hover:text-red-500'
    },
    {
      name: 'Contact Settings',
      href: '/dashboard/contact',
      icon: ChatBubbleLeftRightIcon,
      color: 'hover:border-indigo-500 hover:bg-indigo-50',
      iconColor: 'group-hover:text-indigo-500'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, Administrator!</h1>
              <p className="text-green-100 text-sm sm:text-base">Here&apos;s what&apos;s happening with your herbs business today.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-green-100 text-sm">Last login</p>
              <p className="text-white font-semibold text-sm sm:text-base">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statsCards.map((stat, index) => (
            <a
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors truncate">{stat.name}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1 hidden sm:inline">from last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ml-3`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className={`group p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 ${action.color}`}
              >
                <action.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 transition-colors duration-200 ${action.iconColor}`} />
                <p className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-800 text-center transition-colors duration-200 leading-tight">
                  {action.name}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activities and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-gray-600 text-sm mt-1">Latest updates and changes in your system</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
              <p className="text-gray-600 text-sm mt-1">Current system health and performance</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Database Connection</p>
                      <p className="text-xs text-gray-500">All systems operational</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">API Services</p>
                      <p className="text-xs text-gray-500">Response time: 120ms</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                    Healthy
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <ClockIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Backup Status</p>
                      <p className="text-xs text-gray-500">Last backup: 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0">
                    Scheduled
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Performance</p>
                      <p className="text-xs text-gray-500">System running optimally</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex-shrink-0">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Herbs Dashboard</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Professional management system for herbs and natural products business
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <span>Version 1.0.0</span>
              <span className="hidden sm:inline">•</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
              <span className="hidden sm:inline">•</span>
              <span className="break-all">Admin: {user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}