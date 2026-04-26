import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  CheckCircle2, 
  Compass, 
  ChevronRight, 
  X, 
  Info,
  Hotel as HotelIcon,
  Search,
  Sparkles,
  Menu,
  Eye,
  TreeDeciduous,
  Landmark,
  ShoppingBag,
  Church,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ISTANBUL_DATA, Venue, Hotel, getDistance, cn, TRANSLATIONS, ALL_DISTRICTS, DISTRICT_COORDS, DEFAULT_IMAGE } from './constants';

const categoryMapping: { [key: string]: { icon: string, color: string } } = {
  "Cami": { icon: "fa-mosque", color: "#16a34a" },
  "Türbe": { icon: "fa-mosque", color: "#16a34a" },
  "İnanç": { icon: "fa-mosque", color: "#16a34a" },
  "Saray": { icon: "fa-landmark", color: "#9333ea" },
  "Müze": { icon: "fa-landmark", color: "#9333ea" },
  "Kasır": { icon: "fa-landmark", color: "#9333ea" },
  "Tarihi Yapı": { icon: "fa-landmark", color: "#9333ea" },
  "Park": { icon: "fa-tree", color: "#22c55e" },
  "Doğa": { icon: "fa-tree", color: "#22c55e" },
  "Koru": { icon: "fa-tree", color: "#22c55e" },
  "Orman": { icon: "fa-tree", color: "#22c55e" },
  "Bahçe": { icon: "fa-tree", color: "#22c55e" },
  "Manzara": { icon: "fa-eye", color: "#3b82f6" },
  "Kule": { icon: "fa-eye", color: "#3b82f6" },
  "Seyir Terası": { icon: "fa-eye", color: "#3b82f6" },
  "Çarşı": { icon: "fa-shopping-bag", color: "#db2777" },
  "Alışveriş": { icon: "fa-shopping-bag", color: "#db2777" },
  "AVM": { icon: "fa-shopping-bag", color: "#db2777" },
  "Cadde": { icon: "fa-shopping-bag", color: "#db2777" },
  "Sahil": { icon: "fa-water", color: "#06b6d4" },
  "Ada": { icon: "fa-water", color: "#06b6d4" },
  "Deniz": { icon: "fa-water", color: "#06b6d4" },
  "Akvaryum": { icon: "fa-water", color: "#06b6d4" },
  "Köprü": { icon: "fa-bridge", color: "#4b5563" },
  "Gar": { icon: "fa-bridge", color: "#4b5563" },
  "İstasyon": { icon: "fa-bridge", color: "#4b5563" },
  "Kale": { icon: "fa-fort-awesome", color: "#b45309" },
  "Hisar": { icon: "fa-fort-awesome", color: "#b45309" },
  "Sarnıç": { icon: "fa-fort-awesome", color: "#b45309" },
  "Semt": { icon: "fa-map-signs", color: "#d97706" },
  "Köy": { icon: "fa-map-signs", color: "#d97706" },
  "Meydan": { icon: "fa-map-signs", color: "#d97706" },
  "Eğlence": { icon: "fa-ticket", color: "#ef4444" },
  "Tema Park": { icon: "fa-ticket", color: "#ef4444" },
  "Sanat Merkezi": { icon: "fa-ticket", color: "#ef4444" }
};

