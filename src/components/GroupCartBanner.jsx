import { useState } from 'react';
import { useCart } from '../context/useCart';
import { Users, Copy, Check, LogOut, Share2, Radio } from 'lucide-react';

const GroupCartBanner = () => {
  const { groupRoomId, groupMemberCount, startGroupCart, leaveGroupCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCopyCode = () => {
    if (!groupRoomId) return;
    const shareUrl = `${window.location.origin}/cart?room=${groupRoomId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    startGroupCart(inputCode.trim().toUpperCase());
    setInputCode('');
    setShowJoinInput(false);
  };

  if (groupRoomId) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-slate-950 p-4 rounded-2xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-4 border border-amber-300">
        <div className="flex items-center gap-3">
          <div className="bg-white/30 p-2 rounded-xl backdrop-blur-sm flex items-center justify-center">
            <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide uppercase">Live Group Cart</span>
              <span className="bg-slate-950 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" />
                {groupMemberCount} active
              </span>
            </div>
            <p className="text-xs text-slate-900 font-medium">
              Changes sync in real time across all member screens!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Room Code Badge & Copy */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-mono font-bold text-xs px-3 py-2 rounded-xl transition-colors shadow-sm"
            title="Click to copy invite link"
          >
            <span>Room: {groupRoomId}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Leave Session */}
          <button
            onClick={leaveGroupCart}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/40 text-slate-950 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            title="Leave group cart"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md mb-6 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-100">Shop Together with Friends</h4>
          <p className="text-xs text-slate-400">
            Start a live shared cart session with friends and split the order.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showJoinInput ? (
          <form onSubmit={handleJoin} className="flex items-center gap-1.5">
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="ENTER ROOM CODE"
              className="bg-slate-800 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl outline-none font-mono uppercase focus:border-amber-400 w-36"
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => setShowJoinInput(false)}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </form>
        ) : (
          <>
            <button
              onClick={() => startGroupCart()}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Start Group Order</span>
            </button>
            <button
              onClick={() => setShowJoinInput(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3 py-2 rounded-xl transition-colors border border-slate-700"
            >
              Join Room
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupCartBanner;
