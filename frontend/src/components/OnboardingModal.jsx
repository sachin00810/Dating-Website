import { useState } from 'react';
import { User, MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';

export const OnboardingModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    preferredGender: 'anyone'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.address) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#13151a] border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Welcome</h2>
          <p className="text-gray-400">Complete your profile to start matching.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b] transition-all"
                placeholder="How should we call you?"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="number" 
                  min="18"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b] transition-all"
                  placeholder="18+"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b] transition-all"
                  placeholder="City, Region"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">Looking For</label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select 
                value={formData.preferredGender}
                onChange={e => setFormData({...formData, preferredGender: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-[#ff4b4b] focus:ring-1 focus:ring-[#ff4b4b] transition-all cursor-pointer"
              >
                <option value="anyone" className="bg-[#13151a]">Anyone</option>
                <option value="male" className="bg-[#13151a]">Male</option>
                <option value="female" className="bg-[#13151a]">Female</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all hover:scale-[1.02]"
          >
            Start Chatting <ArrowRight className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};
