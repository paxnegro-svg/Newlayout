import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Twitch, Youtube, Music2, Terminal, Activity, Users } from 'lucide-react';

type Platform = 'twitch' | 'youtube' | 'tiktok';
type EventType = 'Follower' | 'Subscriber';

interface Alert {
  id: string;
  username: string;
  type: EventType;
  platform: Platform;
}

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  platform: Platform;
  color?: string;
}

const PLATFORM_CONFIG = {
  twitch: {
    color: 'border-twitch',
    glow: 'shadow-[0_0_15px_rgba(145,70,255,0.5)]',
    icon: Twitch,
    label: 'TWITCH_AUTH'
  },
  youtube: {
    color: 'border-youtube',
    glow: 'shadow-[0_0_15px_rgba(255,0,0,0.5)]',
    icon: Youtube,
    label: 'YT_CORE'
  },
  tiktok: {
    color: 'border-tiktok',
    glow: 'shadow-[0_0_15px_rgba(0,242,234,0.5)]',
    icon: Music2,
    label: 'TT_SYNC'
  }
};

const AlertBox: React.FC<{ alert: Alert }> = ({ alert }) => {
  const config = PLATFORM_CONFIG[alert.platform];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, skewX: -10 }}
      animate={{ x: 0, opacity: 1, skewX: -10 }}
      exit={{ x: 400, opacity: 0, skewX: -10 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className={`
        relative flex items-center gap-4 p-4 pr-8
        bg-slate-900-transparent border-l-4 ${config.color}
        ${config.glow}
        backdrop-blur-md
      `}
      style={{
        clipPath: 'polygon(0% 0%, 95% 0%, 100% 25%, 100% 100%, 5% 100%, 0% 75%)',
      }}
    >
      {/* Skew correction for content */}
      <div className="flex items-center gap-4 skew-x-[10deg]">
        <div className={`p-2 rounded-sm bg-white/5 border border-white/10`}>
          <Icon className={`w-6 h-6 ${alert.platform === 'twitch' ? 'text-twitch' : alert.platform === 'youtube' ? 'text-youtube' : 'text-tiktok'}`} />
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest opacity-50">
            <Terminal className="w-3 h-3" />
            <span>[SYSTEM_ID]: {config.label} // {alert.type.toUpperCase()}</span>
          </div>
          <div className="text-xl font-bold tracking-tight uppercase">
            NEW_CONNECTION // <span className="text-white">{alert.username}</span>
          </div>
        </div>
      </div>

      {/* Decorative scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="w-full h-[1px] bg-white animate-scanline" />
      </div>
    </motion.div>
  );
};

const GoalTracker: React.FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div 
      className="relative w-64 p-3 bg-slate-900-transparent border border-white/10 backdrop-blur-md"
      style={{
        clipPath: 'polygon(0% 0%, 92% 0%, 100% 25%, 100% 100%, 8% 100%, 0% 75%)',
      }}
    >
      <div className="flex justify-between items-end mb-2 px-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-[0.2em] opacity-50 uppercase leading-none mb-1">DATA_LINK // SUB_GOAL</span>
          <span className="text-xs font-bold tracking-widest text-system-purple">ESTABLISHING...</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-bold tracking-tighter leading-none">{current}<span className="opacity-30 mx-1">/</span>{goal}</span>
        </div>
      </div>
      
      <div className="h-1.5 bg-white/5 relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          className="h-full bg-system-purple shadow-[0_0_10px_#6B21A8]"
        />
        {/* Animated pulse at the end of the bar */}
        {percentage > 0 && percentage < 100 && (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#fff]"
            style={{ left: `calc(${percentage}% - 2px)` }}
          />
        )}
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-[1px] bg-system-purple/50" />
      <div className="absolute top-0 left-0 w-[1px] h-2 bg-system-purple/50" />
    </div>
  );
};