const createCategoryIcon = (tur: string, label?: string, customColor?: string) => {
  let matched = { icon: "fa-map-marker-alt", color: "#3b82f6" };
  
  for (const key in categoryMapping) {
    if (tur.toLowerCase().includes(key.toLowerCase())) {
      matched = { ...categoryMapping[key] };
      break;
    }
  }

  const markerColor = customColor || matched.color;

  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="marker-container" style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div class="marker-category" style="background-color: ${markerColor}; color: white; width: 38px; height: 38px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 0 15px ${markerColor}80, 0 4px 12px rgba(0,0,0,0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
          <i class="fa-solid ${matched.icon}"></i>
        </div>
        ${label ? `
          <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: white; color: ${markerColor}; padding: 2px 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 2px solid ${markerColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10; white-space: nowrap;">
            ${label}
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
};

const dayColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function RouteFitter({ routeData }: { routeData: { day: number, venues: Venue[] }[] }) {
  const map = useMap();
  useEffect(() => {
    if (routeData.length > 0) {
      const allCoords = routeData.flatMap(day => 
        day.venues.map(v => [v.koordinat.enlem, v.koordinat.boylam] as [number, number])
      );
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 15, duration: 2 });
      }
    }
  }, [routeData, map]);
  return null;
}

const SPECIAL_QUERIES: { [key: string]: string } = {
  "Yeni Cami (Eminönü)": "Yeni Cami Eminönü İstanbul",
  "Maçka Parkı": "Maçka Demokrasi Parkı İstanbul",
  "Yıldız Parkı": "Beşiktaş Yıldız Parkı İstanbul",
  "Moda Sahili": "Kadıköy Moda Sahili",
  "Yeni Cami": "Yeni Cami Eminönü İstanbul"
};

function WikiImage({ title, fallback, className }: { title: string, fallback: string, className?: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchWikiImage = async () => {
      try {
        // Prepare title for Wikipedia URL (spaces to underscores)
        const baseTitle = SPECIAL_QUERIES[title] || title;
        const underscoredTitle = encodeURIComponent(baseTitle.replace(/ /g, '_'));
        
        // 1. Priority: Turkish Wikipedia REST API Summary
        let res = await fetch(`https://tr.wikipedia.org/api/rest_v1/page/summary/${underscoredTitle}`);
        let data = await res.json();
        let source = data.originalimage?.source || data.thumbnail?.source;

        // 2. Secondary: Global (English) Wikipedia if not found in TR
        if (!source || data.status === 404) {
          res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${underscoredTitle}`);
          data = await res.json();
          source = data.originalimage?.source || data.thumbnail?.source;
        }

        if (isMounted) {
          // 3. Fallback: Dynamic Unsplash with specific Istanbul context
          const finalUrl = source || `https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800`;
          setImgUrl(finalUrl);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          // Robust error recovery using the provided fallback
          setImgUrl(fallback || `https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800`);
          setIsLoading(false);
        }
      }
    };

    fetchWikiImage();
    return () => { isMounted = false; };
  }, [title, fallback]);

  if (isLoading) return <div className={cn("bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg", className)} />;
  
  return (
    <img 
      src={imgUrl || fallback} 
      alt={title} 
      className={cn("object-cover rounded-lg", className)} 
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'otel' | 'semt'>('otel');
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(ISTANBUL_DATA.populer_oteller[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Fatih");
  const [duration, setDuration] = useState<number>(3);
  const [pace, setPace] = useState<number>(4);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [routeData, setRouteData] = useState<{ day: number, venues: Venue[] }[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplorerMode, setIsExplorerMode] = useState(false);
  const [isViewingRoute, setIsViewingRoute] = useState(false);
  const [visibleDay, setVisibleDay] = useState<number | null>(null);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const t = TRANSLATIONS[lang];

  const districts = ALL_DISTRICTS;
  const districtCoords = DISTRICT_COORDS;
  const prefOptions = ["worship", "history", "nature", "views", "shopping", "water", "transport", "fortress", "life", "fun"];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (lang === 'en' && selectedVenue) {
      if (!selectedVenue.isim_en || !selectedVenue.tur_en || !selectedVenue.kisa_tarihce_en) {
        console.warn(`Missing EN translations for venue: ${selectedVenue.isim}`);
      }
    }
  }, [selectedVenue, lang]);

  useEffect(() => {
    console.log(`Loaded ${ISTANBUL_DATA.turistik_mekanlar.length} venues.`);
  }, []);

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const catToIcon: { [key: string]: string } = {
    worship: "fa-mosque",
    history: "fa-landmark",
    nature: "fa-tree",
    views: "fa-eye",
    shopping: "fa-shopping-bag",
    water: "fa-water",
    transport: "fa-bridge",
    fortress: "fa-fort-awesome",
    life: "fa-map-signs",
    fun: "fa-ticket"
  };

  const drawSmartRoute = () => {
    setIsGenerating(true);
    setIsExplorerMode(false);

    // Simulate a brief calculation time for UX
    setTimeout(() => {
      const filteredVenues = ISTANBUL_DATA.turistik_mekanlar.filter(v => {
        if (preferences.length === 0) return true;
        
        // Find venue's icon
        let venueIcon = "fa-map-marker-alt";
        for (const key in categoryMapping) {
          if (v.tur.toLowerCase().includes(key.toLowerCase())) {
            venueIcon = categoryMapping[key].icon;
            break;
          }
        }

        const matchesPref = preferences.some(p => catToIcon[p] === venueIcon);
        return matchesPref;
      });

      if (filteredVenues.length === 0) {
        alert(lang === 'tr' ? "Seçtiğiniz kriterlere uygun mekan bulunamadı." : "No venues found for your criteria.");
        setIsGenerating(false);
        return;
      }

      let startPos = activeTab === 'otel' 
        ? { lat: selectedHotel.koordinat.enlem, lng: selectedHotel.koordinat.boylam }
        : (DISTRICT_COORDS[selectedDistrict] || { lat: 41.015, lng: 28.974 });

      let unvisited = [...filteredVenues];
      const dailyRoutes: { day: number, venues: Venue[] }[] = [];
      
      for (let d = 1; d <= duration; d++) {
        const dayVenues: Venue[] = [];
        let currentPos = { ...startPos };
        const venuesPerDay = pace;

        for (let i = 0; i < venuesPerDay; i++) {
          if (unvisited.length === 0) break;

          let nearestIdx = -1;
          let minDistance = Infinity;

          unvisited.forEach((v, idx) => {
            const dist = getDistance(currentPos.lat, currentPos.lng, v.koordinat.enlem, v.koordinat.boylam);
            if (dist < minDistance) {
              minDistance = dist;
              nearestIdx = idx;
            }
          });

          if (nearestIdx !== -1) {
            const nextVenue = unvisited.splice(nearestIdx, 1)[0];
            dayVenues.push(nextVenue);
            currentPos = { lat: nextVenue.koordinat.enlem, lng: nextVenue.koordinat.boylam };
          }
        }

        if (dayVenues.length > 0) {
          dailyRoutes.push({ day: d, venues: dayVenues });
        }
      }

      setRouteData(dailyRoutes);
      setIsGenerating(false);
      setIsSidebarOpen(false);
      setIsViewingRoute(true);
      setVisibleDay(null);
    }, 1500);
  };

  const clearRoute = () => {
    setRouteData([]);
    setIsViewingRoute(false);
    setVisibleDay(null);
  };

  return (
    <div className={cn("min-h-screen flex flex-col font-sans overflow-hidden transition-colors duration-500", theme === 'dark' ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800")}>
      <AnimatePresence mode="wait">
        {activeScreen === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex flex-col items-center justify-center landing-overlay text-white text-center px-6"
          >
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem] mx-auto mb-10 flex items-center justify-center shadow-2xl">
                <Compass size={48} className="text-white" />
              </div>
              <h1 className="text-6xl lg:text-9xl font-serif font-black mb-6 tracking-tighter drop-shadow-2xl">
                {lang === 'tr' ? <>{t.discover.split(' ')[0]} <br/> <span className="italic text-blue-200">{t.discover.split(' ')[1]}</span></> : <>{t.discover.split(' ')[0]} <span className="italic text-blue-200">{t.discover.split(' ')[1]}</span></>}.
              </h1>
              <p className="text-xl lg:text-3xl text-blue-50 max-w-3xl mx-auto mb-14 font-medium leading-relaxed opacity-90">
                {t.subtitle}
              </p>
              <button 
                onClick={() => setActiveScreen('app')}
                className="bg-white text-blue-600 px-16 py-6 rounded-[2rem] text-2xl font-black hover:bg-blue-50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 mx-auto active:scale-95 group"
              >
                {t.start}
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen"
          >
            {/* Header */}
            {!isExplorerMode && (
              <nav className={cn("h-16 lg:h-20 border-b flex items-center px-4 lg:px-10 justify-between shrink-0 z-50 shadow-sm transition-colors", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
                <div className="flex items-center gap-2 lg:gap-3 cursor-pointer group" onClick={() => setActiveScreen('landing')}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white rotate-45" />
                  </div>
                  <span className={cn("text-lg lg:text-2xl font-black tracking-tighter uppercase whitespace-nowrap", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    {lang === 'tr' ? <>İstanbul <span className="text-blue-600 hidden sm:inline">Rehberi</span></> : <>Istanbul <span className="text-blue-600 hidden sm:inline">Guide</span></>}
                  </span>
                </div>
                
                <div className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-slate-400">
                  <button onClick={() => setShowHowItWorks(true)} className="hover:text-blue-600 transition-colors uppercase">{t.about}</button>
                  <button 
                    onClick={() => {
                      setIsExplorerMode(true);
                      setIsSidebarOpen(false);
                      const mapEl = document.getElementById('map-container');
                      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="hover:text-blue-600 transition-colors uppercase"
                  >{t.goToMap}</button>
                  <button onClick={() => setIsSidebarOpen(true)} className="text-blue-600 uppercase">{t.createRoute}</button>
                  <button onClick={() => setShowHowItWorks(true)} className="hover:text-blue-600 transition-colors uppercase">{t.howItWorks}</button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button onClick={() => setLang('tr')} className={cn("px-3 py-1.5 text-[10px] font-black rounded-lg transition-all", lang === 'tr' ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-400")}>TR</button>
                    <button onClick={() => setLang('en')} className={cn("px-3 py-1.5 text-[10px] font-black rounded-lg transition-all", lang === 'en' ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-400")}>EN</button>
                  </div>
                  <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-600 transition-all"
                  >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </button>
                  <button className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <Menu size={24} />
                  </button>
                </div>
              </nav>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              {/* Sidebar */}
              {!isExplorerMode && (
                <aside className={cn(
                  "fixed inset-0 lg:relative lg:inset-auto w-full lg:w-[420px] border-r flex flex-col z-[1001] lg:z-40 transition-all duration-500 ease-out shadow-2xl lg:shadow-none",
                  theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:absolute"
                )}>
                {/* Sidebar Header */}
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                      {t.planner}
                    </h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Sidebar Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="p-8 space-y-8">
                      {routeData.length > 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-10 py-12">
                          <div className="relative">
                            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-pulse">
                              <i className="fas fa-check-circle text-6xl text-blue-600"></i>
                            </div>
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center text-blue-600"
                            >
                              <Sparkles size={20} />
                            </motion.div>
                          </div>
                          
                          <div className="text-center space-y-4">
                          <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                            {lang === 'tr' ? 'ROTANIZ HAZIR!' : 'ROUTE READY!'}
                          </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                              {lang === 'tr' ? 'Sizin için özel olarak hazırlanmış İstanbul macerasını keşfetmeye hazır mısınız?' : "Ready to discover the Istanbul adventure specially prepared for you?"}
                            </p>
                          </div>

                          {/* <button 
                            onClick={() => setIsViewingRoute(true)}
                            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-base uppercase tracking-[0.15em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                          >
                            <Calendar size={20} />
                            {lang === 'tr' ? 'GÜNLÜK ROTA PLANINIZ' : 'YOUR DAILY ROUTE PLAN'}
                          </button> */}
                        </div>
                      ) : (
                        <>
                          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8 border border-slate-200 dark:border-slate-700">
                            <button 
                              onClick={() => {
                                setActiveTab('otel');
                                setRouteData([]);
                                setIsViewingRoute(false);
                              }}
                              className={cn("flex-1 py-3.5 text-[13px] font-bold rounded-xl transition-all uppercase tracking-wider", activeTab === 'otel' ? "bg-white dark:bg-slate-700 shadow-xl text-blue-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400")}
                            >{t.hotelStart}</button>
                            <button 
                              onClick={() => {
                                setActiveTab('semt');
                                setRouteData([]);
                                setIsViewingRoute(false);
                              }}
                              className={cn("flex-1 py-3.5 text-[13px] font-bold rounded-xl transition-all uppercase tracking-wider", activeTab === 'semt' ? "bg-white dark:bg-slate-700 shadow-xl text-blue-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400")}
                            >{t.districtStart}</button>
                          </div>

                          {activeTab === 'otel' ? (
                            <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <HotelIcon size={16} /> {t.hotelLabel}
                      </label>
                              <select 
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none transition-all appearance-none cursor-pointer text-slate-800 dark:text-slate-200"
                                value={selectedHotel.isim}
                                onChange={(e) => {
                                  const hotel = ISTANBUL_DATA.populer_oteller.find(h => h.isim === e.target.value);
                                  if (hotel) setSelectedHotel(hotel);
                                }}
                              >
                                {ISTANBUL_DATA.populer_oteller.map(h => (
                                  <option key={h.isim} value={h.isim}>{lang === 'tr' ? h.isim : (h.isim_en || h.isim)}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className="space-y-2">
                      <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={16} /> {t.districtLabel}
                      </label>
                              <select 
                                className="w-full p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none transition-all appearance-none cursor-pointer text-slate-800 dark:text-slate-200"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                              >
                                {districts.map(d => (
                                  <option key={d} value={d}>{(t as any).districts?.[d] || d}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t.duration}: <span className="text-blue-600 font-black">{duration} {t.days}</span></label>
                            </div>
                            <input 
                              type="range" min="1" max="7" 
                              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              value={duration}
                              onChange={(e) => setDuration(parseInt(e.target.value))}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {t.dailyPace}
                                <div className="group relative">
                                  <Info size={14} className="text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
                                  <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-medium leading-relaxed rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
                                    {t.dailyPaceTooltip}
                                    <div className="absolute top-full left-2 -mt-1 border-4 border-transparent border-t-slate-900" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-blue-600 font-black">{t.paceScale[pace - 3]} ({pace})</span>
                            </label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                              {[3, 4, 5, 6].map(p => (
                                <button
                                  key={p}
                                  onClick={() => setPace(p)}
                                  className={cn(
                                    "flex-1 py-3 text-[14px] font-bold rounded-xl transition-all uppercase tracking-wider",
                                    pace === p ? "bg-white dark:bg-slate-700 shadow-xl text-blue-600" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                                  )}
                                >{p}</button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.interests}</label>
                            <div className="grid grid-cols-2 gap-3">
                              {prefOptions.map(pref => (
                                <button
                                  key={pref}
                                  onClick={() => togglePreference(pref)}
                                  className={cn(
                                    "p-4 rounded-2xl border-2 text-[12px] font-bold uppercase tracking-wider transition-all text-center",
                                    preferences.includes(pref) 
                                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-100 dark:hover:border-blue-900"
                                  )}
                                >
                                  {(t.cats as any)[pref] || pref}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                </div>

                {/* Fixed Action Area */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-20 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col gap-3">
                    {routeData.length === 0 && (
                        <button 
                          onClick={drawSmartRoute}
                          disabled={isGenerating}
                          className={cn(
                            "w-full py-6 text-white rounded-[2rem] font-bold text-base uppercase tracking-[0.2em] shadow-[0_25px_60px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
                            isGenerating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0"
                          )}
                        >
                        <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full", !isGenerating && "group-hover:animate-[shimmer_2s_infinite]")} />
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.calculating}
                          </>
                        ) : (
                          <>
                            {t.createRoute}
                            <Sparkles size={20} />
                          </>
                        )}
                      </button>
                    )}

                    {routeData.length > 0 && (
                      <button 
                        onClick={clearRoute}
                        className="w-full py-4 text-slate-500 hover:text-red-500 text-[13px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="fas fa-trash-alt"></i>
                        {lang === 'tr' ? 'ROTAYI TEMİZLE' : 'CLEAR ROUTE'}
                      </button>
                    )}
                  </div>
                </div>
              </aside>
            )}

              {/* Map Panel */}
              <div id="map-container" className="flex-1 h-full relative">
                {/* Floating Explorer Top Bar */}
                {isExplorerMode && (
                  <div className="absolute top-4 lg:top-6 left-1/2 -translate-x-1/2 z-[1000] w-[95%] lg:w-[90%] max-w-6xl">
                    <motion.div 
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-2 lg:p-4 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/20 dark:border-slate-700/30 flex items-center gap-2 lg:gap-4"
                    >
                      <button 
                        onClick={() => {
                          setIsExplorerMode(false);
                          setIsSidebarOpen(true);
                        }}
                        className="shrink-0 w-10 h-10 lg:w-14 lg:h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
                      >
                        <i className="fas fa-arrow-left text-sm lg:text-lg"></i>
                      </button>
                      
                      <div className="w-px h-6 lg:h-10 bg-slate-200/50 dark:bg-slate-700/50 mx-1 hidden sm:block" />
                      
                      <div className="flex-1 flex gap-2 lg:gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                        {prefOptions.map(pref => (
                          <button
                            key={pref}
                            onClick={() => togglePreference(pref)}
                            className={cn(
                              "px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-[12px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 lg:gap-3 border-2",
                              preferences.includes(pref) 
                                ? "bg-blue-600 text-white border-blue-500 shadow-[0_10px_25px_rgba(37,99,235,0.3)] scale-105" 
                                : "bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-800"
                            )}
                          >
                            <i className={cn("fa-solid text-xs lg:text-sm", catToIcon[pref])}></i>
                            <span>{(t.cats as any)[pref]}</span>
                          </button>
                        ))}
                      </div>

                      <div className="hidden lg:flex items-center gap-3 pr-2">
                        <div className="w-px h-10 bg-slate-200/50 dark:bg-slate-700/50 mx-2" />
                        <button 
                          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                          className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

                <MapContainer center={[41.015, 28.97]} zoom={13} zoomControl={false} className="w-full h-full">
                  <TileLayer 
                    url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} 
                    attribution='&copy; CARTO' 
                  />
                  
                  {routeData.length === 0 && ISTANBUL_DATA.turistik_mekanlar.filter(v => {
                    if (preferences.length === 0) return true;
                    
                    // Find venue's icon
                    let venueIcon = "fa-map-marker-alt";
                    for (const key in categoryMapping) {
                      if (v.tur.toLowerCase().includes(key.toLowerCase())) {
                        venueIcon = categoryMapping[key].icon;
                        break;
                      }
                    }

                    const matchesPref = preferences.some(p => catToIcon[p] === venueIcon);
                    return matchesPref;
                  }).map(v => (
                    <Marker 
                      key={v.isim}
                      position={[v.koordinat.enlem, v.koordinat.boylam]}
                      icon={createCategoryIcon(v.tur)}
                      eventHandlers={{ click: () => setSelectedVenue(v) }}
                    />
                  ))}

                  {/* Start Point Marker (Hotel or District) */}
                  {(routeData.length > 0 || (activeTab === 'otel' && selectedHotel) || (activeTab === 'semt' && selectedDistrict && DISTRICT_COORDS[selectedDistrict])) && (
                    <Marker 
                      position={activeTab === 'otel' ? [selectedHotel.koordinat.enlem, selectedHotel.koordinat.boylam] : [DISTRICT_COORDS[selectedDistrict]?.lat || 41.0082, DISTRICT_COORDS[selectedDistrict]?.lng || 28.9784]}
                      zIndexOffset={5000}
                      icon={L.divIcon({
                        className: 'start-marker',
                        html: `
                          <div class="user-location-marker" style="position: relative; display: flex; flex-direction: column; align-items: center;">
                            <div style="background-color: #3b82f6; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; border: 4px solid white; box-shadow: 0 8px 24px rgba(59,130,246,0.6); z-index: 2; transition: all 0.3s ease;">
                              <i class="fa-solid fa-hotel"></i>
                            </div>
                            <div style="position: absolute; bottom: -28px; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 9px; font-weight: 900; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 2px solid white; z-index: 3; text-transform: uppercase; letter-spacing: 0.1em;">
                              ${lang === 'tr' ? 'KONAKLAMA' : 'YOUR STAY'}
                            </div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; border-radius: 50%; background: #3b82f6; opacity: 0.3; z-index: 1;"></div>
                          </div>
                        `,
                        iconSize: [60, 60],
                        iconAnchor: [30, 30],
                      })}
                      eventHandlers={{
                        click: () => setSelectedVenue(null) // Close large modal if clicking accommodation
                      }}
                    />
                  )}

                  {routeData.map((day, dIdx) => {
                    if (visibleDay !== null && day.day !== visibleDay) return null;
                    const positions = day.venues.map(v => [v.koordinat.enlem, v.koordinat.boylam] as [number, number]);
                    
                    return (
                      <React.Fragment key={dIdx}>
                        <Polyline 
                          positions={positions}
                          pathOptions={{ 
                            color: dayColors[dIdx % dayColors.length], 
                            weight: 8, 
                            opacity: 0.2, 
                            lineCap: 'round',
                            lineJoin: 'round'
                          }}
                        />
                        <Polyline 
                          positions={positions}
                          pathOptions={{ 
                            color: dayColors[dIdx % dayColors.length], 
                            weight: 4, 
                            opacity: 0.9, 
                            lineCap: 'round',
                            lineJoin: 'round',
                            dashArray: '10, 15',
                            className: 'ant-path'
                          }}
                        />
                        {day.venues.map((v, vIdx) => (
                          <Marker 
                            key={`${dIdx}-${vIdx}`}
                            position={[v.koordinat.enlem, v.koordinat.boylam]}
                            icon={createCategoryIcon(v.tur, `${dIdx + 1}. ${t.day} - ${vIdx + 1}`, dayColors[dIdx % dayColors.length])}
                            zIndexOffset={2000}
                            eventHandlers={{
                              click: () => setSelectedVenue(v)
                            }}
                          />
                        ))}
                      </React.Fragment>
                    );
                  })}

                  <MapUpdater center={selectedVenue ? [selectedVenue.koordinat.enlem, selectedVenue.koordinat.boylam] : null} />
                  <RouteFitter routeData={visibleDay !== null ? routeData.filter(d => d.day === visibleDay) : routeData} />
                </MapContainer>

                {/* Venue Detail Overlay */}
                <AnimatePresence>
                  {selectedVenue && (
                    <motion.div 
                      key={selectedVenue.isim}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-[1500]"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row h-auto md:h-72">
                        <div className="w-full md:w-1/2 h-48 md:h-full relative group">
                          <WikiImage 
                            title={lang === 'tr' ? selectedVenue.isim : (selectedVenue.isim_en || selectedVenue.isim)} 
                            fallback={(selectedVenue as any).gorsel || DEFAULT_IMAGE} 
                            className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-8 left-8 right-8">
                             <div className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">
                               {lang === 'tr' ? selectedVenue.tur : (selectedVenue.tur_en || selectedVenue.tur)}
                             </div>
                             <div className="text-white text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-lg">
                               {lang === 'tr' ? selectedVenue.isim : (selectedVenue.isim_en || selectedVenue.isim)}
                             </div>
                          </div>
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between relative bg-white dark:bg-slate-900">
                          <button onClick={() => setSelectedVenue(null)} className="absolute right-6 top-6 p-2 text-slate-300 dark:text-slate-600 hover:text-blue-600 transition-colors">
                            <X size={20} />
                          </button>
                          
                          <div className="pr-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-3">
                              "{lang === 'tr' ? selectedVenue.kisa_tarihce : (selectedVenue.kisa_tarihce_en || selectedVenue.kisa_tarihce)}"
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-6">
                              <button 
                                onClick={() => {
                                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.koordinat.enlem},${selectedVenue.koordinat.boylam}`;
                                  window.open(url, '_blank');
                                }}
                                className="flex-1 bg-blue-600 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                              >
                                 <Compass size={16} /> <span className="inline-block">{t.directions}</span>
                              </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sidebar toggle button (floating) */}
                {!isSidebarOpen && !isExplorerMode && (
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-6 lg:top-10 left-6 lg:left-10 z-[1100] bg-white dark:bg-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-50 dark:border-slate-800 flex items-center gap-3 lg:gap-4 hover:scale-105 transition-all text-blue-600 group active:scale-95"
                  >
                    <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
                    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em]">{t.planner}</span>
                  </button>
                )}

                {/* Right Sidebar for Route Itinerary */}
                <AnimatePresence>
                  {isViewingRoute && (
                    <motion.aside 
                      initial={{ x: 420 }}
                      animate={{ x: isRightSidebarOpen ? 0 : 420 }}
                      className="absolute top-0 right-0 h-full w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-100 dark:border-slate-800 z-[1001] shadow-2xl flex"
                    >
                      {/* Toggle Handle */}
                      <button 
                        onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                        className="absolute right-full top-24 w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-l-2xl flex items-center justify-center text-blue-600 shadow-xl"
                      >
                        {isRightSidebarOpen ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 pr-2"><div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /><span className="text-[10px] font-black uppercase whitespace-nowrap">{lang === 'tr' ? 'PLANI GÖR' : 'VIEW PLAN'}</span></div>}
                      </button>

                      <div className="flex-1 flex flex-col w-[420px]">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                              {lang === 'tr' ? 'GÜNLÜK ROTA PLANI' : 'DAILY ROUTE PLAN'}
                            </h2>
                            <button onClick={() => setIsViewingRoute(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <X size={20} />
                            </button>
                          </div>

                          {/* Day Filter Bubbles */}
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => setVisibleDay(null)}
                              className={cn(
                                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                visibleDay === null ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600"
                              )}
                            >
                              {lang === 'tr' ? 'TÜMÜ' : 'ALL'}
                            </button>
                            {routeData.map((day) => (
                              <button 
                                key={day.day}
                                onClick={() => setVisibleDay(day.day)}
                                className={cn(
                                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                  visibleDay === day.day ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600"
                                )}
                              >
                                {t.day} {day.day}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                          {routeData.filter(d => visibleDay === null || d.day === visibleDay).map((day, idx) => (
                            <div key={day.day} className="space-y-4 relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                              <div className="absolute -left-[5px] top-0 w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div className="text-[10px] font-black text-blue-600 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">{t.day} {day.day}</div>
                              <div className="space-y-3">
                                {day.venues.map((v, vIdx) => (
                                  <motion.div 
                                    key={vIdx} 
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="group p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-blue-200 shadow-sm hover:shadow-2xl hover:shadow-blue-50 dark:hover:shadow-blue-900/20 transition-all cursor-pointer"
                                    onClick={() => setSelectedVenue(v)}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-fit h-8 px-3 bg-slate-900 dark:bg-slate-600 text-white text-[10px] font-black rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors uppercase whitespace-nowrap">
                                        {day.day}. {t.day} - {vIdx + 1}
                                      </div>
                                    <div className="flex-1 overflow-hidden">
                                      <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                        {lang === 'tr' ? v.isim : (v.isim_en || v.isim)}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        {lang === 'tr' ? v.tur : (v.tur_en || v.tur)}
                                      </div>
                                    </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <footer className={cn("h-14 border-t flex items-center px-10 justify-between shrink-0 z-50 transition-colors", theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-50")}>
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">© 2024 {t.title} v3.1</span>
              <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" /> {t.serverActive}</span>
                <span className="opacity-20 text-slate-400">|</span>
                <span className="text-slate-400 dark:text-slate-600">{t.dataStandards}</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it Works / About Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[4000] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-900 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-2xl w-full p-12 relative overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="absolute right-10 top-10 p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-700"
              >
                <X size={24} />
              </button>
              
              <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-blue-100">
                <Sparkles size={48} />
              </div>
              
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">{t.howItWorksTitle}</h2>
              <p className="text-lg text-slate-400 dark:text-slate-400 leading-relaxed mb-10 font-medium">
                {t.howItWorksDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-4"><Navigation size={24} /></div>
                  <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs uppercase tracking-widest mb-1">{t.optimization}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{t.optimizationDesc}</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-4"><CheckCircle2 size={24} /></div>
                  <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs uppercase tracking-widest mb-1">{t.typeFiltering}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{t.typeFilteringDesc}</p>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">{t.aboutTitle}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-400 leading-relaxed">{t.aboutDesc}</p>
              </div>
              
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-2xl shadow-slate-200 dark:shadow-none"
              >
                {t.ready}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
