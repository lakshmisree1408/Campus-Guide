import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const BusinessListing = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await api.get('/businesses');
        setBusinesses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const categories = ['All', ...new Set(businesses.map(b => b.category))];

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = b.location.toLowerCase().includes(locationSearch.toLowerCase());
    const matchesCategory = category === 'All' || b.category === category;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Explore Spots</h1>
          <p className="text-slate-400">Find the best places around campus rated by students.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search spots..."
              className="input-field pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by location..."
              className="input-field pl-10 w-full sm:w-64"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <select
              className="input-field pl-10 appearance-none w-full sm:w-48"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 relative z-0">
          <MapContainer 
            center={filteredBusinesses.length > 0 && filteredBusinesses[0].lat ? [filteredBusinesses[0].lat, filteredBusinesses[0].lng] : [40.7128, -74.0060]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={filteredBusinesses.length > 0 && filteredBusinesses[0].lat ? [filteredBusinesses[0].lat, filteredBusinesses[0].lng] : [40.7128, -74.0060]} />
            {filteredBusinesses.map(biz => (
               biz.lat && biz.lng ? (
                 <Marker key={`marker-${biz._id}`} position={[biz.lat, biz.lng]}>
                   <Popup>
                     <Link to={`/businesses/${biz._id}`} className="font-bold text-gray-800 hover:text-brand-500 hover:underline">{biz.name}</Link>
                     <br/><span className="text-gray-600">{biz.category}</span>
                   </Popup>
                 </Marker>
               ) : null
            ))}
          </MapContainer>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <Link to={`/businesses/${biz._id}`} key={biz._id} className="glass-card p-5 group hover:-translate-y-2 transition-transform duration-300 block">
              <div className="h-48 bg-slate-800 rounded-xl mb-4 overflow-hidden relative">
                 {biz.imageUrl && (
                    <img src={`http://localhost:5000${biz.imageUrl}`} alt={biz.name} className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-500" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                 <div className="absolute bottom-3 left-3 z-20">
                   <span className="bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block">
                     {biz.category}
                   </span>
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{biz.name}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">{biz.description}</p>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="h-4 w-4" /> <span className="truncate max-w-[150px]">{biz.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-1 rounded-md text-yellow-500 font-semibold text-sm">
                  <Star className="h-4 w-4 fill-yellow-500" /> {biz.averageRating ? biz.averageRating.toFixed(1) : 'New'}
                </div>
              </div>
            </Link>
          ))}
          {filteredBusinesses.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 glass-card">
              No spots found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessListing;