const ViewerCount: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div 
      className="relative w-32 p-2 bg-slate-900-transparent border border-white/10 backdrop-blur-md mt-2"
      style={{
        clipPath: 'polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%)',
      }}
    >
      <div className="flex items-center gap-2 px-1">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold tracking-[0.2em] opacity-50 uppercase leading-none mb-1">LIVE_FEED // VIEWERS</span>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-system-purple" />
            <motion.span 
              key={count}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold tracking-widest"
            >
              {count.toLocaleString()}
            </motion.span>
          </div>
        </div>
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-system-purple/50" />
      <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-system-purple/50" />
    </div>
  );
};

const ChatWidget: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  return (
    <div className="relative w-80 h-64 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center gap-2 mb-1 px-2">
        <Terminal className="w-3 h-3 text-system-purple opacity-50" />
        <span className="text-[9px] font-bold tracking-[0.2em] opacity-50 uppercase">COMMS_LOG // ENCRYPTED</span>
      </div>
      
      <div className="flex flex-col-reverse gap-2 overflow-y-auto pr-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20 }}
              className="relative p-2 bg-slate-900/40 border-l-2 border-white/10 backdrop-blur-sm"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 95% 100%, 0% 100%)',
              }}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-bold tracking-tight"
                    style={{ color: msg.color || '#fff' }}
                  >
                    {msg.username}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[8px] opacity-30 uppercase">{msg.platform}</span>
                </div>
                <div className="text-[11px] text-white/80 leading-tight">
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative scanline for chat */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 opacity-10" />
    </div>
  );
};

