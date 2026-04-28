import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const Home = () => {
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const { data } = await api.get('/businesses/top-rated');
        setTopBusinesses(data);
      } catch (error) {
        console.error('Error fetching top businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in-up">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-20 px-4 relative overflow-hidden rounded-3xl bg-gradient-to-b from-brand-900/50 to-transparent border border-brand-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white z-10 relative">
          Discover Local <span className="text-brand-400 block mt-2">Campus Gems</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto z-10 relative leading-relaxed">
          The ultimate student-curated guide to the best food, theatres, parks, study spots, and hangouts around your campus.
        </p>
        <div className="flex justify-center gap-4 pt-8 z-10 relative">
          <Link to="/businesses" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
            Explore All <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-outline text-lg px-8 py-3">
            Contribute Review
          </Link>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Star className="text-yellow-400 fill-yellow-400 h-8 w-8" /> Top Rated Spots
          </h2>
          <Link to="/businesses" className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card h-64 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {topBusinesses.map((biz) => (
              <Link to={`/businesses/${biz._id}`} key={biz._id} className="glass-card p-5 group hover:-translate-y-2 transition-transform duration-300 block">
                <div className="h-40 bg-slate-800 rounded-xl mb-4 overflow-hidden relative">
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
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <MapPin className="h-4 w-4" /> {biz.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-1 rounded-md text-yellow-500 font-semibold">
                    <Star className="h-4 w-4 fill-yellow-500" /> {biz.averageRating ? biz.averageRating.toFixed(1) : 'New'}
                  </div>
                </div>
              </Link>
            ))}
            {topBusinesses.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-400 glass-card">
                No businesses rated yet. Be the first to leave a review!
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
