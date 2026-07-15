import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', street: '1A/3, Ram Gopal Paul Road, P.S. - Sarsuna', city: 'Kolkata', zip: '700061' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', street: '', city: '', zip: '' });

  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    setNewAddress({ type: 'Home', street: '', city: '', zip: '' });
    setShowAddForm(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 py-10 px-4"
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <button
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Full Name</p>
              <p className="font-semibold text-slate-800">{user?.name}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Email</p>
              <p className="font-semibold text-slate-800">{user?.email}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Role</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                {user?.role || 'user'}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Account Status</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Saved Addresses</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              {showAddForm ? 'Cancel' : '+ Add Address'}
            </button>
          </div>

          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddAddress}
              className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Street address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP code"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Save Address
              </button>
            </motion.form>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-4xl mb-3">📍</p>
              <p className="font-medium">No addresses saved yet</p>
              <p className="text-sm">Add an address for faster checkout</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mr-2">
                      {addr.type}
                    </span>
                    <span className="text-slate-700 text-sm">{addr.street}, {addr.city} {addr.zip}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;
