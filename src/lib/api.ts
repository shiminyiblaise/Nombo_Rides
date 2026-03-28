import { supabase } from '@/lib/supabase';

const getToken = () => localStorage.getItem('nombo_token');

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function callAuth(action: string, body: any = {}) {
  const { data, error } = await supabase.functions.invoke('nombo-auth', {
    body: { action, ...body },
    headers: authHeaders(),
  });
  if (error) throw new Error(error.message || 'Request failed');
  if (data?.error) throw new Error(data.error);
  return data;
}

async function callApi(action: string, body: any = {}) {
  const { data, error } = await supabase.functions.invoke('nombo-api', {
    body: { action, ...body },
    headers: authHeaders(),
  });
  if (error) throw new Error(error.message || 'Request failed');
  if (data?.error) throw new Error(data.error);
  return data;
}

export const api = {
  // Auth
  registerUser: (data: { name: string; email: string; password: string }) =>
    callAuth('register-user', data),
  registerRider: (data: any) =>
    callAuth('register-rider', data),
  login: (data: { email: string; password: string; loginType: string }) =>
    callAuth('login', data),
  verify: () => callAuth('verify'),

  // Rides
  createRide: (data: any) => callApi('create-ride', data),
  getUserRides: () => callApi('get-user-rides'),
  cancelRide: (rideId: string) => callApi('cancel-ride', { rideId }),
  getPendingRides: () => callApi('get-pending-rides'),
  getRiderRides: () => callApi('get-rider-rides'),
  acceptRide: (rideId: string) => callApi('accept-ride', { rideId }),
  updateRideStatus: (rideId: string, status: string) => callApi('update-ride-status', { rideId, status }),
  updateRiderLocation: (lat: number, lng: number) => callApi('update-rider-location', { lat, lng }),
  getRideDetails: (rideId: string) => callApi('get-ride-details', { rideId }),

  // Reviews
  createReview: (data: { riderId: string; rideId: string; rating: number; comment: string }) =>
    callApi('create-review', data),
  getRiderReviews: (riderId: string) => callApi('get-rider-reviews', { riderId }),

  // User
  saveLocation: (location: any) => callApi('save-location', { location }),

  // Rider
  getRiderEarnings: () => callApi('get-rider-earnings'),

  // Admin
  adminStats: () => callApi('admin-stats'),
  adminGetRiders: (status?: string) => callApi('admin-get-riders', { status }),
  adminApproveRider: (riderId: string, status: string) => callApi('admin-approve-rider', { riderId, status }),
  adminGetRides: (status?: string, page?: number) => callApi('admin-get-rides', { status, page }),
  adminGetUsers: () => callApi('admin-get-users'),
  adminGetAdmins: () => callApi('admin-get-admins'),
  adminCreateAdmin: (data: { name: string; email: string; password: string; role: string }) =>
    callApi('admin-create-admin', data),
  adminDeleteAdmin: (adminId: string) => callApi('admin-delete-admin', { adminId }),
  adminGetPayments: () => callApi('admin-get-payments'),
};
