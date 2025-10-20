"use client"
import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthData = () => {
  if (typeof window === 'undefined') return null;
  const authData = localStorage.getItem('auth');
  return authData ? JSON.parse(authData) : null;
};

interface SupportMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  replies?: Reply[];
}

interface Reply {
  id: number;
  support_message_id: number;
  is_admin: number;
  sender_name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

interface StatsItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const InfoCard = ({ icon, value, label, color, labelClass }: StatsItem & { labelClass?: string }) => (
  <div className="bg-white/6 border border-white/10 rounded-xl p-4">
    <div className={`flex items-center gap-3 ${labelClass}`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-[#8B8898]">{label}</div>
      </div>
    </div>
  </div>
);

export default function SupportMessagesTable() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action_modal, set_action_modal] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });
  
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [messageStats, setMessageStats] = useState({
    totalMessages: 0,
    openMessages: 0,
    respondedMessages: 0,
    closedMessages: 0
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' M+';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' K+';
    return num.toString();
  };

  const statsInfo: StatsItem[] = [
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M28 22.6667V9.33333C28 8.97971 27.8595 8.64057 27.6095 8.39052C27.3594 8.14048 27.0203 8 26.6667 8H5.33333C4.97971 8 4.64057 8.14048 4.39052 8.39052C4.14048 8.64057 4 8.97971 4 9.33333V22.6667C4 23.0203 4.14048 23.3594 4.39052 23.6095C4.64057 23.8595 4.97971 24 5.33333 24H26.6667C27.0203 24 27.3594 23.8595 27.6095 23.6095C27.8595 23.3594 28 23.0203 28 22.6667Z" stroke="#24E9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 9.33301L16 17.333L4 9.33301" stroke="#24E9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>),
      value: formatNumber(messageStats.totalMessages),
      label: "Total Messages",
      color: "#24E9FF"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#FFA500" strokeWidth="2"/>
        <path d="M16 10.6667V16L19.3333 19.3333" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>),
      value: formatNumber(messageStats.openMessages),
      label: "Open",
      color: "#FFA500"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M29.3333 15.9998C29.3333 14.5871 27.6419 13.0493 25.9635 11.8735C26.3177 9.8553 26.4283 7.57145 25.4283 6.57145C24.4297 5.57145 22.1458 5.67953 20.1263 6.03629C18.9505 4.3579 17.4127 2.6665 16 2.6665C14.5872 2.6665 13.0494 4.3579 11.8737 6.03629C9.85542 5.68082 7.57027 5.57014 6.57157 6.57145C5.57157 7.57145 5.68224 9.8553 6.03641 11.8735C4.35803 13.0493 2.66663 14.5871 2.66663 15.9998C2.66663 17.4126 4.35803 18.9504 6.03641 20.1261C5.68225 22.1444 5.57157 24.4282 6.57157 25.4282C7.56897 26.4282 9.85413 26.3189 11.8737 25.9634C13.0494 27.6418 14.5872 29.3332 16 29.3332C17.4127 29.3332 18.9505 27.6418 20.1263 25.9634C22.1445 26.3201 24.4296 26.4295 25.4283 25.4282C26.4283 24.4282 26.3177 22.1444 25.9635 20.1261C27.6419 18.9504 29.3333 17.4126 29.3333 15.9998ZM21.6093 14.2758L16.276 19.6092C16.1522 19.733 16.0052 19.8312 15.8435 19.8983C15.6817 19.9653 15.5083 19.9998 15.3333 19.9998C15.1582 19.9998 14.9848 19.9653 14.823 19.8983C14.6613 19.8312 14.5143 19.733 14.3905 19.6092L11.7239 16.9425C11.4765 16.6919 11.3382 16.3537 11.3393 16.0015C11.3405 15.6494 11.4808 15.312 11.7298 15.063C11.9788 14.8141 12.3162 14.6737 12.6684 14.6726C13.0205 14.6715 13.3587 14.8097 13.6093 15.0572L15.3333 16.7812L19.724 12.3905C19.9747 12.1442 20.3126 12.0069 20.6641 12.0085C21.0156 12.0101 21.3522 12.1505 21.6008 12.399C21.8493 12.6475 21.9897 12.9842 21.9913 13.3357C21.9929 13.6872 21.8556 14.0251 21.6093 14.2758Z" fill="#97F506"/>
      </svg>),
      value: formatNumber(messageStats.respondedMessages),
      label: "Responded",
      color: "#97F506"
    },
    {
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#8B8898" strokeWidth="2"/>
        <path d="M20 12L12 20M12 12L20 20" stroke="#8B8898" strokeWidth="2" strokeLinecap="round"/>
      </svg>),
      value: formatNumber(messageStats.closedMessages),
      label: "Closed",
      color: "#8B8898"
    }
  ];

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const authData = getAuthData();
        const token = authData?.token;

        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/support-messages?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const messagesArray = responseData?.data?.data;

        if (messagesArray && Array.isArray(messagesArray)) {
          setMessages(messagesArray);
          setFilteredMessages(messagesArray);
          
          setPagination({
            currentPage: responseData.data.current_page,
            lastPage: responseData.data.last_page,
            total: responseData.data.total
          });
          
          const totalMessages = messagesArray.length;
          const openMessages = messagesArray.filter(msg => msg.status === 'open').length;
          const respondedMessages = messagesArray.filter(msg => msg.status === 'responded').length;
          const closedMessages = messagesArray.filter(msg => msg.status === 'closed').length;
          
          setMessageStats({
            totalMessages: responseData.data.total,
            openMessages,
            respondedMessages,
            closedMessages
          });
        } else {
          throw new Error("Invalid data structure");
        }

      } catch (e) {
        console.error("Error fetching messages:", e);
        setError("Failed to fetch support messages.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Filter messages based on search and status
  useEffect(() => {
    let filtered = messages;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(msg => 
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(msg => 
        msg.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredMessages(filtered);
  }, [searchQuery, statusFilter, messages]);

  // Fetch message details
  const fetchMessageDetails = async (messageId: number) => {
    try {
      const authData = getAuthData();
      const token = authData?.token;

      const response = await fetch(`${API_BASE_URL}/api/admin/support-messages/${messageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedMessage(data.data);
        setShowDetailsModal(true);
      }
    } catch (e) {
      console.error("Error fetching message details:", e);
    }
  };

  // Send reply
  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const authData = getAuthData();
      const token = authData?.token;

      const response = await fetch(`${API_BASE_URL}/api/admin/support-messages/${selectedMessage.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ message: replyText })
      });

      if (response.ok) {
        alert("Reply sent successfully!");
        setShowReplyModal(false);
        setReplyText('');
        window.location.reload();
      }
    } catch (e) {
      console.error("Error sending reply:", e);
      alert("Failed to send reply");
    }
  };

  // Update message status
  const handleUpdateStatus = async (messageId: number, newStatus: string) => {
    try {
      const authData = getAuthData();
      const token = authData?.token;

      const response = await fetch(`${API_BASE_URL}/api/admin/support-messages/${messageId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const toggleButton = (index: number) => {
    set_action_modal(action_modal === index ? null : index);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRefs.current.every(
          (ref) => ref && !ref.contains(e.target as Node)
        ) &&
        filterRef.current && !filterRef.current.contains(e.target as Node)
      ) {
        set_action_modal(null);
        setShowFilterDropdown(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const getAvatarColor = (name: string) => {
    const colors = ['#FF6F91', '#6A89CC', '#00FF00', '#FFA500', '#A259FF', '#FF3D00', '#00FFFF'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-4 md:p-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statsInfo.map((info, index) => (
          <InfoCard key={index} labelClass='justify-center md:justify-between' icon={info.icon} value={info.value} label={info.label} color={info.color} />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2 items-stretch sm:items-center justify-between my-4 sm:my-6 pb-0.5">
        <div className="relative w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search by name, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#8B8898] focus:outline-none focus:border-white/20 w-full sm:min-w-[280px] md:min-w-[340px]"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#8B8898" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div ref={filterRef} className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white w-full sm:min-w-[190px] h-12 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 10H15.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 15H13.8333" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{statusFilter}</span>
            </div>
            <svg className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          {showFilterDropdown && (
            <div className="absolute top-14 left-0 sm:right-0 sm:left-auto bg-[#1E202C] border border-white/10 rounded-xl shadow-lg w-full sm:min-w-[190px] overflow-hidden z-50">
              {['All Status', 'Open', 'Responded', 'Closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                    statusFilter === status ? 'bg-white/10 text-white' : 'text-[#8B8898]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white">Loading messages...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-8 text-white">No messages found.</div>
      ) : (
        <div className="rounded-xl border border-white/10 ">
          <table className="min-w-full  text-sm text-left">
            <thead className="bg-white/8 text-[#8B8898] text-xs">
              <tr>  
                <th className="px-3 sm:px-4 md:px-6 text-nowrap py-3 sm:py-4 font-medium">User</th>
                <th className="px-3 sm:px-4 md:px-6 text-nowrap py-3 sm:py-4 font-medium hidden sm:table-cell">Subject</th>
                <th className="px-3 sm:px-4 md:px-6 text-nowrap py-3 sm:py-4 font-medium">Status</th>
                <th className="px-3 sm:px-4 md:px-6 text-nowrap py-3 sm:py-4 font-medium hidden md:table-cell">Created At</th>
                <th className="px-3 sm:px-4 md:px-6 text-nowrap py-3 sm:py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-[#1E202C]/8' : 'bg-white/6'} transition-all duration-500`}>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <button 
                      onClick={() => fetchMessageDetails(message.id)}
                      className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
                    >
                      <span 
                        className="size-8 sm:size-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" 
                        style={{ background: getAvatarColor(message.name) }}
                      >
                        {message.name.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="text-left min-w-0">
                        <div className="font-semibold text-sm sm:text-base text-white truncate">{message.name}</div>
                        <div className="text-xs text-[#BFC0D8]/60 truncate">{message.email}</div>
                      </div>
                    </button>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    <div className="text-white font-medium max-w-[200px] lg:max-w-xs truncate">{message.subject}</div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <span className={`px-2 sm:px-3 md:px-4 py-1 rounded-full min-h-[28px] sm:min-h-[33px] inline-flex items-center gap-1 text-xs sm:text-sm capitalize ${
                      message.status === 'open'
                        ? 'bg-[#FFA500]/10 text-[#FFA500]'
                        : message.status === 'responded'
                        ? 'bg-[#39FF67]/10 text-[#39FF67]' 
                        : 'bg-[#8B8898]/10 text-[#8B8898]'
                    }`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[#8B8898] text-xs sm:text-sm hidden md:table-cell">
                    {formatDate(message.created_at)}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div ref={(el) => { dropdownRefs.current[index] = el; }} className="relative">
                      <button 
                        onClick={() => toggleButton(index)} 
                        className={`hover:bg-white/10 text-white size-8 sm:size-10 flex items-center justify-center rounded-xl sm:rounded-2xl transition-colors ${index === action_modal ? 'bg-white/10' : ''}`}
                      >
                        <svg width="18" height="19" viewBox="0 0 20 21" fill="none" className="sm:w-5 sm:h-5">
                          <path d="M9.99996 11.3332C10.4602 11.3332 10.8333 10.9601 10.8333 10.4998C10.8333 10.0396 10.4602 9.6665 9.99996 9.6665C9.53972 9.6665 9.16663 10.0396 9.16663 10.4998C9.16663 10.9601 9.53972 11.3332 9.99996 11.3332Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.99996 5.50016C10.4602 5.50016 10.8333 5.12707 10.8333 4.66683C10.8333 4.20659 10.4602 3.8335 9.99996 3.8335C9.53972 3.8335 9.16663 4.20659 9.16663 4.66683C9.16663 5.12707 9.53972 5.50016 9.99996 5.50016Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.99996 17.1667C10.4602 17.1667 10.8333 16.7936 10.8333 16.3333C10.8333 15.8731 10.4602 15.5 9.99996 15.5C9.53972 15.5 9.16663 15.8731 9.16663 16.3333C9.16663 16.7936 9.53972 17.1667 9.99996 17.1667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
                      <div className={`absolute right-0 top-12 bg-[#1E202C] border border-white/10 rounded-xl shadow-lg min-w-[160px] sm:min-w-[180px] overflow-hidden transition-all duration-200 z-50 ${index === action_modal ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'} ${index === filteredMessages.length - 1 ? 'top-auto bottom-12' : ''}`}>
                        <button
                          onClick={() => {
                            fetchMessageDetails(message.id);
                            set_action_modal(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1.33334 8C1.33334 8 3.33334 3.33334 8.00001 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8.00001 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowReplyModal(true);
                            set_action_modal(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 5.33334L8 9.33334L2 5.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 5.33334H14V10.6667C2 10.2985 2.29848 10 2.66667 10H13.3333C13.7015 10 14 10.2985 14 10.6667V5.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Reply
                        </button>
                        {message.status !== 'responded' && (
                          <button
                            onClick={() => {
                              handleUpdateStatus(message.id, 'responded');
                              set_action_modal(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Mark as Responded
                          </button>
                        )}
                        {message.status !== 'closed' && (
                          <button
                            onClick={() => {
                              handleUpdateStatus(message.id, 'closed');
                              set_action_modal(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Mark as Closed
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E202C] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1E202C] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <span 
                  className="size-12 rounded-full flex items-center justify-center text-white font-bold shrink-0" 
                  style={{ background: getAvatarColor(selectedMessage.name) }}
                >
                  {selectedMessage.name.substring(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white">{selectedMessage.name}</h3>
                  <p className="text-sm text-[#8B8898]">{selectedMessage.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                  selectedMessage.status === 'open'
                    ? 'bg-[#FFA500]/10 text-[#FFA500]'
                    : selectedMessage.status === 'responded'
                    ? 'bg-[#39FF67]/10 text-[#39FF67]' 
                    : 'bg-[#8B8898]/10 text-[#8B8898]'
                }`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm text-[#8B8898] mb-1">Subject</h4>
                <p className="text-white font-medium">{selectedMessage.subject}</p>
              </div>

              <div>
                <h4 className="text-sm text-[#8B8898] mb-2">Message</h4>
                <p className="text-white bg-white/5 p-4 rounded-lg">{selectedMessage.message}</p>
              </div>

              <div>
                <h4 className="text-sm text-[#8B8898] mb-1">Created At</h4>
                <p className="text-white">{formatDate(selectedMessage.created_at)}</p>
              </div>

              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                <div>
                  <h4 className="text-sm text-[#8B8898] mb-3">Replies ({selectedMessage.replies.length})</h4>
                  <div className="space-y-3">
                    {selectedMessage.replies.map((reply) => (
                      <div key={reply.id} className={`p-4 rounded-lg ${reply.is_admin ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{reply.sender_name}</span>
                          <span className="text-xs text-[#8B8898]">{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-white text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#1E202C] border-t border-white/10 px-6 py-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowReplyModal(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Reply to Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E202C] border border-white/10 rounded-2xl max-w-2xl w-full">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Reply to {selectedMessage.name}</h2>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-[#8B8898] mb-1">Subject: {selectedMessage.subject}</p>
                <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{selectedMessage.message}</p>
              </div>
              
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[#8B8898] focus:outline-none focus:border-white/20 min-h-[150px] resize-none"
              />
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}