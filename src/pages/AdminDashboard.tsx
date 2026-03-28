import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bike, Navigation, ShieldCheck, DollarSign,
  CheckCircle, XCircle, Clock, Loader2, LogOut, ChevronDown, Search,
  TrendingUp, AlertCircle, Eye, Trash2, Plus, X, Menu, CreditCard
} from 'lucide-react';

const LOGO_URL = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [riders, setRiders] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [riderFilter, setRiderFilter] = useState('');
  const [rideFilter, setRideFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New admin form
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });

  const fetchStats = useCallback(async () => {
    try { const data = await api.adminStats(); setStats(data.stats); } catch (err) { console.error(err); }
  }, []);

  const fetchRiders = useCallback(async () => {
    try { const data = await api.adminGetRiders(riderFilter || undefined); setRiders(data.riders || []); } catch (err) { console.error(err); }
  }, [riderFilter]);

  const fetchRides = useCallback(async () => {
    try { const data = await api.adminGetRides(rideFilter || undefined); setRides(data.rides || []); } catch (err) { console.error(err); }
  }, [rideFilter]);

  const fetchUsers = useCallback(async () => {
    try { const data = await api.adminGetUsers(); setUsers(data.users || []); } catch (err) { console.error(err); }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try { const data = await api.adminGetAdmins(); setAdmins(data.admins || []); } catch (err) { console.error(err); }
  }, []);

  const fetchPayments = useCallback(async () => {
    try { const data = await api.adminGetPayments(); setPayments(data.payments || []); } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    if (activeSection === 'riders') fetchRiders();
    if (activeSection === 'rides') fetchRides();
    if (activeSection === 'users') fetchUsers();
    if (activeSection === 'admins') fetchAdmins();
    if (activeSection === 'payments') fetchPayments();
  }, [activeSection, fetchRiders, fetchRides, fetchUsers, fetchAdmins, fetchPayments]);

  const handleApproveRider = async (riderId: string, status: string) => {
    setActionLoading(riderId + status);
    try {
      await api.adminApproveRider(riderId, status);
      setSuccess(`Rider ${status}`);
      setTimeout(() => setSuccess(''), 3000);
      fetchRiders();
      fetchStats();
    } catch (err: any) { setError(err.message); }
    finally { setActionLoading(null); }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.adminCreateAdmin(newAdmin);
      setSuccess('Admin created successfully');
      setShowAdminForm(false);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.adminDeleteAdmin(adminId);
      fetchAdmins();
    } catch (err: any) { setError(err.message); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-blue-100 text-blue-800',
      arrived: 'bg-purple-100 text-purple-800', ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'riders', label: 'Rider Management', icon: Bike },
    { key: 'rides', label: 'Ride Management', icon: Navigation },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    ...(user?.role === 'superadmin' ? [{ key: 'admins', label: 'Admin Management', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-gray-900 text-white flex-shrink-0 transition-all duration-300 fixed lg:relative h-screen z-40`}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Nombo" className="h-8 w-8 object-contain rounded" />
            <span className="font-bold text-lg">NOMBO Admin</span>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.key ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 capitalize">{activeSection.replace('-', ' ')}</h2>
          </div>
          <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              {error} <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>
          )}

          {/* Overview */}
          {activeSection === 'overview' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Total Riders', value: stats.totalRiders, icon: Bike, color: 'text-green-600 bg-green-50' },
                  { label: 'Total Rides', value: stats.totalRides, icon: Navigation, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Active Rides', value: stats.activeRides, icon: Clock, color: 'text-orange-600 bg-orange-50' },
                  { label: 'Pending Riders', value: stats.pendingRiders, icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
                  { label: 'Revenue', value: `TZS ${stats.totalRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection('riders')}>
                  <h3 className="font-bold text-lg mb-1">Rider Approvals</h3>
                  <p className="text-green-200 text-sm">{stats.pendingRiders} riders waiting for approval</p>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveSection('rides')}>
                  <h3 className="font-bold text-lg mb-1">Active Rides</h3>
                  <p className="text-blue-200 text-sm">{stats.activeRides} rides currently in progress</p>
                </div>
              </div>
            </div>
          )}

          {/* Rider Management */}
          {activeSection === 'riders' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {['', 'pending', 'approved', 'rejected'].map((f) => (
                  <button key={f} onClick={() => setRiderFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      riderFilter === f ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}>
                    {f || 'All'}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Email</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Phone</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Bike</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Plate</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rating</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {riders.map((rider) => (
                        <tr key={rider.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{rider.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rider.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rider.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rider.bike_model}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rider.plate_number}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rider.status)}`}>{rider.status}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{rider.rating || '-'}</td>
                          <td className="px-4 py-3 text-right">
                            {rider.status === 'pending' && (
                              <div className="flex items-center gap-2 justify-end">
                                <button onClick={() => handleApproveRider(rider.id, 'approved')}
                                  disabled={actionLoading === rider.id + 'approved'}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50">
                                  Approve
                                </button>
                                <button onClick={() => handleApproveRider(rider.id, 'rejected')}
                                  disabled={actionLoading === rider.id + 'rejected'}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50">
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {riders.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No riders found</div>
                )}
              </div>
            </div>
          )}

          {/* Ride Management */}
          {activeSection === 'rides' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {['', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'].map((f) => (
                  <button key={f} onClick={() => setRideFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rideFilter === f ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}>
                    {f || 'All'}
                  </button>
                ))}
              </div>
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
                      {rides.map((ride) => (
                        <tr key={ride.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(ride.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">{ride.pickup_address}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">{ride.dropoff_address}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>{ride.status}</span></td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">TZS {ride.fare?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rides.length === 0 && <div className="p-8 text-center text-gray-500">No rides found</div>}
              </div>
            </div>
          )}

          {/* Users */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Email</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && <div className="p-8 text-center text-gray-500">No users found</div>}
            </div>
          )}

          {/* Payments */}
          {activeSection === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Amount</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Method</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">TZS {p.amount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.method}</td>
                        <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payments.length === 0 && <div className="p-8 text-center text-gray-500">No payments found</div>}
            </div>
          )}

          {/* Admin Management */}
          {activeSection === 'admins' && user?.role === 'superadmin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Admin Accounts</h3>
                <button onClick={() => setShowAdminForm(true)}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Admin
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Email</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Role</th>
                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Joined</th>
                        <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {admins.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{a.email}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${a.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{a.role}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(a.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            {a.id !== user?.id && (
                              <button onClick={() => handleDeleteAdmin(a.id)}
                                className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* New Admin Modal */}
              {showAdminForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Create Admin</h3>
                      <button onClick={() => setShowAdminForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
                    </div>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" required value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" required value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        Create Admin
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
