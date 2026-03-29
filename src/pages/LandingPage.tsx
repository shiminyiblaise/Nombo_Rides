import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Shield, Clock, DollarSign, Star, Bike, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const HERO_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87bfc3bd294b5e288c727_1774746846667_eeff62f0.jpg';
const LOGO_URL = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746342456_bafdf5b6.jpeg';
const STEP1_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87bfc3bd294b5e288c727_1774746866272_f0cc73e3.jpg';
const STEP2_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87bfc3bd294b5e288c727_1774746866916_215b6e61.jpg';
const STEP3_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87bfc3bd294b5e288c727_1774746870890_3855076c.png';
const RIDER_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746525212_91fad33c.jpeg';
const APP_IMG = 'https://d64gsuwffb70l.cloudfront.net/69c87ac8cca9a14789abb64f_1774746347011_f4699e97.jpeg';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const handleBookRide = () => {
    if (user) {
      navigate('/dashboard', { state: { pickup, dropoff } });
    } else {
      navigate('/login', { state: { redirect: '/dashboard', pickup, dropoff } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Diagonal stripe background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-600">
          <div className="absolute top-0 right-0 w-2/3 h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/30 to-transparent" style={{ transform: 'skewX(-12deg)', transformOrigin: 'top right' }} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/95 via-green-700/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Your <span className="text-yellow-400">Ride</span>,<br />
                Anytime.<br />
                Anywhere.
              </h1>
              <p className="mt-5 text-lg text-green-100 max-w-md">
                Fast, safe, and affordable motorcycle rides at your fingertips.
              </p>

              {/* Booking Form */}
              <div className="mt-8 bg-white rounded-2xl p-5 shadow-2xl max-w-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <input
                      type="text"
                      placeholder="Enter pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <input
                      type="text"
                      placeholder="Enter drop-off location"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleBookRide}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-500/30"
                  >
                    BOOK A RIDE
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">Safe. Fast. Affordable. Available 24/7.</p>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <img src={RIDER_IMG} alt="Nombo Rider" className="w-[500px] h-[500px] object-cover rounded-3xl shadow-2xl" />
                {/* Floating stats */}
                <div className="absolute -left-8 top-12 bg-white rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Active Riders</p>
                      <p className="text-lg font-bold text-gray-900">2,500+</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 bottom-20 bg-white rounded-xl shadow-lg p-4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Avg Rating</p>
                      <p className="text-lg font-bold text-gray-900">4.8/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Rides Completed', value: '150K+', icon: Bike },
              { label: 'Active Riders', value: '2,500+', icon: Users },
              { label: 'Cities', value: '12+', icon: MapPin },
              { label: 'Avg. Wait Time', value: '3 min', icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How Nombo Works</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">Simple, Fast, Reliable. Here's how Nombo gets you moving in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: 1, title: 'Book', desc: 'Enter your pickup and drop-off locations, then tap "Book Ride" to get started.', img: STEP1_IMG },
              { step: 2, title: 'Match', desc: "We'll quickly find a nearby Nombo rider and send you their details so you can track their arrival.", img: STEP2_IMG },
              { step: 3, title: 'Ride', desc: 'Hop on, relax, and enjoy the ride. Pay easily through the app or in cash when you arrive.', img: STEP3_IMG },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">{item.step}</span>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nombo */}
      <section id="safety" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Why Ride with Nombo?</h2>
              <p className="text-gray-500 mb-10">Download Nombo and ride in minutes. Available on iOS and Android.</p>
              <div className="space-y-8">
                {[
                  { icon: Zap, title: 'Fast & Reliable', desc: 'Get to your destination quickly with our network of experienced riders.', color: 'bg-green-100 text-green-700' },
                  { icon: Shield, title: 'Safety First', desc: 'Your safety is our priority. Trusted, professional riders and real-time tracking.', color: 'bg-yellow-100 text-yellow-700' },
                  { icon: DollarSign, title: 'Affordable Rates', desc: 'Enjoy the best fares without breaking the bank. Transparent pricing.', color: 'bg-blue-100 text-blue-700' },
                  { icon: Star, title: 'Top-Rated Riders', desc: 'All riders are vetted, trained, and rated by the community.', color: 'bg-purple-100 text-purple-700' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{feature.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <img src={APP_IMG} alt="Nombo App" className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Become a Rider CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Earn with Nombo</h2>
                <p className="text-green-100 mb-6 max-w-md">
                  Join our growing network of riders. Set your own schedule, earn competitive rates, and be part of the Nombo family.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Flexible working hours', 'Weekly payouts', 'Insurance coverage', 'Free training & support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-green-100">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register?type=rider')}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3.5 rounded-xl transition-all w-fit shadow-lg"
                >
                  Become a Rider <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="hidden lg:block relative">
                <img src={HERO_IMG} alt="Nombo Rider" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cashless Payments</h2>
          <p className="text-gray-500 mb-8">Pay securely in the app or with cash once you reach your destination.</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['VISA', 'Mastercard', 'Mobile Money', 'Cash'].map((method, i) => (
              <div key={i} className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 font-semibold text-gray-700">
                {method}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-900 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-900 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Ready to Ride?</h2>
          <p className="text-gray-800 mb-8 max-w-md mx-auto">Get the Nombo app and book your ride today!</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-colors shadow-lg">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left">
                <p className="text-[10px] leading-none">Download on the</p>
                <p className="text-lg font-semibold leading-tight">App Store</p>
              </div>
            </button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-colors shadow-lg">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              <div className="text-left">
                <p className="text-[10px] leading-none">Get it on</p>
                <p className="text-lg font-semibold leading-tight">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
