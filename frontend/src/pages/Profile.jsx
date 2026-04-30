import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { API_BASE_URL } from '../lib/config';
import { ArrowLeft, MapPin, Calendar, Heart, Edit3, Save, MessageCircle, Clock, Users } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    address: userProfile?.address || '',
    bio: userProfile?.bio || '',
    interests: userProfile?.interests || '',
    preferred_gender: userProfile?.preferred_gender || 'anyone',
  });

  if (!userProfile) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profiles/${userProfile.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const updated = await response.json();
        setUserProfile(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const initials = userProfile.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-lg font-bold">Your Profile</h1>
        <div className="flex-1" />
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            isEditing 
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Avatar & Name Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 mb-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-[0_0_40px_rgba(244,63,94,0.3)]">
            {initials}
          </div>
          
          {isEditing ? (
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-center text-2xl font-bold text-white focus:outline-none focus:border-rose-500 w-full max-w-xs mx-auto block"
            />
          ) : (
            <h2 className="text-2xl font-black mb-1">{userProfile.name}</h2>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-3 text-gray-400 text-sm">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {userProfile.age} yrs</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-rose-500" /> {userProfile.address}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
            <MessageCircle className="w-5 h-5 text-rose-500 mx-auto mb-2" />
            <p className="text-2xl font-black">12</p>
            <p className="text-xs text-gray-500 mt-1">Chats</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
            <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-black">4.2h</p>
            <p className="text-xs text-gray-500 mt-1">Time</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
            <Users className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-black">8</p>
            <p className="text-xs text-gray-500 mt-1">Matches</p>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">About Me</h3>
          {isEditing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500 resize-none text-sm"
            />
          ) : (
            <p className="text-gray-400 text-sm leading-relaxed">{userProfile.bio || 'No bio yet. Tap Edit to add one!'}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">Interests</h3>
          {isEditing ? (
            <input
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="Music, Travel, Cooking..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500 text-sm"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(userProfile.interests || 'Music, Travel, Coffee').split(',').map((tag, i) => (
                <span key={i} className="bg-white/5 border border-white/[0.06] px-3 py-1.5 rounded-full text-xs text-gray-300 font-medium">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">Looking For</h3>
          {isEditing ? (
            <select
              value={form.preferred_gender}
              onChange={(e) => setForm({ ...form, preferred_gender: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer"
            >
              <option value="anyone" className="bg-[#13151a]">Anyone</option>
              <option value="male" className="bg-[#13151a]">Male</option>
              <option value="female" className="bg-[#13151a]">Female</option>
            </select>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-gray-300 capitalize">{userProfile.preferred_gender}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
