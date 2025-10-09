'use client';

import React, { useEffect, useState } from 'react'
import InfoCard from '@/app/components/dashboard/InfoCard'
import { caseInfoItem } from '@/app/utilities/Types'
import PageContainer from '../components/PageContainer'
import { 
  Calendar, 
  Package, 
  TrendingUp, 
  Crown,
  ShoppingCart,
  Plus,
  Minus,
  Gift,
  Trophy,
  Target,
  Layers,
  BarChart3,
  Wallet,
  User,
  Loader2,
  Coins,
  Award,
  Zap,
  Star
} from 'lucide-react'

type Props = {}

type CollectionItem = {
  icon: React.ReactNode;
  title: string;
  des: string;
  price: string;
  date: string;
  color: string;
};

type AchievementsItem = {
  icon: React.ReactNode;
  title: string;
  des: string;
  progress: number;
  color: string;
};

type UserData = {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role_id: number;
    status: string;
    is_verified: boolean;
    join_date: string | null;
    last_login: string | null;
    ip_address: string | null;
    country: string | null;
    two_factor_enabled: boolean;
    steamid: string | null;
    avatar: string | null;
    profile_url: string | null;
    created_at: string;
    updated_at: string;
    steam_account: any;
    details: {
      id: number;
      user_id: number;
      steam_id: string;
      balance: string;
      total_spent: string;
      total_won: string;
      inventory_value: string;
      cases_opened: number;
      level: number;
      community_visibility_state: any;
      profile_state: any;
      persona_name: any;
      comment_permission: any;
      profile_url: any;
      avatar: any;
      avatar_medium: any;
      avatar_full: any;
      avatar_hash: any;
      persona_state: any;
      real_name: any;
      primary_clan_id: any;
      time_created: any;
      persona_state_flags: any;
      country_code: any;
      state_code: any;
      city_id: any;
      community_banned: boolean;
      vac_banned: boolean;
      vac_bans: number;
      days_since_last_ban: number;
      game_bans: number;
      economy_ban: string;
      owned_games_count: number;
      friends_count: number;
      recent_games_count: number;
      last_login: string;
      created_at: string;
      updated_at: string;
    };
    role: {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
    };
  };
};

type ActivityItem = {
  type: 'case_opened' | 'item_sold' | 'deposit' | 'withdrawal' | 'trade' | 'level_up';
  title: string;
  description: string;
  amount: string;
  timestamp: string;
  color: string;
};

export default function ProfilePage({ }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        return authData.token || null;
      } catch (err) {
        console.error("Failed to parse auth data:", err);
        return null;
      }
    }
  }
  return null;
};

