import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import {
  MapPin, Navigation, Clock, DollarSign, Star, Loader2,
  CheckCircle, XCircle, Bike, TrendingUp, AlertCircle, X, RefreshCw
} from 'lucide-react';

const RiderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'myrides' | 'earnings'>('requests');
  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [myRides, setMyRides] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({ earnings: 0, totalRides: 0, rating: 0, recentRides: [] as any[] });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingRides = useCallback(async () => {
    try {
      const data = await api.getPendingRides();
      setPendingRides(data.rides || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchMyRides = useCallback(async () => {
    try {
      const data = await api.getRiderRides();
      setMyRides(data.rides || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchEarnings = useCallback(async () => {
    try {
      const data = await api.getRiderEarnings();
      setEarnings(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchPendingRides();
    fetchMyRides();
    fetchEarnings();
    const interval = setInterval(() => {
      fetchPendingRides();
      fetchMyRides();
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchPendingRides, fetchMyRides, fetchEarnings]);

  // Share location
  useEffect(() => {
    const shareLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            api.updateRiderLocation(pos.coords.latitude, pos.coords.longitude).catch(() => {});
          },
          () => {}
        );
      }
    };
    shareLocation();
    const interval = setInterval(shareLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRide = async (rideId: string) => {
    setActionLoading(rideId);
    setError('');
    try {
      await api.acceptRide(rideId);
      setSuccess('Ride accepted!');
      setTimeout(() => setSuccess(''), 3000);
      fetchPendingRides();
      fetchMyRides();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (rideId: string, status: string) => {
    setActionLoading(rideId + status);
    try {
      await api.updateRideStatus(rideId, status);
      setSuccess(`Ride ${status}!`);
      setTimeout(() => setSuccess(''), 3000);
      fetchMyRides();
      if (status === 'completed') fetchEarnings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
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

  const activeRides = myRides.filter(r => ['accepted', 'arrived', 'ongoing'].includes(r.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-gray-900">{user?.rating || 0}</span>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-2 border border-green-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-green-700">TZS {(user?.earnings || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Earnings', value: `TZS ${earnings.earnings.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-700' },
            { label: 'Total Rides', value: earnings.totalRides, icon: Bike, color: 'bg-blue-50 text-blue-700' },
            { label: 'Rating', value: `${earnings.rating}/5`, icon: Star, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Active Rides', value: activeRides.length, icon: Navigation, color: 'bg-purple-50 text-purple-700' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {[
            { key: 'requests', label: `Ride Requests (${pendingRides.length})`, icon: AlertCircle },
            { key: 'myrides', label: 'My Rides', icon: Bike },
            { key: 'earnings', label: 'Earnings', icon: TrendingUp },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            {error} <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
        )}

        {/* Ride Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Available Rides</h2>
              <button onClick={fetchPendingRides} className="text-green-700 hover:text-green-800 flex items-center gap-1 text-sm">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            {pendingRides.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No ride requests at the moment</p>
                <p className="text-gray-400 text-sm mt-1">New requests will appear here automatically</p>
              </div>
            ) : (
              pendingRides.map((ride) => (
                <div key={ride.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-green-200 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                          <span className="text-gray-700 font-medium">{ride.pickup_address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                          <span className="text-gray-700 font-medium">{ride.dropoff_address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> TZS {ride.fare?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {ride.distance} km</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(ride.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <button onClick={() => handleAcceptRide(ride.id)} disabled={actionLoading === ride.id}
                      className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 flex-shrink-0">
                      {actionLoading === ride.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* My Rides */}
        {activeTab === 'myrides' && (
          <div className="space-y-4">
            {/* Active rides first */}
            {activeRides.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Active Rides</h3>
                {activeRides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-xl p-5 shadow-sm border-2 border-green-200 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>{ride.status}</span>
                      <span className="font-bold text-gray-900">TZS {ride.fare?.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        <span>{ride.pickup_address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                        <span>{ride.dropoff_address}</span>
                      </div>
                    </div>
                    {ride.user && <p className="text-xs text-gray-500 mb-3">Passenger: {ride.user.name}</p>}
                    <div className="flex gap-2">
                      {ride.status === 'accepted' && (
                        <button onClick={() => handleUpdateStatus(ride.id, 'arrived')}
                          disabled={actionLoading === ride.id + 'arrived'}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                          {actionLoading === ride.id + 'arrived' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          I've Arrived
                        </button>
                      )}
                      {ride.status === 'arrived' && (
                        <button onClick={() => handleUpdateStatus(ride.id, 'ongoing')}
                          disabled={actionLoading === ride.id + 'ongoing'}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                          {actionLoading === ride.id + 'ongoing' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Start Ride
                        </button>
                      )}
                      {ride.status === 'ongoing' && (
                        <button onClick={() => handleUpdateStatus(ride.id, 'completed')}
                          disabled={actionLoading === ride.id + 'completed'}
                          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                          {actionLoading === ride.id + 'completed' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          Complete Ride
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past rides */}
            <h3 className="text-lg font-bold text-gray-900">All Rides</h3>
            {myRides.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No rides yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Pickup</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Drop-off</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Fare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {myRides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(ride.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-[150px] truncate">{ride.pickup_address}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-[150px] truncate">{ride.dropoff_address}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>{ride.status}</span></td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">TZS {ride.fare?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Earnings */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
                <p className="text-green-200 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold mt-1">TZS {earnings.earnings.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Completed Rides</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{earnings.totalRides}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Average per Ride</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  TZS {earnings.totalRides > 0 ? Math.round(earnings.earnings / earnings.totalRides).toLocaleString() : 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Completed Rides</h3>
              </div>
              {earnings.recentRides.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No completed rides yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {earnings.recentRides.map((ride: any) => (
                    <div key={ride.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{ride.pickup_address} → {ride.dropoff_address}</p>
                        <p className="text-xs text-gray-400">{new Date(ride.created_at).toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-green-700">+TZS {ride.fare?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