export default function App() {
  const [queue, setQueue] = useState<Alert[]>([]);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  
  // Goal Tracker State
  const [subCount, setSubCount] = useState(150);
  const [subGoal, setSubGoal] = useState(200);
  
  // Viewer Count State
  const [viewerCount, setViewerCount] = useState(1240);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Simulate real-time viewer count drift
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const drift = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(0, prev + drift);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle alert processing
  useEffect(() => {
    if (queue.length > 0 && !currentAlert) {
      const next = queue[0];
      setCurrentAlert(next);
      setQueue(prev => prev.slice(1));

      const timer = setTimeout(() => {
        setCurrentAlert(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [queue, currentAlert]);

  const addAlert = useCallback((platform: Platform, type: EventType, username?: string) => {
    const names = ['ZeroCool', 'AcidBurn', 'CerealKiller', 'LordNikon', 'PhantomPhreak', 'ThePlague'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      username: username || randomName,
      type,
      platform
    };
    
    setQueue(prev => [...prev, newAlert]);
  }, []);

  const addChatMessage = useCallback((username: string, text: string, platform: Platform, color?: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      text,
      platform,
      color
    };
    setChatMessages(prev => [newMessage, ...prev].slice(0, 15));
  }, []);

  // Listen for custom events (useful for OBS integration via JS)
  useEffect(() => {
    const handleExternalAlert = (e: any) => {
      if (e.detail?.platform && e.detail?.type) {
        addAlert(e.detail.platform, e.detail.type);
      }
    };
// StreamElements Integration
const handleStreamElementsEvent = (obj: any) => {
  const listener = obj.detail.listener;
  const event = obj.detail.event;

  if (listener === 'follower-latest') {
    addAlert('twitch', 'Follower', event.name);
  }
  // ... (handles subs and chat too)
};

window.addEventListener('onEventReceived', handleStreamElementsEvent);

    window.addEventListener('trigger-alert', handleExternalAlert);
    window.addEventListener('onEventReceived', handleStreamElementsEvent);
    
    return () => {
      window.removeEventListener('trigger-alert', handleExternalAlert);
      window.removeEventListener('onEventReceived', handleStreamElementsEvent);
    };
  }, [addAlert]);

  return (
    <div className="fixed inset-0 w-full h-full bg-transparent font-mono pointer-events-none">
      {/* Goal Tracker (Top Left) */}
      <div className="absolute top-12 left-12 pointer-events-auto flex flex-col gap-2">
        <GoalTracker current={subCount} goal={subGoal} />
        <ViewerCount count={viewerCount} />
      </div>

      {/* Alert Container */}
      <div className="absolute top-12 right-12 flex flex-col gap-4 items-end pointer-events-auto">
        <AnimatePresence mode="wait">
          {currentAlert && (
            <AlertBox key={currentAlert.id} alert={currentAlert} />
          )}
        </AnimatePresence>
      </div>

      {/* Chat Widget (Bottom Left) */}
      <div className="absolute bottom-24 left-12 pointer-events-auto">
        <ChatWidget messages={chatMessages} />
      </div>

      {/* HUD Accents */}
      <div className="absolute bottom-8 left-8 flex items-center gap-4 opacity-30 pointer-events-none skew-x-[-10deg]">
        <div className="w-1 h-12 bg-system-purple" />
        <div className="flex flex-col">
          <div className="text-[10px] font-bold tracking-widest">OVERLAY_V1.0.4</div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-system-purple" />
            <div className="text-xs">SYSTEM_STABLE // NO_ERRORS</div>
          </div>
        </div>
      </div>

      {/* Debug Controls (Hidden in OBS usually, but good for testing) */}
      <div className="absolute bottom-8 right-8 pointer-events-auto flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsDebugOpen(!isDebugOpen)}
          className="p-2 bg-slate-900/80 border border-white/10 text-[10px] hover:bg-system-purple transition-colors"
        >
          {isDebugOpen ? 'CLOSE_DEBUG' : 'OPEN_DEBUG'}
        </button>
        
        {isDebugOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 p-4 bg-slate-900/90 border border-white/10 backdrop-blur-md"
          >
            <div className="text-[10px] opacity-50 mb-2">TRIGGER_SIMULATION</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addAlert('twitch', 'Follower')} className="px-3 py-1 bg-twitch/20 border border-twitch text-[10px] hover:bg-twitch/40">TWITCH_FOLLOW</button>
              <button onClick={() => addAlert('twitch', 'Subscriber')} className="px-3 py-1 bg-twitch/20 border border-twitch text-[10px] hover:bg-twitch/40">TWITCH_SUB</button>
              <button onClick={() => addAlert('youtube', 'Follower')} className="px-3 py-1 bg-youtube/20 border border-youtube text-[10px] hover:bg-youtube/40">YT_SUB</button>
              <button onClick={() => addAlert('tiktok', 'Follower')} className="px-3 py-1 bg-tiktok/20 border border-tiktok text-[10px] hover:bg-tiktok/40">TT_FOLLOW</button>
            </div>
            
            <div className="text-[10px] opacity-50 mt-4 mb-2">GOAL_SIMULATION</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setSubCount(prev => Math.max(0, prev - 1))} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">-1 SUB</button>
              <button onClick={() => setSubCount(prev => prev + 1)} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">+1 SUB</button>
              <button onClick={() => setSubGoal(prev => Math.max(1, prev - 10))} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">-10 GOAL</button>
              <button onClick={() => setSubGoal(prev => prev + 10)} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">+10 GOAL</button>
            </div>

            <div className="text-[10px] opacity-50 mt-4 mb-2">VIEWER_SIMULATION</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setViewerCount(prev => Math.max(0, prev - 50))} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">-50 VIEWERS</button>
              <button onClick={() => setViewerCount(prev => prev + 50)} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">+50 VIEWERS</button>
            </div>

            <div className="text-[10px] opacity-50 mt-4 mb-2">CHAT_SIMULATION</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addChatMessage('Hacker_01', 'System breach detected!', 'twitch', '#9146FF')} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">MSG_01</button>
              <button onClick={() => addChatMessage('Admin_Root', 'Initiating counter-measures...', 'youtube', '#FF0000')} className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">MSG_02</button>
            </div>
            
            <div className="mt-2 text-[10px] opacity-30">QUEUE_SIZE: {queue.length}</div>
          </motion.div>
        )}
      </div>

      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}
