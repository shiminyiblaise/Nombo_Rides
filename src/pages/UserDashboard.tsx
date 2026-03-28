import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  MapPin, Navigation, Clock, DollarSign, Star, X, Loader2,
  History, BookOpen, Heart, ChevronRight, Phone, Bike, AlertCircle
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'tracking'>('book');
  const [pickup, setPickup] = useState(state?.pickup || '');
  const [dropoff, setDropoff] = useState(state?.dropoff || '');
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Review modal
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchRides = useCallback(async () => {
    try {
      const data = await api.getUserRides();
      setRides(data.rides || []);
      const active = data.rides?.find((r: any) => ['pending', 'accepted', 'arrived', 'ongoing'].includes(r.status));
      if (active) {
        setActiveRide(active);
        setActiveTab('tracking');
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 10000);
    return () => clearInterval(interval);
  }, [fetchRides]);

  const handleBookRide = async () => {
    if (!pickup || !dropoff) { setError('Please enter both locations'); return; }
    setError('');
    setLoading(true);
    try {
      // Generate mock coordinates
      const pickupLat = -6.7924 + (Math.random() - 0.5) * 0.05;
      const pickupLng = 39.2083 + (Math.random() - 0.5) * 0.05;
      const dropoffLat = -6.7924 + (Math.random() - 0.5) * 0.1;
      const dropoffLng = 39.2083 + (Math.random() - 0.5) * 0.1;
      const distance = Math.sqrt(Math.pow(dropoffLat - pickupLat, 2) + Math.pow(dropoffLng - pickupLng, 2)) * 111;
      const fare = Math.round(1500 + distance * 800);

      const data = await api.createRide({
        pickupAddress: pickup, pickupLat, pickupLng,
        dropoffAddress: dropoff, dropoffLat, dropoffLng,
        fare, distance: Math.round(distance * 10) / 10
      });
      setActiveRide(data.ride);
      setActiveTab('tracking');
      setSuccess('Ride booked! Looking for a rider...');
      setPickup('');
      setDropoff('');
      setTimeout(() => setSuccess(''), 3000);
      fetchRides();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    try {
      await api.cancelRide(rideId);
      setActiveRide(null);
      setActiveTab('book');
      fetchRides();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal) return;
    setReviewLoading(true);
    try {
      await api.createReview({
        riderId: reviewModal.rider_id,
        rideId: reviewModal.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewModal(null);
      setReviewRating(5);
      setReviewComment('');
      fetchRides();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      arrived: 'bg-purple-100 text-purple-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500">Where would you like to go today?</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[
            { key: 'book', label: 'Book Ride', icon: BookOpen },
            { key: 'tracking', label: 'Track Ride', icon: Navigation },
            { key: 'history', label: 'Ride History', icon: History },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
        )}

        {/* Book Ride */}
        {activeTab === 'book' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Book a Ride</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Pickup Location</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                      <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-gray-700" placeholder="Enter pickup" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Drop-off Location</label>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0" />
                      <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-gray-700" placeholder="Enter drop-off" />
                    </div>
                  </div>
                  <button onClick={handleBookRide} disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                    {loading ? 'Finding rider...' : 'Book Ride'}
                  </button>
                </div>

                {/* Quick Locations */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Locations</h3>
                  {['Kariakoo Market', 'Mlimani City Mall', 'Dar es Salaam Airport', 'University of DSM'].map((loc) => (
                    <button key={loc} onClick={() => setDropoff(loc)}
                      className="flex items-center gap-3 w-full py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400" /> {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Map View</p>
                    <p className="text-gray-300 text-sm mt-1">Enter locations to see route</p>
                  </div>
                </div>
                {/* Simulated map with dots */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="#94a3b8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking */}
        {activeTab === 'tracking' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {activeRide ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Active Ride</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activeRide.status)}`}>
                      {activeRide.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Pickup</p>
                        <p className="text-sm font-medium text-gray-800">{activeRide.pickup_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Drop-off</p>
                        <p className="text-sm font-medium text-gray-800">{activeRide.dropoff_address}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Fare</p>
                        <p className="text-lg font-bold text-gray-900">TZS {activeRide.fare?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Distance</p>
                        <p className="text-lg font-bold text-gray-900">{activeRide.distance} km</p>
                      </div>
                    </div>

                    {activeRide.rider && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-green-600 font-medium mb-2">Your Rider</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <Bike className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{activeRide.rider.name}</p>
                            <p className="text-xs text-gray-500">{activeRide.rider.bike_model} - {activeRide.rider.plate_number}</p>
                          </div>
                          <a href={`tel:${activeRide.rider.phone}`} className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </a>
                        </div>
                      </div>
                    )}

                    {['pending', 'accepted'].includes(activeRide.status) && (
                      <button onClick={() => handleCancelRide(activeRide.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 rounded-xl transition-colors">
                        Cancel Ride
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active ride</p>
                  <button onClick={() => setActiveTab('book')} className="mt-3 text-green-700 font-medium text-sm">Book a ride</button>
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[500px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">{activeRide ? 'Tracking your ride...' : 'No active ride to track'}</p>
                    {activeRide?.status === 'pending' && (
                      <div className="mt-4 flex items-center gap-2 justify-center text-yellow-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Looking for nearby riders...</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="#94a3b8" /></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#grid2)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Ride History</h2>
            </div>
            {rides.length === 0 ? (
              <div className="p-12 text-center">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No rides yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {rides.map((ride) => (
                  <div key={ride.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                            {ride.status}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(ride.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="truncate max-w-[200px]">{ride.pickup_address}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="truncate max-w-[200px]">{ride.dropoff_address}</span>
                        </div>
                        {ride.rider && (
                          <p className="text-xs text-gray-400 mt-1">Rider: {ride.rider.name}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-900">TZS {ride.fare?.toLocaleString()}</p>
                        {ride.status === 'completed' && !ride.reviewed && ride.rider_id && (
                          <button onClick={() => setReviewModal(ride)}
                            className="text-xs text-green-700 font-medium mt-1 hover:underline">
                            Rate Rider
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Rate Your Ride</h3>
              <button onClick={() => setReviewModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewRating(s)}>
                  <Star className={`w-8 h-8 ${s <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-24"
              placeholder="Leave a comment (optional)" />
            <button onClick={handleSubmitReview} disabled={reviewLoading}
              className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {reviewLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