useEffect(() => {
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken(); // 👈 yahan se token milega
      if (!token) throw new Error("No token found");

      const response = await fetch(`${baseUrl}/api/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);


  // Generate cases info from API data
  const casesInfo: caseInfoItem[] = [
    {
      icon: <TrendingUp size={30} color="#97F506" />,
      value: `$${userData?.user.details.inventory_value || '0.00'}`,
      label: "Portfolio Value",
      color: "#97F506"
    },
    {
      icon: <Package size={30} color="#24E9FF" />,
      value: (userData?.user.details.cases_opened || 0).toString(),
      label: "Cases Opened",
      color: "#24E9FF"
    },
    {
      icon: <Crown size={30} color="#FF8809" />,
      value: (userData?.user.details.level || 1).toString(),
      label: "Current Level",
      color: "#FF8809"
    }
  ];

  // Generate recent activity based on user data
  const generateRecentActivity = (): CollectionItem[] => {
    if (!userData) return [];

    const activities: CollectionItem[] = [];
    const user = userData.user;
    const details = user.details;

    // Case opened activity
    if (details.cases_opened > 0) {
      activities.push({
        icon: <Gift size={24} color="#FF8809" />,
        title: "Case Opened",
        des: `Opened ${details.cases_opened} case${details.cases_opened > 1 ? 's' : ''}`,
        price: `+${details.total_won || '0.00'} USD`,
        date: formatActivityDate(user.updated_at),
        color: '#FF8809',
      });
    }

    // Total spent activity
    if (parseFloat(details.total_spent) > 0) {
      activities.push({
        icon: <ShoppingCart size={24} color="#39FF67" />,
        title: "Total Spent",
        des: `Amount spent on cases`,
        price: `-${details.total_spent} USD`,
        date: formatActivityDate(details.updated_at),
        color: '#FF3063',
      });
    }

    // Total won activity
    if (parseFloat(details.total_won) > 0) {
      activities.push({
        icon: <TrendingUp size={24} color="#39FF67" />,
        title: "Total Won",
        des: `Winnings from cases`,
        price: `+${details.total_won} USD`,
        date: formatActivityDate(details.updated_at),
        color: '#39FF67',
      });
    }

    // Balance activity
    if (parseFloat(details.balance) > 0) {
      activities.push({
        icon: <Wallet size={24} color="#39FF67" />,
        title: "Account Balance",
        des: `Current available balance`,
        price: `${details.balance} USD`,
        date: formatActivityDate(details.updated_at),
        color: '#39FF67',
      });
    }

    // Level up activity
    if (details.level > 1) {
      activities.push({
        icon: <Zap size={24} color="#24E9FF" />,
        title: "Level Up",
        des: `Reached level ${details.level}`,
        price: `Level ${details.level}`,
        date: formatActivityDate(details.updated_at),
        color: '#24E9FF',
      });
    }

    // Inventory value activity
    if (parseFloat(details.inventory_value) > 0) {
      activities.push({
        icon: <Coins size={24} color="#97F506" />,
        title: "Inventory Value",
        des: `Current inventory worth`,
        price: `$${details.inventory_value}`,
        date: formatActivityDate(details.updated_at),
        color: '#97F506',
      });
    }

    // Add account creation activity
    activities.push({
      icon: <User size={24} color="#8640FF" />,
      title: "Account Created",
      des: `Joined the platform`,
      price: "Welcome",
      date: formatActivityDate(user.created_at),
      color: '#8640FF',
    });

    // Sort by date (newest first) and limit to 7 activities
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  };

  // Generate achievements based on user progress
  const generateAchievements = (): AchievementsItem[] => {
    if (!userData) return [];

    const details = userData.user.details;
    const casesCount = details.cases_opened || 0;
    const level = details.level || 1;
    const totalSpent = parseFloat(details.total_spent || '0');
    const inventoryValue = parseFloat(details.inventory_value || '0');
    const totalWon = parseFloat(details.total_won || '0');

    return [
      {
        icon: <Trophy size={24} color="#D418FF" />,
        title: 'First Case',
        des: 'Open your first case',
        progress: casesCount > 0 ? 100 : 0,
        color: '#D418FF'
      },
      {
        icon: <Target size={24} color="#FF295F" />,
        title: 'Case Collector',
        des: 'Open 10 cases',
        progress: Math.min((casesCount / 10) * 100, 100),
        color: '#FF295F'
      },
      {
        icon: <Layers size={24} color="#39FF67" />,
        title: 'Inventory Builder',
        des: 'Reach $10 inventory value',
        progress: Math.min((inventoryValue / 10) * 100, 100),
        color: '#39FF67'
      },
      {
        icon: <BarChart3 size={24} color="#8640FF" />,
        title: 'Trader',
        des: 'Spend $50 total',
        progress: Math.min((totalSpent / 50) * 100, 100),
        color: '#8640FF'
      },
      {
        icon: <Crown size={24} color="#FF8809" />,
        title: 'Level Master',
        des: 'Reach level 25',
        progress: Math.min((level / 25) * 100, 100),
        color: '#FF8809'
      },
      {
        icon: <Award size={24} color="#24E9FF" />,
        title: 'Profit Maker',
        des: 'Win $25 total',
        progress: Math.min((totalWon / 25) * 100, 100),
        color: '#24E9FF'
      },
      {
        icon: <Star size={24} color="#97F506" />,
        title: 'Dedicated Player',
        des: 'Reach level 50',
        progress: Math.min((level / 50) * 100, 100),
        color: '#97F506'
      },
      {
        icon: <Zap size={24} color="#FF3063" />,
        title: 'High Roller',
        des: 'Spend $100 total',
        progress: Math.min((totalSpent / 100) * 100, 100),
        color: '#FF3063'
      }
    ];
  };

  const formatJoinDate = (dateString: string | null) => {
    if (!dateString) {
      const createdAt = userData?.user.created_at;
      if (!createdAt) return 'Join - Recently';
      
      try {
        const date = new Date(createdAt);
        return `Join - ${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
      } catch {
        return 'Join - Recently';
      }
    }
    
    try {
      const date = new Date(dateString);
      return `Join - ${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
    } catch {
      return 'Join - Recently';
    }
  };

  const formatActivityDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    } catch {
      return 'Recently';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderProfileAvatar = () => {
    const avatarUrl = userData?.user.avatar || userData?.user.details.avatar_full;
    
    if (avatarUrl && !imageError) {
      return (
        <div className="size-12 rounded-full overflow-hidden bg-white/10">
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
      );
    }

    return (
      <div className="size-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
        <User size={24} />
      </div>
    );
  };

  const calculateOverallProgress = () => {
    const achievements = generateAchievements();
    if (achievements.length === 0) return 0;
    
    const totalProgress = achievements.reduce((sum, achievement) => sum + achievement.progress, 0);
    return Math.round(totalProgress / achievements.length);
  };

  if (loading) {
    return (
      <PageContainer className='max-w-380'>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-white" />
            <p className="text-white/70">Loading profile data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer className='max-w-380'>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading profile</p>
            <p className="text-white/70 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!userData) {
    return (
      <PageContainer className='max-w-380'>
        <div className="flex items-center justify-center h-64">
          <p className="text-white/70">No user data found</p>
        </div>
      </PageContainer>
    );
  }

  const recentActivity = generateRecentActivity();
  const achievements = generateAchievements();
  const completedAchievements = achievements.filter(a => a.progress === 100).length;
  const overallProgress = calculateOverallProgress();

  return (
    <PageContainer className='max-w-380'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        <div className="md:col-span-2">
          <div className="relative z-1 overflow-hidden flex items-center justify-between gap-5 rounded-[20px] p-4 md:p-5 lg:p-6 md:!pr-16.5 bg-[#66697C]/5 border border-white/8">
            <div className="">
              {renderProfileAvatar()}
              <h4 className='text-lg md:text-xl lg:text-2xl my-1 md:my-2'>
                {userData.user.name || 'User'}
              </h4>
              <div className="flex items-center gap-2 md:gap-4">
                <Calendar size={20} color="rgba(255,255,255,0.5)" />
                <span className='text-xs md:text-sm'>
                  {formatJoinDate(userData.user.join_date || null)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="">
                <p className='text-base lg:text-lg xl:text-xl text-white mb-1.5 font-bold !leading-[1]'>
                  {userData.user.details?.balance || '0.00'} USD
                </p>
                <p className='text-sm text-white/50 font-normal !leading-[120%]'>Account Balance</p>
              </div>
              <div className="">
                <p className='text-base lg:text-lg xl:text-xl text-[#39FF67] mb-1.5 font-bold !leading-[1]'>
                  {userData.user.details?.inventory_value || '0.00'} CC
                </p>
                <p className='text-sm text-white/50 font-normal !leading-[120%]'>Portfolio Value</p>
              </div>
            </div>
            <div className='absolute -z-1 -bottom-20 -left-20 w-81 h-49 rounded-[100%] bg-[linear-gradient(159deg,#FCC811_20.64%,#F85D36_48.42%,#EF5180_63.84%,#4B71FF_92.19%,#34DDFF_106.02%)] blur-[107px] pointer-events-none' />
            <div className='absolute -z-1 -top-11 -right-16 w-81 h-49 rounded-[100%] bg-[linear-gradient(255deg,#FCC811_-7.98%,#F85D36_18.12%,#EF5180_32.61%,#4B71FF_59.25%,#34DDFF_72.25%)] blur-[107px] pointer-events-none' />
          </div>
          
          <h4 className='text-lg md:text-xl lg:text-2xl my-3 md:my-5 pt-1'>Statistics Overview</h4>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {casesInfo.map((info, index) => (
              <InfoCard 
                key={index} 
                labelClass='justify-center md:justify-between' 
                icon={info.icon} 
                value={info.value} 
                label={info.label} 
                color={info.color} 
              />
            ))}
          </div>
          
          <h4 className='text-lg md:text-xl lg:text-2xl my-5 pt-1'>Recent Activity</h4>
          <div className="xl:max-h-[calc(100vh-580px)] overflow-y-auto">
            <div className="w-max min-w-full">
              {recentActivity.map((item, index) => (
                <div key={index} className='flex items-center justify-between gap-6 border-y border-white/8 py-3'>
                  <div className="flex items-center gap-3 md:gap-5">
                    <div 
                      className="size-11 p-3 md:p-0 md:size-12.5 rounded-2xl flex items-center justify-center bg-[#66697C]/10 backdrop-blur-[1px]"
                      style={{ border: `1px solid ${item.color}20` }}
                    >
                      {item.icon}
                    </div>
                    <div className="">
                      <h5 className='text-sm md:text-base text-white font-bold !leading-[1] mb-1 md:mb-2'>
                        {item.title}
                      </h5>
                      <p className='text-xs md:text-sm text-white/50 font-medium'>
                        {item.des}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p 
                      className='text-base lg:text-lg mb-2.5 font-medium !leading-[1]' 
                      style={{ color: item.color }}
                    >
                      {item.price}
                    </p>
                    <p className='text-xs text-white/50 font-normal !leading-[120%]'>
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h4 className='text-lg lg:text-xl xl:text-2xl'>Achievements</h4>
            <span className='font-light block'>{completedAchievements}/{achievements.length} Completed</span>
          </div>
          <div className="flex flex-col gap-3 xl:max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className='bg-[#66697c]/5 border border-white/8 rounded-[20px] p-4 lg:p-5 xl:p-6'>
              <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <h5 className='text-base text-white font-bold !leading-[1] mb-2'>Overall Progress</h5>
                <p>{overallProgress}%</p>
              </div>
              <div className="mt-4">
                <p className='text-right text-xs text-white font-medium !leading-[1] mb-3'>{overallProgress}%</p>
                <div className="w-full h-3 lg:h-4 xl:h-5 rounded-[22px] bg-white/8 relative z-1">
                  <div 
                    className='absolute top-0 left-0 rounded-[22px] h-full z-2 transition-all duration-300' 
                    style={{ width: `${overallProgress}%`, backgroundColor: "#35CBCD" }} 
                  />
                </div>
              </div>
            </div>
            {achievements.map((item, index) => (
              <div 
                className='bg-[#66697c]/5 border border-white/8 rounded-[20px] p-4 lg:p-5 xl:p-6 hover:bg-[#66697c]/10 transition-colors duration-200' 
                key={index}
              >
                <div className="flex items-center gap-4 lg:gap-5">
                  <div 
                    className="size-11.5 p-3 md:p-0 md:size-12.5 rounded-2xl flex items-center justify-center bg-[#66697C]/10 backdrop-blur-[1px]"
                    style={{ border: `1px solid ${item.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className='text-base text-white font-bold !leading-[1] mb-2 truncate'>
                      {item.title}
                    </h5>
                    <p className='text-sm text-white/50 font-medium truncate'>
                      {item.des}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className='text-right text-xs text-white font-medium !leading-[1] mb-3'>
                    {item.progress}%
                  </p>
                  <div className="w-full h-3 lg:h-4 xl:h-5 rounded-[22px] bg-white/8 relative z-1">
                    <div 
                      className='absolute top-0 left-0 rounded-[22px] h-full z-2 transition-all duration-300' 
                      style={{ width: `${item.progress}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}