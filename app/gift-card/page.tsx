"use client"
import React, { JSX, useState, useEffect } from 'react'
import PageContainer from '@/app/components/PageContainer'
import Modal from '@/app/components/Modal'
import { FaCheck } from "react-icons/fa";

type Props = {}

type GiftCard = {
  id: string;
  name: string;
  image: string;
  price: string;
  description: string;
  logo?: React.ReactNode;
  text?: string;
  dollar?: string[];
}

interface walletItem {
  name?: string;
  icon?: JSX.Element | string;
}

export default function Page({ }: Props) {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for wallet balance
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const linearBorder = `relative z-1
             after:content-[''] after:absolute after:-z-1 after:inset-0 after:rounded-[20px] 
             after:border-2 after:border-transparent 
             after:bg-[linear-gradient(#3B3B56,#3B3B56),linear-gradient(136deg,#FCC811_16.1%,#F85D36_41.78%,#EF5180_56.03%,#4B71FF_82.24%,#34DDFF_95.02%)] 
             after:[background-origin:border-box] after:[background-clip:content-box,border-box] 
             after:opacity-0 after:transition-opacity after:duration-600 hover:after:opacity-100`
  
  const linearBorder2 = `rounded-[20px] 
             border border-transparent 
             bg-[linear-gradient(#4C4E58,#4C4E58),linear-gradient(136deg,#FCC811_16.1%,#F85D36_41.78%,#EF5180_56.03%,#4B71FF_82.24%,#34DDFF_95.02%)] 
             [background-origin:border-box] [background-clip:content-box,border-box]`

  // Gift icon component
  const GiftIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.25 6.25H3.75C3.40482 6.25 3.125 5.97018 3.125 5.625V4.375C3.125 4.02982 3.40482 3.75 3.75 3.75H16.25C16.5952 3.75 16.875 4.02982 16.875 4.375V5.625C16.875 5.97018 16.5952 6.25 16.25 6.25Z" fill="currentColor"/>
      <path d="M7.5 6.25V10H3.75V8.125C3.75 7.08947 4.58947 6.25 5.625 6.25H7.5Z" fill="currentColor"/>
      <path d="M12.5 6.25V10H16.25V8.125C16.25 7.08947 15.4105 6.25 14.375 6.25H12.5Z" fill="currentColor"/>
      <path d="M7.5 11.25H3.75V15.625C3.75 16.6605 4.58947 17.5 5.625 17.5H7.5V11.25Z" fill="currentColor"/>
      <path d="M12.5 11.25H16.25V15.625C16.25 16.6605 15.4105 17.5 14.375 17.5H12.5V11.25Z" fill="currentColor"/>
      <path d="M10 6.25C10.6904 6.25 11.25 5.69036 11.25 5C11.25 4.30964 10.6904 3.75 10 3.75C9.30964 3.75 8.75 4.30964 8.75 5C8.75 5.69036 9.30964 6.25 10 6.25Z" fill="currentColor"/>
    </svg>
  )

  // Fallback gift card for demo/testing
  const fallbackGiftCard: GiftCard[] = [
    {
      id: '1',
      logo: <GiftIcon className="max-w-20 max-h-14 md:max-w-30 md:max-h-24 lg:max-w-max lg:max-h-max" />,
      text: "Google Pay",
      name: "Google Pay",
      image: "",
      price: "100",
      description: "Google Pay Gift Card",
      dollar: ["$20", "$30", "$60", "$100"]
    },
  ];

  const [activeGiftCard, setActiveGiftCard] = useState<GiftCard | null>(null);
  const [selectedDollar, setSelectedDollar] = useState<string>('');

  // Move these useState declarations up, before any useEffect that uses them
  const [openModal, setOpenModal] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [iscopied, setIsCopied] = useState(false);
  
  const walletItems: walletItem[] = [
    {
      name: 'Crypto Balance',
      icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.37533 6.53965C8.59541 6.75291 8.12533 7.35137 8.12533 7.91675C8.12533 8.48213 8.59541 9.08059 9.37533 9.29385V6.53965Z" fill="currentColor" />
        <path d="M10.6253 10.7063V13.4605C11.4052 13.2473 11.8753 12.6488 11.8753 12.0834C11.8753 11.518 11.4052 10.9196 10.6253 10.7063Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001ZM10.0003 4.37508C10.3455 4.37508 10.6253 4.6549 10.6253 5.00008V5.26403C11.984 5.50731 13.1253 6.52809 13.1253 7.91675C13.1253 8.26193 12.8455 8.54175 12.5003 8.54175C12.1551 8.54175 11.8753 8.26193 11.8753 7.91675C11.8753 7.35137 11.4052 6.75291 10.6253 6.53965V9.43069C11.984 9.67397 13.1253 10.6948 13.1253 12.0834C13.1253 13.4721 11.984 14.4929 10.6253 14.7361V15.0001C10.6253 15.3453 10.3455 15.6251 10.0003 15.6251C9.65515 15.6251 9.37533 15.3453 9.37533 15.0001V14.7361C8.01663 14.4929 6.87533 13.4721 6.87533 12.0834C6.87533 11.7382 7.15515 11.4584 7.50033 11.4584C7.8455 11.4584 8.12533 11.7382 8.12533 12.0834C8.12533 12.6488 8.59541 13.2473 9.37533 13.4605V10.5695C8.01663 10.3262 6.87533 9.30541 6.87533 7.91675C6.87533 6.52809 8.01663 5.50731 9.37533 5.26403V5.00008C9.37533 4.6549 9.65515 4.37508 10.0003 4.37508Z" fill="currentColor" />
      </svg>)
    },
    {
      name: 'Wallet Balance',
      icon: (<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.5091 8.21723C17.4636 8.21433 17.414 8.21435 17.3626 8.21437L17.3498 8.21437H15.3349C13.6742 8.21437 12.2531 9.53192 12.2531 11.2501C12.2531 12.9683 13.6742 14.2858 15.3349 14.2858H17.3498L17.3626 14.2858C17.414 14.2858 17.4636 14.2858 17.5091 14.2829C18.1837 14.24 18.7803 13.708 18.8304 12.9648C18.8337 12.9161 18.8337 12.8636 18.8337 12.8149L18.8336 12.8017V9.6985L18.8337 9.68529C18.8337 9.6366 18.8337 9.58408 18.8304 9.53535C18.7803 8.79221 18.1837 8.26016 17.5091 8.21723ZM15.1563 12.0596C15.5839 12.0596 15.9305 11.6972 15.9305 11.2501C15.9305 10.803 15.5839 10.4406 15.1563 10.4406C14.7287 10.4406 14.3821 10.803 14.3821 11.2501C14.3821 11.6972 14.7287 12.0596 15.1563 12.0596Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M17.3621 15.5001C17.4819 15.497 17.5725 15.6088 17.54 15.725C17.3788 16.3017 17.1229 16.7933 16.7122 17.2072C16.1111 17.813 15.3489 18.0818 14.4072 18.2094C13.4921 18.3334 12.323 18.3334 10.8468 18.3334H9.1498C7.67368 18.3334 6.5045 18.3334 5.58946 18.2094C4.64776 18.0818 3.88555 17.813 3.28446 17.2072C2.68336 16.6014 2.4166 15.8332 2.28999 14.8841C2.16697 13.9618 2.16698 12.7835 2.16699 11.2958V11.2044C2.16698 9.7167 2.16697 8.53833 2.28999 7.61611C2.4166 6.66701 2.68336 5.89881 3.28446 5.29299C3.88555 4.68718 4.64776 4.41832 5.58946 4.29072C6.5045 4.16673 7.67368 4.16674 9.14979 4.16675L10.8468 4.16675C12.323 4.16674 13.4921 4.16673 14.4072 4.29071C15.3489 4.41832 16.1111 4.68717 16.7122 5.29299C17.1228 5.70689 17.3788 6.19845 17.54 6.77518C17.5725 6.89141 17.4819 7.00321 17.3621 7.00009L15.3349 7.00009C13.0564 7.00009 11.0482 8.81415 11.0482 11.2501C11.0482 13.686 13.0564 15.5001 15.3349 15.5001L17.3621 15.5001ZM5.17904 7.40484C4.84634 7.40484 4.57663 7.67667 4.57663 8.01199C4.57663 8.3473 4.84634 8.61913 5.17904 8.61913H8.39189C8.72459 8.61913 8.9943 8.3473 8.9943 8.01199C8.9943 7.67667 8.72459 7.40484 8.39189 7.40484H5.17904Z" fill="currentColor" />
        <path d="M6.98089 3.35374L8.61323 2.15113C9.48986 1.50529 10.6775 1.50529 11.5541 2.15113L13.195 3.36006C12.5089 3.33338 11.7427 3.3334 10.9027 3.33342H9.09393C8.32635 3.33340 7.62041 3.33338 6.98089 3.35374Z" fill="currentColor" fillOpacity="0.5" />
      </svg>)
    },
  ];

  // Initialize activeWalletItem after walletItems is defined
  const [activeWalletItem, setActiveWalletItem] = useState(walletItems[0]);

  // Fetch gift cards from API
  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.bismeel.com';
        const response = await fetch(`${baseUrl}/api/gift-cards`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch gift cards: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data?.data && Array.isArray(result.data.data)) {
          const processedCards = result.data.data.map((card: any, idx: number) => ({
            id: card.id || `card-${idx}`,
            name: card.name || 'Gift Card',
            image: card.image || '',
            price: card.price?.toString() || '0',
            description: card.description || '',
            text: card.name || 'Gift Card',
            dollar: card.dollar || [`${card.price || '0'}`],
            logo: null // Use actual image from API instead of icon
          }));
          setGiftCards(processedCards);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error fetching gift cards:', err);
        // Use fallback data on error
        setGiftCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);
 const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const authData = localStorage.getItem("auth");
    if (!authData) return null;
    try {
      const parsed = JSON.parse(authData);
      return parsed.token;
    } catch {
      return null;
    }
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch wallet balance when the wallet modal opens and the "Wallet Balance" tab is active
  useEffect(() => {
    if (openWallet && activeWalletItem.name === 'Wallet Balance' && walletBalance === null && !walletLoading) {
      const fetchWalletBalance = async () => {
        try {
          setWalletLoading(true);
          setWalletError(null);
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.bismeel.com';
          // Assuming user_id is 1 for this example, you might get this from context or auth
          const response = await fetch(`${baseUrl}/api/wallet/1`, {
        headers: getHeaders(),
      });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch wallet balance: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.status && typeof result.total_balance === 'number') {
            setWalletBalance(result.total_balance);
          } else {
            throw new Error('Invalid wallet balance response format');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          setWalletError(errorMessage);
          console.error('Error fetching wallet balance:', err);
        } finally {
          setWalletLoading(false);
        }
      };

      fetchWalletBalance();
    }
  }, [openWallet, activeWalletItem.name, walletBalance, walletLoading]); // Dependencies correctly listed


  
  const copyHandle = (e: string) => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = e;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
      return;
    }

    navigator.clipboard.writeText(e).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  }

  const handleBuyClick = (card: GiftCard) => {
    setActiveGiftCard(card);
    const initialPrice = card.dollar?.[0] || `$${card.price}`;
    setSelectedDollar(initialPrice);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Reset state when modal closes
    setTimeout(() => {
      setActiveGiftCard(null);
      setSelectedDollar('');
    }, 300);
  };

  const handleCloseWallet = () => {
    setOpenWallet(false);
    // Reset copied state and wallet balance info
    setIsCopied(false);
    setWalletBalance(null); // Reset balance when closing wallet modal
    setWalletError(null);
  };

  const displayCards = giftCards.length > 0 ? giftCards : fallbackGiftCard;

  const bitcoinAddress = 'bc1qh3919y6v5ze9p2au2eeu7a8h3hd22xtj74ljjw';

  return (
    <PageContainer>
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-xl">Loading gift cards...</div>
        </div>
      )}
      
      {error && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-red-500 text-xl text-center px-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn gradient-border"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && displayCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
          >
          {displayCards.map((item, index) => (
            <div 
              key={item.id || index} 
              onClick={() => handleBuyClick(item)}
              className={`rounded-2xl xl:rounded-[20px] overflow-hidden group border border-[rgba(215,222,255,0.10)] bg-[rgba(215,222,255,0.16)] backdrop-blur-[20px] cursor-pointer ${linearBorder}`}
            >
              <div className="flex items-center justify-center w-full min-h-25 md:min-h-50 relative z-1">
                <img 
                  src="./img/giftCard/card-bg.png" 
                  className='rounded-[16px] pointer-events-none size-full absolute top-0 left-0 -z-1' 
                  alt="" 
                />
                <div className="flex items-center justify-center p-4">
                  {item.logo ? (
                    item.logo
                  ) : item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-w-20 max-h-14 md:max-w-30 md:max-h-24 lg:max-w-max lg:max-h-max object-contain" 
                    />
                  ) : (
                    <GiftIcon className="max-w-20 max-h-14 md:max-w-30 md:max-h-24 lg:max-w-max lg:max-h-max" />
                  )}
                </div>
              </div>
              <div className="flex justify-center lg:justify-between flex-col lg:flex-row items-center py-3 px-3 md:pl-6 md:pr-4 gap-2 md:gap-3 lg:gap-0">
                <p className='text-white text-sm md:text-lg md:font-bold line-clamp-1'>{item.text || item.name}</p>
                <button 
                  className='btn gradient-border shadow-none lg:opacity-1 lg:group-hover:lg:opacity-100 lg:invisible group-hover:lg:visible' 
                  onClick={() => handleBuyClick(item)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && activeGiftCard && (
        <Modal 
          title={activeGiftCard?.text || activeGiftCard?.name} 
          onClick={handleCloseModal}
        >
          <div className="flex flex-col gap-4">
            <div className="p-4 md:p-5 xl:p-6 w-full min-h-65.5 relative z-1 flex items-center justify-center">
              <img 
                src="./img/giftCard/modal-card-bg.png" 
                className='pointer-events-none size-full absolute top-0 left-0 -z-1' 
                alt="" 
              />
              <span className='block max-h-10 [&>svg]:max-h-[inherit] absolute top-0 left-0 m-6'>
                {activeGiftCard?.logo || (
                  activeGiftCard?.image ? (
                    <img 
                      src={activeGiftCard?.image} 
                      alt={activeGiftCard?.name} 
                      className="max-h-10 object-contain" 
                    />
                  ) : (
                    <GiftIcon className="max-h-10" />
                  )
                )}
              </span>
              <div className="relative max-w-max mx-auto">
                <span className='text-white text-[80px] font-bold !leading-[80%] text-center relative'>
                  <span className='text-2xl absolute top-4 right-full'>$</span>
                  {selectedDollar.replace("$", "")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              {(activeGiftCard.dollar || [`$${activeGiftCard.price}`]).map((item, index) => (
                <button 
                  key={index} 
                  className={`min-h-11 rounded-full text-sm font-bold border border-transparent transition-all ${selectedDollar === item ? `text-white ${linearBorder2}` : 'bg-white/10 text-white hover:bg-white/20'}`} 
                  onClick={() => setSelectedDollar(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button 
              className='btn gradient-border shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] min-h-12' 
              onClick={() => { 
                setOpenWallet(true); 
                setOpenModal(false);
              }}
            >
              Purchase Now
            </button>
          </div>
        </Modal>
      )}

      {openWallet && (
        <Modal 
          title={activeWalletItem.name} 
          icon={activeWalletItem.icon} 
          onClick={handleCloseWallet}
        >
          <div className="border-t border-white/8 pt-4 mb-4 md:mb-6">
            <div className="flex items-center gap-1 flex-wrap p-1 rounded-2xl bg-[#1E202C]/30">
              {walletItems.map((item, index) => (
                <button 
                  onClick={() => setActiveWalletItem(item)} 
                  key={index} 
                  className={`flex items-center justify-center gap-2 font-satoshi font-medium text-base rounded-xl min-h-12 grow transition-all ${item.name === activeWalletItem.name ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>
          </div>
          {activeWalletItem.name === 'Crypto Balance' && (
            <div className="flex flex-col gap-3">
              <div className="bg-white/10 rounded-3xl p-5 max-w-max mx-auto">
                <svg width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="124" height="124" rx="16" fill="white" />
                  <g clipPath="url(#clip0_372_1192)">
                    <path d="M32 22H22V32H32V22Z" fill="black" />
                    <path d="M82 12V17H77V22H82V42H87V47H82V52H87H92V42H107V47H112V42V12H82ZM107 37H87V17H107V37Z" fill="black" />
                    <path d="M102 22H92V32H102V22Z" fill="black" />
                    <path d="M22 42H12V52H22V42Z" fill="black" />
                    <path d="M32 42H22V52H32V42Z" fill="black" />
                    <path d="M42 42H32V52H42V42Z" fill="black" />
                    <path d="M52 42H42V52H52V42Z" fill="black" />
                    <path d="M62 42H52V52H62V42Z" fill="black" />
                    <path d="M72 42H62V52H72V42Z" fill="black" />
                    <path d="M82 62H72V72H82V62Z" fill="black" />
                    <path d="M92 52H82V62H92V52Z" fill="black" />
                    <path d="M102 52H92V62H102V52Z" fill="black" />
                    <path d="M112 52H102V62H112V52Z" fill="black" />
                    <path d="M22 72H12V82H22V72Z" fill="black" />
                    <path d="M32 62H22V72H32V62Z" fill="black" />
                    <path d="M42 62H32V72H42V62Z" fill="black" />
                    <path d="M52 62H42V72H52V62Z" fill="black" />
                    <path d="M62 62H52V72H62V62Z" fill="black" />
                    <path d="M72 72H62V82H72V72Z" fill="black" />
                    <path d="M82 72H72V82H82V72Z" fill="black" />
                    <path d="M92 82H82V92H92V82Z" fill="black" />
                    <path d="M102 72H92V82H102V72Z" fill="black" />
                    <path d="M112 72H102V82H112V72Z" fill="black" />
                    <path d="M22 82H12V92H22V82Z" fill="black" />
                    <path d="M42 82H32V92H42V82Z" fill="black" />
                    <path d="M52 82H42V92H52V82Z" fill="black" />
                    <path d="M62 82H52V92H62V82Z" fill="black" />
                    <path d="M72 82H62V92H72V82Z" fill="black" />
                    <path d="M82 92H72V102H82V92Z" fill="black" />
                    <path d="M102 82H92V92H102V82Z" fill="black" />
                    <path d="M112 82H102V92H112V82Z" fill="black" />
                    <path d="M22 92H12V102H22V92Z" fill="black" />
                    <path d="M42 92H32V102H42V92Z" fill="black" />
                    <path d="M62 92H52V102H62V92Z" fill="black" />
                    <path d="M72 102H62V112H72V102Z" fill="black" />
                    <path d="M92 92H82V102H92V92Z" fill="black" />
                    <path d="M102 102H92V112H102V102Z" fill="black" />
                    <path d="M112 92H102V102H112V92Z" fill="black" />
                    <path d="M22 102H12V112H22V102Z" fill="black" />
                    <path d="M32 102H22V112H32V102Z" fill="black" />
                    <path d="M42 102H32V112H42V102Z" fill="black" />
                    <path d="M52 102H42V112H52V102Z" fill="black" />
                    <path d="M62 102H52V112H62V102Z" fill="black" />
                    <path d="M82 102H72V112H82V102Z" fill="black" />
                    <path d="M112 102H102V112H112V102Z" fill="black" />
                  </g>
                  <defs>
                    <clipPath id="clip0_372_1192">
                      <rect width="100" height="100" fill="white" transform="translate(12 12)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="bg-[#171925]/10 rounded-2xl border border-white/16 p-3 flex items-center gap-3 mt-3.5">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M31.5216 19.8705C29.3847 28.442 20.7031 33.6584 12.1306 31.521C3.56168 29.3841 -1.65477 20.702 0.483083 12.1312C2.61906 3.5587 11.3006 -1.65814 19.8705 0.478775C28.4424 2.61569 33.6585 11.2987 31.5214 19.8706L31.5215 19.8705H31.5216Z" fill="#F7931A" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M23.0564 13.7202C23.3748 11.591 21.7537 10.4464 19.5371 9.68287L20.2562 6.79861L18.5004 6.36112L17.8004 9.16944C17.3388 9.05432 16.8648 8.94585 16.3937 8.83832L17.0988 6.01146L15.3442 5.57397L14.6247 8.45729C14.2427 8.37033 13.8676 8.28438 13.5036 8.19382L13.5056 8.18474L11.0844 7.58013L10.6174 9.45537C10.6174 9.45537 11.92 9.75396 11.8925 9.77234C12.6035 9.94979 12.7321 10.4204 12.7107 10.7935L11.8916 14.0793C11.9405 14.0918 12.004 14.1097 12.0741 14.1379L12.0231 14.1252C11.9798 14.1143 11.9348 14.1031 11.8885 14.092L10.7404 18.695C10.6535 18.911 10.433 19.2352 9.93587 19.1121C9.95347 19.1376 8.65978 18.7936 8.65978 18.7936L7.78809 20.8034L10.0729 21.3729C10.3231 21.4357 10.5703 21.5001 10.8151 21.564C10.9861 21.6085 11.1559 21.6528 11.3247 21.6959L10.5981 24.6133L12.3518 25.0508L13.0713 22.1644C13.5504 22.2945 14.0154 22.4144 14.4705 22.5275L13.7534 25.4003L15.5093 25.8378L16.2357 22.9259C19.2296 23.4925 21.4808 23.2641 22.4284 20.5561C23.1919 18.3758 22.3903 17.1183 20.8153 16.2982C21.9625 16.0336 22.8266 15.2791 23.057 13.7204L23.0564 13.72L23.0564 13.7202ZM19.0448 19.3453C18.547 21.3456 15.416 20.5186 13.9834 20.1403C13.8546 20.1062 13.7394 20.0758 13.6412 20.0514L14.6053 16.1865C14.725 16.2164 14.8713 16.2492 15.037 16.2864L15.0371 16.2864C16.5189 16.6189 19.5549 17.3003 19.0449 19.3453H19.0448ZM15.3343 14.4925C16.5286 14.8113 19.134 15.5066 19.5878 13.6886H19.588C20.0513 11.8292 17.5193 11.2686 16.2826 10.9948C16.1435 10.964 16.0208 10.9368 15.9205 10.9119L15.0464 14.4172C15.129 14.4377 15.2258 14.4636 15.3343 14.4925Z" fill="white" />
                </svg>
                <span className='text-white text-sm font-medium !leading-[120%] break-all'>{bitcoinAddress}</span>
              </div>
              <p className='text-white/50 text-sm text-center font-normal'>Send any amount to this address. You will receive your coins after the transaction is confirmed.</p>
              <button 
                onClick={() => { 
                  copyHandle(bitcoinAddress); 
                  setTimeout(() => setOpenWallet(false), 1000);
                }} 
                className='btn gradient-border shadow-[0_4px_8px_0_rgba(59,188,254,0.32)] min-h-12 mt-2 flex items-center justify-center gap-2'
              >
                {iscopied ? (
                  <>
                    <FaCheck />
                    Copied
                  </>
                ) : (
                  <>
                    Copy Wallet Address
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_372_1293)">
                        <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.16699 12.4998H3.33366C2.89163 12.4998 2.46771 12.3242 2.15515 12.0117C1.84259 11.6991 1.66699 11.2752 1.66699 10.8332V3.33317C1.66699 2.89114 1.84259 2.46722 2.15515 2.15466C2.46771 1.8421 2.89163 1.6665 3.33366 1.6665H10.8337C11.2757 1.6665 11.6996 1.8421 12.0122 2.15466C12.3247 2.46722 12.5003 2.89114 12.5003 3.33317V4.1665" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_372_1293">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
          {activeWalletItem.name === 'Wallet Balance' && (
            <div className="flex flex-col gap-3">
              {walletLoading && (
                <div className="text-center text-white/50 py-8">
                  <p className="text-lg">Loading wallet balance...</p>
                </div>
              )}
              {walletError && !walletLoading && (
                <div className="text-center text-red-500 py-8">
                  <p className="text-lg">Error loading balance: {walletError}</p>
                  <button 
                    onClick={() => setWalletBalance(null)} // Retrigger fetch on click
                    className="text-blue-400 hover:underline mt-2"
                  >
                    Try again
                  </button>
                </div>
              )}
              {walletBalance !== null && !walletLoading && !walletError && (
                <div className="text-center text-white py-8">
                  <p className="text-lg">Your Wallet Balance:</p>
                  <p className="text-4xl font-bold">${walletBalance.toFixed(2)}</p>
                </div>
              )}
               {walletBalance === null && !walletLoading && !walletError && (
                 <div className="text-center text-white/50 py-8">
                   <p className="text-lg">Wallet Balance feature coming soon (or no balance found)</p>
                 </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </PageContainer>
  )
}