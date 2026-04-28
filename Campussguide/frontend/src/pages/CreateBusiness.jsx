import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Store, Plus, Upload, Loader, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position.lat !== null && position.lng !== null ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
}

function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const CreateBusiness = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Restaurant',
    location: '',
    lat: 40.7128,
    lng: -74.0060,
    description: '',
    contactInfo: ''
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([formData.lat, formData.lng]);

  const handleMapSearch = async () => {
    if (!mapSearchQuery) return;
    setIsSearchingMap(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        setMapCenter([newLat, newLng]);
        setFormData({ ...formData, lat: newLat, lng: newLng });
      } else {
        alert('Location not found. Try a different search term.');
      }
    } catch (err) {
      console.error(err);
      alert('Error searching for location.');
    } finally {
      setIsSearchingMap(false);
    }
  };
  
  if (!user || user.role !== 'owner') {
    return <div className="text-center py-20 text-slate-400">Access Denied. Only owners can create spots.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let imageUrl = '';
      if (imageFile) {
        setUploading(true);
        const fb = new FormData();
        fb.append('image', imageFile);
        const { data } = await api.post('/upload', fb, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = data;
        setUploading(false);
      }
      
      const { data } = await api.post('/businesses', { ...formData, imageUrl });
      navigate(`/businesses/${data._id}`);
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || 'Failed to create business');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 glass-card animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
        <div className="bg-brand-500/20 p-3 rounded-xl border border-brand-500/50">
          <Store className="w-8 h-8 text-brand-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Create a Spot</h1>
          <p className="text-slate-400 mt-1">Add your business to the campus guide so students can discover it.</p>
        </div>
      </div>

      {error && (
         <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
           {error}
         </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Business Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., The Coffee Lab"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select
                className="input-field appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Theatre">Theatre</option>
                <option value="Park">Park / Outdoors</option>
                <option value="Museum">Museum / Arts</option>
                <option value="Study Spot">Study Spot</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Location Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., North Campus Student Union"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Precise Location (Click on Map to Pin)</label>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              className="input-field py-2" 
              placeholder="Search for a city, address, or place..." 
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleMapSearch(); } }}
            />
            <button 
              type="button" 
              className="btn-primary py-2 px-4" 
              onClick={handleMapSearch}
              disabled={isSearchingMap}
            >
              {isSearchingMap ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="h-64 md:h-80 rounded-xl overflow-hidden border border-slate-700 mb-2 relative z-0">
            <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={mapCenter} />
              <LocationPicker 
                position={{lat: formData.lat, lng: formData.lng}} 
                setPosition={({lat, lng}) => setFormData({...formData, lat, lng})} 
              />
            </MapContainer>
          </div>
          <p className="text-xs text-slate-400">Selected Coordinates: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</p>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-1.5">Contact Info (Optional)</label>
           <input
             type="text"
             className="input-field"
             placeholder="Phone number or website link"
             value={formData.contactInfo}
             onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
           />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            rows="4"
            className="input-field resize-none"
            placeholder="Tell students what makes your place special..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Spot Photo (Optional)</label>
          <div className="flex items-center gap-4">
             <label className="cursor-pointer bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-brand-500 rounded-lg px-4 py-3 flex items-center gap-2 text-slate-300 transition-colors w-full">
               <Upload className="w-5 h-5 text-brand-400" />
               <span className="truncate">{imageFile ? imageFile.name : 'Upload an image...'}</span>
               <input
                 type="file"
                 accept="image/*"
                 className="hidden"
                 onChange={(e) => setImageFile(e.target.files[0])}
               />
             </label>
          </div>
        </div>

        <button type="submit" disabled={uploading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
           {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Let's Go! Add Spot
        </button>
      </form>
    </div>
  );
};

export default CreateBusiness;
