import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Star, MapPin, Phone, MessageSquare, Send, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom person icon for user location
const UserLocIcon = L.divIcon({
    html: `<div style="background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
               <circle cx="12" cy="7" r="4"></circle>
             </svg>
           </div>`,
    className: 'smooth-user-marker', // added a specific class for CSS transitions
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const MapController = ({ business, userLocation, route }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(route, { padding: [40, 40] });
    } else if (userLocation) {
      map.fitBounds([
        [business.lat, business.lng],
        [userLocation.lat, userLocation.lng]
      ], { padding: [40, 40] });
    }
  }, [route, userLocation, business, map]);
  return null;
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
  const { user } = useContext(AuthContext);

  // Map state
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [fetchingRoute, setFetchingRoute] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, revRes] = await Promise.all([
          api.get(`/businesses/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setBusiness(bizRes.data);
        setReviews(revRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        businessId: id,
        ...reviewForm
      });
      // Refresh reviews & business stats
      const [bizRes, revRes] = await Promise.all([
          api.get(`/businesses/${id}`),
          api.get(`/reviews/${id}`)
      ]);
      setBusiness(bizRes.data);
      setReviews(revRes.data);
      setReviewForm({ rating: 5, reviewText: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setFetchingRoute(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setUserLocation({ lat: userLat, lng: userLng });
      
      try {
        // Fetch route from OpenRouteService / OSRM public API
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${business.lng},${business.lat}?overview=full&geometries=geojson`);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // GeoJSON is [lng, lat], Leaflet is [lat, lng]
          setRoute(coords);
          
          if (watchId) navigator.geolocation.clearWatch(watchId);
          const id = navigator.geolocation.watchPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
          );
          setWatchId(id);
        } else {
          alert('Could not find a route.');
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        alert('Error fetching route.');
      } finally {
        setFetchingRoute(false);
      }
    }, (error) => {
      console.error(error);
      alert("Unable to retrieve your location. Please check your browser permissions.");
      setFetchingRoute(false);
    });
  };

  if (loading) return <div className="text-center py-20 text-xl text-slate-400">Loading details...</div>;
  if (!business) return <div className="text-center py-20 text-xl text-slate-400">Spot not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Info */}
      <div className="glass-card p-8 relative overflow-hidden">
        {business.imageUrl && (
          <img src={`http://localhost:5000${business.imageUrl}`} alt={business.name} className="absolute inset-0 w-full h-full object-cover z-0 opacity-30" />
        )}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
          <div className="space-y-4">
            <span className="bg-brand-500/20 text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {business.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">{business.name}</h1>
            <p className="text-lg text-slate-300 max-w-2xl">{business.description}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 text-slate-400 font-medium">
              <span className="flex items-center gap-2"><MapPin className="text-brand-400" /> {business.location}</span>
              {business.contactInfo && (
                <span className="flex items-center gap-2"><Phone className="text-brand-400" /> {business.contactInfo}</span>
              )}
            </div>
            
            {business.lat && business.lng && (
            <div className="mt-4 flex flex-col gap-4 w-full max-w-xl">
              <style>{`
                .smooth-user-marker {
                  transition: transform 1.2s linear !important;
                  z-index: 1000 !important;
                }
              `}</style>
              <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 relative z-0 shadow-xl bg-slate-900/50">
                 <MapContainer center={[business.lat, business.lng]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                   <MapController business={business} userLocation={userLocation} route={route} />
                   <TileLayer
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   />
                   {/* Business Marker */}
                   <Marker position={[business.lat, business.lng]} />
                   
                   {/* Moving User Marker */}
                   {userLocation && (
                     <Marker position={[userLocation.lat, userLocation.lng]} icon={UserLocIcon} />
                   )}
                   
                   {/* Route Polyline */}
                   {route && (
                     <Polyline positions={route} color="#3b82f6" weight={5} opacity={0.8} />
                   )}
                 </MapContainer>
              </div>
              
              <button 
                onClick={handleGetDirections} 
                disabled={fetchingRoute}
                className="w-full bg-slate-800 hover:bg-slate-700 text-brand-300 border border-brand-500/30 transition-all font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Navigation className="w-5 h-5" /> 
                {fetchingRoute ? 'Finding best route...' : 'Get Directions from My Location'}
              </button>
            </div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-2xl p-6 min-w-[150px] border border-white/5 shadow-inner self-start">
            <div className="text-5xl font-black text-yellow-400 drop-shadow-md mb-2">
              {business.averageRating ? business.averageRating.toFixed(1) : '-'}
            </div>
            <div className="flex text-yellow-400 mb-2">
               {[1,2,3,4,5].map(star => (
                 <Star key={star} className={`w-5 h-5 ${star <= Math.round(business.averageRating || 0) ? 'fill-yellow-400' : 'text-slate-600'}`} />
               ))}
            </div>
            <div className="text-slate-400 text-sm font-medium">{reviews.length} Reviews</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-400" /> Community Reviews
          </h2>
          
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400 italic">No reviews yet. Be the first!</div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-white text-lg">{review.user?.name || 'Anonymous User'}</div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                         <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{review.reviewText}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Leave a Review</h2>
          {user ? (
            <form onSubmit={submitReview} className="glass-card p-6 space-y-5">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600 hover:text-yellow-400/50'}`} />
                      </button>
                    ))}
                  </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Your Experience</label>
                 <textarea
                   rows="4"
                   className="input-field resize-none focus:ring-brand-500/50"
                   placeholder="What makes this place special?"
                   value={reviewForm.reviewText}
                   onChange={e => setReviewForm({...reviewForm, reviewText: e.target.value})}
                   required
                 />
               </div>
               <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                 <Send className="w-5 h-5" /> Post Review
               </button>
            </form>
          ) : (
            <div className="glass-card p-6 text-center space-y-4">
              <p className="text-slate-400">You need to be logged in to share your experience.</p>
              <a href="/login" className="btn-primary block">Sign In Now</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
