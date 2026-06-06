import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  CheckCircle2, 
  Compass, 
  ChevronLeft,
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
  Moon,
  Headphones,
  Share,
  Download
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
  // Disabled per request so that map stays in its last left-off position
  return null;
}

function MapFlyer({ target }: { target: { center: [number, number], zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target.center, target.zoom, { duration: 1.5 });
    }
  }, [target, map]);
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

function MapResizer({ 
  isSidebarOpen, 
  isRightSidebarOpen, 
  isViewingRoute, 
  isExplorerMode 
}: { 
  isSidebarOpen: boolean; 
  isRightSidebarOpen: boolean; 
  isViewingRoute: boolean; 
  isExplorerMode: boolean; 
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately
    map.invalidateSize();

    // Invalidate periodically over the transition period (usually 300ms to 600ms)
    const timeouts = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 800].map(delay => 
      setTimeout(() => {
        map.invalidateSize();
      }, delay)
    );

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [map, isSidebarOpen, isRightSidebarOpen, isViewingRoute, isExplorerMode]);

  return null;
}

function VenueImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={cn("bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600", className)}>
        <Compass size={40} className="stroke-1 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Görsel Yok / No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn("object-cover", className)} 
      onError={() => {
        setError(true);
      }}
      referrerPolicy="no-referrer"
    />
  );
}

async function fetchVenues(): Promise<Venue[]> {
  try {
    const response = await fetch(
      "https://docs.google.com/spreadsheets/d/10mdxjbAvN30Biq5g0_YaQ3kHdqIhjkLCRnpI-4keGGE/export?format=tsv"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }
    const tsvText = await response.text();
    const lines = tsvText.split("\n").map(line => line.replace(/\r$/, ""));
    const parsedVenues: Venue[] = [];

    // Skip the header row (index 0) and parse data rows
    for (let i = 1; i < lines.length; i++) {
      const rowText = lines[i].trim();
      if (!rowText) continue;
      const sutun = lines[i].split("\t");

      let enlemVal = parseFloat(sutun[6] || "0");
      let boylamVal = parseFloat(sutun[7] || "0");

      if (isNaN(enlemVal) || isNaN(boylamVal) || enlemVal === 0 || boylamVal === 0) {
        continue;
      }

      // Automatically handle 10x scaled coordinates in spreadsheet if they exist
      if (Math.abs(enlemVal) > 90) {
        enlemVal = enlemVal / 10;
      }
      if (Math.abs(boylamVal) > 180) {
        boylamVal = boylamVal / 10;
      }

      const v: Venue = {
        isim: sutun[0]?.trim() || "",
        isim_en: sutun[1]?.trim() || sutun[0]?.trim() || "",
        tur: sutun[2]?.trim() || "",
        tur_en: sutun[3]?.trim() || sutun[2]?.trim() || "",
        kisa_tarihce: sutun[4]?.trim() || "",
        kisa_tarihce_en: sutun[5]?.trim() || sutun[4]?.trim() || "",
        koordinat: {
          enlem: enlemVal,
          boylam: boylamVal
        },
        gorsel: sutun[8] ? sutun[8].trim() : ""
      };

      parsedVenues.push(v);
    }
    return parsedVenues;
  } catch (err) {
    console.error("Error fetching TSV from Google Sheets:", err);
    return [];
  }
}

const loadHtml2Pdf = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      resolve(window.html2pdf);
      return;
    }

    const urls = [
      'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js',
      'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
    ];

    let index = 0;

    const tryLoad = () => {
      if (index >= urls.length) {
        reject(new Error("All PDF library CDNs failed to load."));
        return;
      }

      const script = document.createElement('script');
      script.src = urls[index];
      script.async = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        // @ts-ignore
        if (window.html2pdf) {
          // @ts-ignore
          resolve(window.html2pdf);
        } else {
          index++;
          tryLoad();
        }
      };

      script.onerror = () => {
        index++;
        tryLoad();
      };

      document.head.appendChild(script);
    };

    tryLoad();
  });
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<'otel' | 'semt' | 'konum'>('otel');
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(ISTANBUL_DATA.populer_oteller[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Fatih");
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenterState, setMapCenterState] = useState<{ center: [number, number], zoom: number } | null>(null);
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

  // New Smart UI states
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeAudioVenue, setActiveAudioVenue] = useState<Venue | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [speechOffsetCharIndex, setSpeechOffsetCharIndex] = useState<number>(0);

  // Reset audio playback seek offset when a different venue is loaded
  useEffect(() => {
    setSpeechOffsetCharIndex(0);
    setAudioProgress(0);
  }, [activeAudioVenue]);

  // Sharing, toast notification, auto-drawing, and download states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [shouldAutoDraw, setShouldAutoDraw] = useState<boolean>(false);

  // Weather Support & Optimization States
  const [dailyWeather, setDailyWeather] = useState<{ day: number, condition: 'Sunny' | 'Cloudy' | 'Light Rain' | 'Rainy', temp: number, pop: number }[]>([]);
  const [weatherOptimized, setWeatherOptimized] = useState<boolean>(false);
  const [weatherOptimizeEnabled, setWeatherOptimizeEnabled] = useState<boolean>(false);

  const generateMockWeather = (daysCount: number) => {
    const list = [];
    const states: { condition: 'Sunny' | 'Cloudy' | 'Light Rain' | 'Rainy', temp: number, pop: number }[] = [
      { condition: 'Sunny', temp: 24, pop: 10 },
      { condition: 'Light Rain', temp: 18, pop: 25 },
      { condition: 'Cloudy', temp: 21, pop: 15 },
      { condition: 'Rainy', temp: 15, pop: 85 },
      { condition: 'Sunny', temp: 26, pop: 5 },
      { condition: 'Light Rain', temp: 19, pop: 35 },
      { condition: 'Rainy', temp: 14, pop: 90 },
      { condition: 'Cloudy', temp: 22, pop: 20 },
      { condition: 'Sunny', temp: 25, pop: 8 },
      { condition: 'Rainy', temp: 13, pop: 95 }
    ];
    for (let d = 1; d <= daysCount; d++) {
      const info = states[(d - 1) % states.length];
      list.push({
        day: d,
        condition: info.condition,
        temp: info.temp,
        pop: info.pop
      });
    }
    return list;
  };

  const isOutdoorVenue = (v: Venue): boolean => {
    const tur = v.tur.toLowerCase();
    const outdoorFilters = ["park", "doğa", "koru", "orman", "bahçe", "sahil", "ada", "deniz", "manzara", "seyir", "meydan", "köy", "semt", "köprü", "hisar", "kale", "tema park"];
    return outdoorFilters.some(filter => tur.includes(filter));
  };

  const getWeatherEmoji = (condition: string) => {
    switch (condition) {
      case 'Sunny': return '☀️';
      case 'Cloudy': return '☁️';
      case 'Light Rain': return '🌦️';
      case 'Rainy': return '🌧️';
      default: return '☀️';
    }
  };

  const getWeatherDesc = (condition: string) => {
    if (lang === 'tr') {
      switch (condition) {
        case 'Sunny': return 'Güneşli';
        case 'Cloudy': return 'Bulutlu';
        case 'Light Rain': return 'Hafif Yağmurlu';
        case 'Rainy': return 'Kuvvetli Yağış';
        default: return 'Güneşli';
      }
    } else {
      switch (condition) {
        case 'Sunny': return 'Sunny';
        case 'Cloudy': return 'Cloudy';
        case 'Light Rain': return 'Light Rain';
        case 'Rainy': return 'Heavy Rain';
        default: return 'Sunny';
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load and keep the live speechSynthesis voice list in sync (even across async loads)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // SpeechSynthesis audio engine implementation for premium audio guide experience with real feedback
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    let isCurrent = true;

    if (activeAudioVenue && isAudioPlaying) {
      window.speechSynthesis.cancel(); // cancel any active narration first
      
      const fullText = getVenueNarration(activeAudioVenue);
      const totalTextLength = fullText.length;
      
      // Sliced text starting from the requested offset character index
      const textToSpeak = fullText.slice(speechOffsetCharIndex);
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'tr' ? 'tr-TR' : 'en-US';
      
      // Set the pitch and slightly slower rate for high-quality human narration tone
      utterance.pitch = 1.05;
      utterance.rate = 0.95;

      // Smart filtering priority arrays to prioritize the absolute best premium/native free voices
      const allVoices = window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | null = null;

      if (lang === 'tr') {
        selectedVoice = 
          allVoices.find(v => v.lang.startsWith('tr') && (v.name.includes('Yelda') || v.name.includes('Seda') || v.name.includes('Dilara'))) ||
          allVoices.find(v => v.lang.startsWith('tr') && v.name.includes('Natural') && !v.name.includes('Tolga') && !v.name.includes('Cem')) ||
          allVoices.find(v => v.lang.startsWith('tr') && v.name.includes('Google') && !v.name.includes('Tolga') && !v.name.includes('Cem')) ||
          allVoices.find(v => v.lang.startsWith('tr') && v.name.includes('Microsoft') && !v.name.includes('Tolga')) ||
          allVoices.find(v => v.lang.startsWith('tr') && !v.name.includes('Tolga') && !v.name.includes('Cem')) ||
          allVoices.find(v => v.lang.startsWith('tr'));
      } else {
        selectedVoice = 
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google US English')) ||
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Aria')) ||
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha')) ||
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Premium')) ||
          allVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
          allVoices.find(v => v.lang.startsWith('en'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onboundary = (event) => {
        if (!isCurrent) return;
        if (event.name === 'word') {
          // absolute char index is offset + the relative charIndex spoken in this slice
          const absoluteCharIndex = speechOffsetCharIndex + event.charIndex;
          const percentage = totalTextLength > 0 ? (absoluteCharIndex / totalTextLength) * 100 : 0;
          setAudioProgress(Math.min(100, Math.max(0, percentage)));
        }
      };

      utterance.onend = () => {
        if (!isCurrent) return;
        setIsAudioPlaying(false);
        setAudioProgress(100);
        setSpeechOffsetCharIndex(0);
      };

      utterance.onerror = (e) => {
        if (!isCurrent) return;
        // Don't turn off if it was just interrupted/cancelled deliberately for seeking
        if (e.error !== 'interrupted') {
          setIsAudioPlaying(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      isCurrent = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeAudioVenue, isAudioPlaying, lang, voices, speechOffsetCharIndex]);

  // Handler to seek to any percentage of the voice narration
  const handleSeek = (percentage: number) => {
    if (!activeAudioVenue) return;
    const fullText = getVenueNarration(activeAudioVenue);
    const totalTextLength = fullText.length;
    
    // Find approximate char position
    let targetCharIndex = Math.floor((percentage / 100) * totalTextLength);
    
    // Find the nearest word boundary/space to avoid splitting words
    if (targetCharIndex > 0 && targetCharIndex < totalTextLength) {
      const spaceBefore = fullText.lastIndexOf(' ', targetCharIndex);
      const spaceAfter = fullText.indexOf(' ', targetCharIndex);
      
      if (spaceBefore !== -1 && (spaceAfter === -1 || (targetCharIndex - spaceBefore < spaceAfter - targetCharIndex))) {
        targetCharIndex = spaceBefore + 1;
      } else if (spaceAfter !== -1) {
        targetCharIndex = spaceAfter + 1;
      }
    }
    
    setSpeechOffsetCharIndex(targetCharIndex);
    setAudioProgress(percentage);
    
    // Auto start playing when seeking (like standard media players)
    if (!isAudioPlaying) {
      setIsAudioPlaying(true);
    }
  };

  const getVenueNarration = (venue: Venue) => {
    const isTr = lang === 'tr';
    if (venue.isim.includes("Ayasofya") || venue.isim.includes("Hagia Sophia")) {
      return isTr 
        ? "Ayasofya, dünya mimarlık tarihinin günümüze ulaşan en görkemli yapılarından biridir. Bizans İmparatoru I. Justinianus tarafından yaptırılan bu başyapıt, Doğu ve Batı sentezinin en kutsal temsilcisidir."
        : "Hagia Sophia is one of the most magnificent architectural wonders of the world. Commissioned by Emperor Justinian, this masterpiece represents the sacred synthesis of East and West.";
    }
    if (venue.isim.includes("Topkapı") || venue.isim.includes("Topapi")) {
      return isTr
        ? "Topkapı Sarayı, 400 yıl boyunca Osmanlı padişahlarının yönetim ve ikamet merkezi olmuştur. Fatih Sultan Mehmet tarafından inşa ettirilen bu muazzam saray kompleksi, imparatorluk sırlarını barındırır."
        : "Topkapi Palace served as the administrative and royal residence of Ottoman sultans for nearly 400 years. Commissioned by Mehmed the Conqueror, it holds the deep secrets of an empire.";
    }
    const name = isTr ? venue.isim : (venue.isim_en || venue.isim);
    const summary = isTr ? venue.kisa_tarihce : (venue.kisa_tarihce_en || venue.kisa_tarihce);
    return isTr
      ? `${name}, İstanbul'un eşsiz tarihini ve zengin kültürünü yansıtan simgelerden biridir. Gözlerinizi kapatın ve bu harika mekanın asırlık hikayelerini dinleyin: ${summary}`
      : `${name} is one of the timeless symbols reflecting Istanbul's magnificent history and rich heritage. Close your eyes and listen to its century-old whispers: ${summary}`;
  };
  
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 240;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(true);

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
    const loadData = async () => {
      setIsLoadingVenues(true);
      const data = await fetchVenues();
      setVenues(data);
      setIsLoadingVenues(false);
    };
    loadData();

    // Preload the html2pdf library in the background
    loadHtml2Pdf().catch((err) => {
      console.warn("Background PDF preloading failed (will retry on usage):", err);
    });
  }, []);

  // Load query params on load and trigger auto routing
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const hotelParam = params.get('hotel');
      const districtParam = params.get('district');
      const daysParam = params.get('days');
      const tempoParam = params.get('tempo');
      const catsParam = params.get('cats');

      let hasRouteParams = false;

      if (tabParam === 'otel' || tabParam === 'semt' || tabParam === 'konum') {
        setActiveTab(tabParam as any);
        hasRouteParams = true;
      }
      if (tabParam === 'konum') {
        const lat = params.get('lat');
        const lng = params.get('lng');
        if (lat && lng) {
          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lng);
          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setUserLocation({ lat: parsedLat, lng: parsedLng });
          }
        }
      }
      if (hotelParam) {
        const foundHotel = ISTANBUL_DATA.populer_oteller.find(
          h => h.isim.toLowerCase() === hotelParam.toLowerCase() || h.isim.toLowerCase().includes(hotelParam.toLowerCase())
        );
        if (foundHotel) {
          setSelectedHotel(foundHotel);
        }
        hasRouteParams = true;
      }
      if (districtParam) {
        const foundDistrict = ALL_DISTRICTS.find(d => d.toLowerCase() === districtParam.toLowerCase());
        if (foundDistrict) {
          setSelectedDistrict(foundDistrict);
        }
        hasRouteParams = true;
      }
      if (daysParam) {
        const parsedDays = parseInt(daysParam, 10);
        if (!isNaN(parsedDays) && parsedDays >= 1 && parsedDays <= 10) {
          setDuration(parsedDays);
        }
        hasRouteParams = true;
      }
      if (tempoParam) {
        const parsedTempo = parseInt(tempoParam, 10);
        if (!isNaN(parsedTempo) && parsedTempo >= 1 && parsedTempo <= 10) {
          setPace(parsedTempo);
        }
        hasRouteParams = true;
      }
      if (catsParam) {
        const parsedCats = catsParam.split(',').filter(c => prefOptions.includes(c));
        if (parsedCats.length > 0) {
          setPreferences(parsedCats);
        }
        hasRouteParams = true;
      }

      if (hasRouteParams) {
        setActiveScreen('app');
        setShouldAutoDraw(true);
      }
    } catch (e) {
      console.warn("Error parsing URL params:", e);
    }
  }, []);

  // Monitor auto draw trigger
  useEffect(() => {
    if (shouldAutoDraw && !isLoadingVenues && venues.length > 0) {
      setShouldAutoDraw(false);
      drawSmartRoute();
    }
  }, [shouldAutoDraw, isLoadingVenues, venues]);

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

  const drawSmartRoute = async () => {
    setIsGenerating(true);
    setIsExplorerMode(false);

    // Dynamic URL Parameter Integration
    try {
      const urlParams = new URLSearchParams();
      urlParams.set('tab', activeTab);
      if (activeTab === 'otel') {
        urlParams.set('hotel', selectedHotel?.isim || '');
      } else if (activeTab === 'semt') {
        urlParams.set('district', selectedDistrict || '');
      } else if (activeTab === 'konum' && userLocation) {
        urlParams.set('lat', userLocation.lat.toString());
        urlParams.set('lng', userLocation.lng.toString());
      }
      urlParams.set('days', duration.toString());
      urlParams.set('tempo', pace.toString());
      if (preferences.length > 0) {
        urlParams.set('cats', preferences.join(','));
      }
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    } catch (urlErr) {
      console.warn("Could not sync state to URL:", urlErr);
    }

    let currentVenues = venues;
    if (isLoadingVenues || currentVenues.length === 0) {
      try {
        currentVenues = await fetchVenues();
        setVenues(currentVenues);
        setIsLoadingVenues(false);
      } catch (e) {
        console.error("Async/await fetch failed:", e);
      }
    }

    // Simulate a brief calculation time for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const filteredVenues = currentVenues.filter(v => {
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

    if (activeTab === 'konum' && !userLocation) {
      alert(lang === 'tr' ? "Lütfen önce konumunuzu alın veya konum izni verin." : "Please fetch your location first or grant location permission.");
      setIsGenerating(false);
      return;
    }

    let startPos = activeTab === 'otel' 
      ? { lat: selectedHotel.koordinat.enlem, lng: selectedHotel.koordinat.boylam }
      : activeTab === 'konum' && userLocation
      ? userLocation
      : (DISTRICT_COORDS[selectedDistrict] || { lat: 41.015, lng: 28.974 });

    const weatherList = generateMockWeather(duration);
    setDailyWeather(weatherList);
    let isOptimized = false;

    let unvisited = [...filteredVenues];
    const dailyRoutes: { day: number, venues: Venue[] }[] = [];
    
    for (let d = 1; d <= duration; d++) {
      const dayVenues: Venue[] = [];
      let currentPos = { ...startPos };
      const venuesPerDay = pace;
      
      const weatherObj = weatherList[d - 1];
      const isSubstantialRain = weatherObj && weatherObj.condition === 'Rainy' && weatherObj.pop >= 40;
      const isRainy = weatherOptimizeEnabled && isSubstantialRain;

      // Weather optimization: prefer indoor venues during rainy days
      let useIndoorOnly = false;
      if (isRainy) {
        const indoorUnvisitedExist = unvisited.some(v => !isOutdoorVenue(v));
        if (indoorUnvisitedExist) {
          useIndoorOnly = true;
          isOptimized = true;
        }
      }

      for (let i = 0; i < venuesPerDay; i++) {
        if (unvisited.length === 0) break;

        let nearestIdx = -1;
        let minDistance = Infinity;

        unvisited.forEach((v, idx) => {
          if (useIndoorOnly && isOutdoorVenue(v)) {
            return; // Skip outdoor venues during rainy days if indoor options remain
          }
          const dist = getDistance(currentPos.lat, currentPos.lng, v.koordinat.enlem, v.koordinat.boylam);
          if (dist < minDistance) {
            minDistance = dist;
            nearestIdx = idx;
          }
        });

        // Fallback: if we were searching for indoor only but empty, try all unvisited
        if (nearestIdx === -1 && useIndoorOnly) {
          unvisited.forEach((v, idx) => {
            const dist = getDistance(currentPos.lat, currentPos.lng, v.koordinat.enlem, v.koordinat.boylam);
            if (dist < minDistance) {
              minDistance = dist;
              nearestIdx = idx;
            }
          });
        }

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

    setWeatherOptimized(isOptimized);
    setRouteData(dailyRoutes);
    setIsGenerating(false);
    setIsSidebarOpen(false);
    setIsViewingRoute(true);
    setIsRightSidebarOpen(true);
    setVisibleDay(null);
  };

  const clearRoute = () => {
    setRouteData([]);
    setIsViewingRoute(false);
    setVisibleDay(null);
    setDailyWeather([]);
    setWeatherOptimized(false);
    setSelectedVenue(null);
    setMapCenterState({ center: [41.015, 28.97], zoom: 13 });
  };

  const handleStartFromLocation = () => {
    setActiveTab('konum');
    setRouteData([]);
    setIsViewingRoute(false);
    
    if (userLocation) {
      setMapCenterState({ center: [userLocation.lat, userLocation.lng], zoom: 15 });
      return;
    }

    setIsLocating(true);
    if (!navigator.geolocation) {
      alert(lang === 'tr' ? "Tarayıcınız konum servisini desteklemiyor." : "Geolocation is not supported by your browser.");
      setActiveTab('otel');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);
        setIsLocating(false);
        setMapCenterState({ center: [latitude, longitude], zoom: 15 });
      },
      (error) => {
        console.error("Error getting location", error);
        let errorMsg = lang === 'tr' ? "Konumunuz alınamadı." : "Could not retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = lang === 'tr' 
            ? "Konum izni reddedildi. Lütfen tarayıcı ayarlarınızdan izin verin." 
            : "Location permission denied. Please allow it in browser settings.";
        }
        alert(errorMsg);
        setActiveTab('otel');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleShareRoute = () => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.set('tab', activeTab);
      if (activeTab === 'otel') {
        urlParams.set('hotel', selectedHotel?.isim || '');
      } else if (activeTab === 'semt') {
        urlParams.set('district', selectedDistrict || '');
      } else if (activeTab === 'konum' && userLocation) {
        urlParams.set('lat', userLocation.lat.toString());
        urlParams.set('lng', userLocation.lng.toString());
      }
      urlParams.set('days', duration.toString());
      urlParams.set('tempo', pace.toString());
      if (preferences.length > 0) {
        urlParams.set('cats', preferences.join(','));
      }
      const fullShareUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
      
      navigator.clipboard.writeText(fullShareUrl).then(() => {
        showToast(lang === 'tr' ? 'Rota linki panoya kopyalandı!' : 'Route link copied to clipboard!');
      }).catch(err => {
        console.error("Could not copy link:", err);
        showToast(lang === 'tr' ? 'Link kopyalanamadı.' : 'Could not copy link.');
      });
    } catch (e) {
      console.error(e);
      showToast(lang === 'tr' ? 'Hata oluştu.' : 'An error occurred.');
    }
  };

  const handleDownloadPDF = async () => {
    if (routeData.length === 0) return;
    setIsDownloadingPDF(true);

    let html2pdfLib: any;
    try {
      html2pdfLib = await loadHtml2Pdf();
    } catch (err) {
      console.error("Could not load pdf library dynamic load:", err);
      setIsDownloadingPDF(false);
      showToast(lang === 'tr' ? 'PDF kütüphanesi yüklenemedi.' : 'PDF library could not be loaded.');
      return;
    }

    // Capture Leaflet Map snapshot safely using html2canvas before template build
    let mapImageSrc = "";
    try {
      const mapElement = document.getElementById('map-container');
      // @ts-ignore
      const h2c = window.html2canvas;
      if (h2c && mapElement) {
        // Allow map layer tiles to fully load and settle before capture
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mapCanvas = await h2c(mapElement, {
          useCORS: true,
          allowTaint: false,
          logging: false,
          scale: 1.5,
          ignoreElements: (el: HTMLElement) => {
            return !!(el.classList && (
              el.classList.contains('leaflet-control-container') ||
              el.classList.contains('leaflet-draw')
            ));
          }
        });
        mapImageSrc = mapCanvas.toDataURL('image/jpeg', 0.9);
      }
    } catch (mapErr) {
      console.warn("Leaflet map capture skipped in PDF export:", mapErr);
    }

    // Create custom offscreen container for PDF generation (ensuring physical layout calculations work correctly)
    const container = document.createElement('div');
    container.id = 'pdf-print-container';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '790px'; // Standard printed single-page width
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#1e293b';
    container.style.fontFamily = 'Inter, system-ui, sans-serif';
    container.style.display = 'block';
    container.style.visibility = 'visible';

    const startingPoint = activeTab === 'otel' ? selectedHotel.isim : activeTab === 'konum' ? (lang === 'tr' ? 'Mevcut Konumunuz' : 'Your Current Location') : selectedDistrict;
    const catLabels = preferences.map(pref => (TRANSLATIONS[lang].cats as any)[pref] || pref).join(', ');

    container.innerHTML = `
      <div style="border-bottom: 2px solid #ebf2ff; padding-bottom: 24px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 26px; font-weight: 800; color: #1e3a8a; margin: 0; text-transform: uppercase; letter-spacing: -0.025em; line-height: 1.2;">İSTANBUL SEYAHAT PLANI</h1>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">${lang === 'tr' ? 'AKILLI ROTASYON REHBERİ' : 'DYNAMIC SMART TRAVEL GUIDE'}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: 700; color: #0284c7; background-color: #f0f9ff; padding: 4px 12px; border-radius: 9999px; display: inline-block; font-family: monospace;">
              ${new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px; background-color: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid #f1f5f9;">
          <div>
            <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">${lang === 'tr' ? 'BAŞLANGIÇ NOKTASI' : 'STARTING POINT'}</span>
            <span style="font-size: 12px; font-weight: 750; color: #0f172a;">${startingPoint}</span>
          </div>
          <div>
            <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">${lang === 'tr' ? 'SÜRE VE TEMPO' : 'DURATION & PACE'}</span>
            <span style="font-size: 12px; font-weight: 750; color: #0f172a;">${duration} ${lang === 'tr' ? 'Gün' : 'Days'} • ${pace} ${lang === 'tr' ? 'Mekan/Gün' : 'Venues/Day'}</span>
          </div>
          <div style="grid-column: span 2;">
            <span style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 2px;">${lang === 'tr' ? 'SEÇİLİ İLGİ ALANLARI' : 'SELECTED INTERESTS'}</span>
            <span style="font-size: 11px; font-weight: 600; color: #475569;">${catLabels || (lang === 'tr' ? 'Tümü' : 'All')}</span>
          </div>
        </div>
      </div>

      ${mapImageSrc ? `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 8px;">
            🗺️ ${lang === 'tr' ? 'SEYAHAT ROTASI HARİTASI' : 'TRAVEL ROUTE MAP'}
          </h2>
          <div style="border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; height: 320px; background-color: #f8fafc; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
            <img referrerPolicy="no-referrer" src="${mapImageSrc}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
        </div>
      ` : ''}

      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${routeData.map(day => {
          const weatherObj = dailyWeather.find(w => w.day === day.day);
          const weatherBadge = weatherObj 
            ? `<div style="font-size: 11px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 5px; background-color: #f1f5f9; padding: 4px 10px; border-radius: 9999px;">
                 <span>${getWeatherEmoji(weatherObj.condition)}</span>
                 <span>${getWeatherDesc(weatherObj.condition)}</span>
                 <span>•</span>
                 <span>${weatherObj.temp}°C</span>
               </div>`
            : '';
          return `
            <div style="background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 20px; page-break-inside: avoid; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="background-color: #2563eb; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800;">${day.day}</span>
                  <h2 style="font-size: 14px; font-weight: 800; color: #1e293b; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">${day.day}. ${lang === 'tr' ? 'GÜN PLANI' : 'DAY PLAN'}</h2>
                </div>
                ${weatherBadge}
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 14px;">
                ${day.venues.map((v, vIdx) => `
                  <div style="display: flex; gap: 14px;">
                    <div style="width: 22px; font-size: 11px; font-weight: 800; color: #2563eb; display: flex; align-items: center; justify-content: center; height: 22px; background-color: #eff6ff; border-radius: 8px; shrink: 0;">
                      ${vIdx + 1}
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-size: 12px; font-weight: 750; color: #0f172a; margin: 0; text-transform: uppercase;">
                        ${lang === 'tr' ? v.isim : (v.isim_en || v.isim)}
                      </h3>
                      <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">
                        ${lang === 'tr' ? v.tur : (v.tur_en || v.tur)}
                      </div>
                      <p style="font-size: 11px; color: #475569; margin: 6px 0 0 0; line-height: 1.5; font-style: italic;">
                        "${lang === 'tr' ? v.kisa_tarihce : (v.kisa_tarihce_en || v.kisa_tarihce)}"
                      </p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center; font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
        ${lang === 'tr' ? 'İSTANBUL SEYAHAT REHBERİ YAPAY ZEKA AKILLI PLANLAMA MOTORU' : 'GENERATED BY ISTANBUL SMART TRAVEL AI PLANNING ENGINE'}
      </div>
    `;

    document.body.appendChild(container);

    // Wait for the browser to parse HTML and completely load/decode any static/dynamic imagery including map snapshot
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      return new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Always resolve to ensure rendering doesn't freeze in case of a CDN fallback failure
        }
      });
    }));

    // Pause briefly for layout stabilization
    await new Promise(resolve => setTimeout(resolve, 300));

    const opt = {
      margin:       12,
      filename:     `istanbul-seyahat-plani-${duration}-gunluk.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        allowTaint: false,
        logging: false,
        scrollX: 0, 
        scrollY: 0,
        onclone: (clonedDoc: any) => {
          // Inside the cloned rendering context, ensure container positions beautifully
          const target = clonedDoc.getElementById('pdf-print-container');
          if (target) {
            target.style.position = 'relative';
            target.style.left = '0';
            target.style.top = '0';
          }
        }
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (html2pdfLib) {
      html2pdfLib().from(container).set(opt).save().then(() => {
        document.body.removeChild(container);
        setIsDownloadingPDF(false);
        showToast(lang === 'tr' ? 'PDF başarıyla indirildi!' : 'PDF downloaded successfully!');
      }).catch((e: any) => {
        console.error("PDF generation err:", e);
        try { document.body.removeChild(container); } catch (_) {}
        setIsDownloadingPDF(false);
        showToast(lang === 'tr' ? 'Yükleme sırasında hata oluştu.' : 'Error generating PDF.');
      });
    } else {
      try { document.body.removeChild(container); } catch (_) {}
      setIsDownloadingPDF(false);
      showToast(lang === 'tr' ? 'Yükleme sırasında hata oluştu.' : 'Error generating PDF.');
    }
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
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl sm:rounded-[2rem] mx-auto mb-6 sm:mb-10 flex items-center justify-center shadow-2xl">
                <Compass size={32} className="text-white sm:hidden" />
                <Compass size={48} className="text-white hidden sm:block" />
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-9xl font-serif font-black mb-4 sm:mb-6 tracking-tighter drop-shadow-2xl">
                {lang === 'tr' ? <>{t.discover.split(' ')[0]} <br/> <span className="italic text-blue-200">{t.discover.split(' ')[1]}</span></> : <>{t.discover.split(' ')[0]} <span className="italic text-blue-200">{t.discover.split(' ')[1]}</span></>}.
              </h1>
              <p className="text-sm sm:text-xl lg:text-3xl text-blue-50 max-w-xl sm:max-w-3xl mx-auto mb-8 sm:mb-14 font-medium leading-relaxed opacity-90">
                {t.subtitle}
              </p>
              <button 
                onClick={() => setActiveScreen('app')}
                className="bg-white text-blue-600 px-8 sm:px-16 py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] text-lg sm:text-2xl font-black hover:bg-blue-50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 sm:gap-4 mx-auto active:scale-95 group"
              >
                {t.start}
                <ChevronRight size={24} className="sm:hidden group-hover:translate-x-1 transition-transform" />
                <ChevronRight size={32} className="hidden sm:block group-hover:translate-x-1 transition-transform" />
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
                
                <div className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-150">
                  <button onClick={() => setShowHowItWorks(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase">{t.about}</button>
                  <button 
                    onClick={() => {
                      clearRoute();
                      setIsExplorerMode(true);
                      setIsSidebarOpen(false);
                      setIsRightSidebarOpen(false);
                      const mapEl = document.getElementById('map-container');
                      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase"
                  >{t.goToMap}</button>
                  <button onClick={() => setIsSidebarOpen(true)} className="text-blue-600 dark:text-blue-400 uppercase">{t.createRoute}</button>
                  <button onClick={() => setShowHowItWorks(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase">{t.howItWorks}</button>
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
                  <button 
                    className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white active:scale-95 transition-transform" 
                    onClick={() => setIsMobileNavOpen(true)}
                  >
                    <Menu size={24} />
                  </button>
                </div>
              </nav>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              {/* Sidebar */}
              {!isExplorerMode && (
                <aside className={cn(
                  "fixed inset-0 lg:relative lg:inset-auto w-full lg:w-[420px] border-r flex flex-col z-[1200] lg:z-40 transition-all duration-500 ease-out shadow-2xl lg:shadow-none",
                  theme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:absolute"
                )}>
                {/* Sidebar Header */}
                <div className={cn("p-6 md:p-8 border-b shrink-0", theme === 'dark' ? "border-slate-800" : "border-slate-200")}>
                  <div className="flex items-center justify-between">
                    <h2 className={cn("text-[11px] md:text-[13px] font-black uppercase tracking-[0.25em]", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {t.planner}
                    </h2>
                    <button 
                      onClick={() => setIsSidebarOpen(false)} 
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center active:scale-95 transition-all border",
                        theme === 'dark' 
                          ? "bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-red-400 border-slate-700" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-600 border-slate-250"
                      )}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Sidebar Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                      {routeData.length > 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-10 py-12">
                          <div className="relative">
                            <div className={cn("w-32 h-32 rounded-full flex items-center justify-center animate-pulse", theme === 'dark' ? "bg-blue-900/20" : "bg-blue-50")}>
                              <i className="fas fa-check-circle text-6xl text-blue-500"></i>
                            </div>
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className={cn("absolute -top-2 -right-2 w-10 h-10 rounded-full shadow-xl flex items-center justify-center text-blue-500 border", theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100")}
                            >
                              <Sparkles size={20} />
                            </motion.div>
                          </div>
                          
                          <div className="text-center space-y-4">
                          <h3 className={cn("text-2xl font-black uppercase tracking-[0.2em]", theme === 'dark' ? "text-white" : "text-slate-900")}>
                            {lang === 'tr' ? 'ROTANIZ HAZIR!' : 'ROUTE READY!'}
                          </h3>
                            <p className={cn("text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                              {lang === 'tr' ? 'Sizin için özel olarak hazırlanmış İstanbul macerasını keşfetmeye hazır mısınız?' : "Ready to discover the Istanbul adventure specially prepared for you?"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={cn("flex p-1.5 rounded-2xl mb-8 border gap-1", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200")}>
                            <button 
                              onClick={() => {
                                  setActiveTab('otel');
                                  setRouteData([]);
                                  setIsViewingRoute(false);
                              }}
                              className={cn(
                                "flex-1 py-3 px-1 text-[11px] sm:text-[12px] font-black rounded-xl transition-all uppercase tracking-wider", 
                                activeTab === 'otel' 
                                  ? "bg-blue-600 text-white shadow-xl" 
                                  : (theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                              )}
                            >{t.hotelStart}</button>
                            <button 
                              onClick={() => {
                                  setActiveTab('semt');
                                  setRouteData([]);
                                  setIsViewingRoute(false);
                              }}
                              className={cn(
                                "flex-1 py-3 px-1 text-[11px] sm:text-[12px] font-black rounded-xl transition-all uppercase tracking-wider", 
                                activeTab === 'semt' 
                                  ? "bg-blue-600 text-white shadow-xl" 
                                  : (theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                              )}
                            >{t.districtStart}</button>
                            <button 
                              onClick={handleStartFromLocation}
                              className={cn(
                                "flex-1 py-3 px-1 text-[11px] sm:text-[12px] font-black rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1", 
                                activeTab === 'konum' 
                                  ? "bg-blue-600 text-white shadow-xl" 
                                  : (theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                              )}
                            >
                              <MapPin size={12} className={cn(isLocating && "animate-spin")} />
                              {isLocating ? (lang === 'tr' ? 'Konum...' : 'Locating...') : t.locationStart}
                            </button>
                          </div>

                          {activeTab === 'otel' ? (
                            <div className="space-y-2">
                              <label className={cn("text-[12px] font-black uppercase tracking-widest flex items-center gap-2", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                <HotelIcon size={16} className="text-blue-500" /> {t.hotelLabel}
                              </label>
                              <select 
                                className={cn(
                                  "w-full p-4 rounded-2xl text-sm font-black outline-none transition-all appearance-none cursor-pointer border", 
                                  theme === 'dark' 
                                    ? "bg-slate-950 border-slate-800 text-white" 
                                    : "bg-slate-50 border-slate-300 text-slate-900"
                                )}
                                value={selectedHotel.isim}
                                onChange={(e) => {
                                  const hotel = ISTANBUL_DATA.populer_oteller.find(h => h.isim === e.target.value);
                                  if (hotel) setSelectedHotel(hotel);
                                }}
                              >
                                {[...ISTANBUL_DATA.populer_oteller]
                                  .sort((a, b) => {
                                    const nameA = lang === 'tr' ? a.isim : (a.isim_en || a.isim);
                                    const nameB = lang === 'tr' ? b.isim : (b.isim_en || b.isim);
                                    return nameA.localeCompare(nameB, lang === 'tr' ? 'tr' : 'en');
                                  })
                                  .map(h => (
                                    <option key={h.isim} value={h.isim} className={cn("font-bold", theme === 'dark' ? "bg-slate-950 text-white" : "bg-white text-slate-900")}>{lang === 'tr' ? h.isim : (h.isim_en || h.isim)}</option>
                                  ))}
                              </select>
                            </div>
                          ) : activeTab === 'semt' ? (
                            <div className="space-y-2">
                              <label className={cn("text-[12px] font-black uppercase tracking-widest flex items-center gap-2", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                <MapPin size={16} className="text-blue-500" /> {t.districtLabel}
                              </label>
                              <select 
                                className={cn(
                                  "w-full p-4 rounded-2xl text-sm font-black outline-none transition-all appearance-none cursor-pointer border",
                                  theme === 'dark' 
                                    ? "bg-slate-950 border-slate-800 text-white" 
                                    : "bg-slate-50 border-slate-300 text-slate-900"
                                )}
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                              >
                                {districts.map(d => (
                                  <option key={d} value={d} className={cn("font-bold", theme === 'dark' ? "bg-slate-950 text-white" : "bg-white text-slate-900")}>{(t as any).districts?.[d] || d}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div className={cn("space-y-4 p-4 rounded-2xl border", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200")}>
                              <div className="flex items-center gap-3">
                                <MapPin size={24} className="text-blue-500 shrink-0" />
                                <div>
                                  <h4 className={cn("text-sm font-black", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    {lang === 'tr' ? 'Canlı Konum Başlangıcı' : 'Live Location Start'}
                                  </h4>
                                  <p className={cn("text-[11px] font-bold", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                                    {lang === 'tr' ? 'Başlangıç noktasını cihaz konumunuz olarak atar.' : 'Sets coordinate-locked live position as start point.'}
                                  </p>
                                </div>
                              </div>
                              
                              {isLocating ? (
                                <div className="flex items-center gap-2 text-xs text-blue-400 font-bold p-1">
                                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                  <span>{lang === 'tr' ? 'Konum aranıyor...' : 'Locating...'}</span>
                                </div>
                              ) : userLocation ? (
                                <div className="space-y-2">
                                  <div className={cn("text-xs font-black flex items-center gap-1.5", theme === 'dark' ? "text-emerald-400" : "text-emerald-600")}>
                                    <div className={cn("w-2 h-2 rounded-full bg-emerald-400 animate-ping", theme === 'dark' ? "bg-emerald-400" : "bg-emerald-500")} />
                                    <span>{lang === 'tr' ? 'Konum Başarıyla Kilitlendi!' : 'Location Successfully Locked!'}</span>
                                  </div>
                                  <div className={cn("font-mono text-[12px] font-black p-2.5 border rounded-xl", theme === 'dark' ? "text-white bg-slate-900 border-slate-800" : "text-slate-950 bg-slate-50 border-slate-300")}>
                                    {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleStartFromLocation}
                                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2"
                                >
                                  <MapPin size={14} />
                                  {lang === 'tr' ? 'CANLI KONUM AL' : 'GET LIVE LOCATION'}
                                </button>
                              )}
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className={cn("text-[13px] font-black uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                {t.duration}: <span className={cn("font-black", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>{duration} {t.days}</span>
                              </label>
                            </div>
                            <input 
                              type="range" min="1" max="7" 
                              className={cn("w-full h-3 rounded-lg appearance-none cursor-pointer accent-blue-600 border", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-200 border-slate-300")}
                              value={duration}
                              onChange={(e) => setDuration(parseInt(e.target.value))}
                            />
                          </div>

                          <div className="space-y-4">
                            <label className={cn("text-[13px] font-black uppercase tracking-widest flex items-center justify-between", theme === 'dark' ? "text-white" : "text-slate-900")}>
                              <div className="flex items-center gap-2">
                                {t.dailyPace}
                                <div className="group relative">
                                  <Info size={14} className="text-slate-400 hover:text-blue-500 transition-colors cursor-help" />
                                  <div className={cn("hidden group-hover:block absolute left-0 bottom-full mb-2 w-48 p-3 text-white text-[10px] font-medium leading-relaxed rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in duration-200 border", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-900 border-slate-950")}>
                                    {t.dailyPaceTooltip}
                                    <div className={cn("absolute top-full left-2 -mt-1 border-4 border-transparent", theme === 'dark' ? "border-t-slate-950" : "border-t-slate-900")} />
                                  </div>
                                </div>
                              </div>
                              <span className={cn("font-black", theme === 'dark' ? "text-blue-400" : "text-blue-600")}>{t.paceScale[pace - 3]} ({pace})</span>
                            </label>
                            <div className={cn("flex p-1.5 rounded-2xl border gap-1", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200")}>
                              {[3, 4, 5, 6].map(p => (
                                <button
                                  key={p}
                                  onClick={() => setPace(p)}
                                  className={cn(
                                    "flex-1 py-3 text-[14px] font-black rounded-xl transition-all uppercase tracking-wider",
                                    pace === p 
                                      ? "bg-blue-600 text-white shadow-xl" 
                                      : (theme === 'dark' ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
                                  )}
                                >{p}</button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className={cn("text-[13px] font-black uppercase tracking-widest flex items-center justify-between", theme === 'dark' ? "text-white" : "text-slate-900")}>
                              <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => setWeatherOptimizeEnabled(!weatherOptimizeEnabled)}>
                                <span className="text-sm shrink-0">🌦️</span>
                                <span>{lang === 'tr' ? 'HAVA DURUMU OPTİMİZASYONU' : 'WEATHER OPTIMIZATION'}</span>
                              </div>
                              <span className={cn("font-black tracking-wider text-[11px]", weatherOptimizeEnabled ? (theme === 'dark' ? "text-emerald-400" : "text-emerald-600") : "text-slate-400")}>
                                {weatherOptimizeEnabled ? (lang === 'tr' ? 'AKTİF' : 'ACTIVE') : (lang === 'tr' ? 'KAPALI' : 'DISABLED')}
                              </span>
                            </label>
                            <div className={cn("p-4 rounded-2xl border flex justify-between items-center gap-4", theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200")}>
                              <div className={cn("text-[11px] leading-relaxed font-bold", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
                                {lang === 'tr'
                                  ? 'Aktif yağış tahminlerinde açık hava mekanlarını (parklar vb.) yağmurlu günlerden kapalı mekan etkinlikleriyle otomatik olarak yer değiştirir.'
                                  : 'Automatically switches outdoor locations with indoor alternatives on heavily forecasted rainy days.'}
                              </div>
                              <button
                                type="button"
                                onClick={() => setWeatherOptimizeEnabled(!weatherOptimizeEnabled)}
                                className={cn(
                                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                  weatherOptimizeEnabled ? "bg-blue-600" : (theme === 'dark' ? "bg-slate-800" : "bg-slate-300")
                                )}
                              >
                                <span
                                  className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                                    weatherOptimizeEnabled ? "translate-x-5" : "translate-x-0"
                                  )}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className={cn("text-[12px] font-black uppercase tracking-widest", theme === 'dark' ? "text-white" : "text-slate-900")}>
                              {t.interests}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {prefOptions.map(pref => (
                                <button
                                  key={pref}
                                  onClick={() => togglePreference(pref)}
                                  className={cn(
                                    "p-4 rounded-2xl border-2 text-[12px] font-black uppercase tracking-wider transition-all text-center",
                                    preferences.includes(pref) 
                                      ? "bg-blue-600 border-blue-600 text-white shadow-lg" 
                                      : (theme === 'dark' 
                                          ? "bg-slate-950 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white" 
                                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                                        )
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
                <div className={cn(
                  "p-6 border-t backdrop-blur-xl z-20 shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.15)]",
                  theme === 'dark' ? "border-slate-800 bg-slate-900/95" : "border-slate-200 bg-white/95"
                )}>
                  <div className="flex flex-col gap-3">
                    {routeData.length === 0 && (
                        <button 
                          onClick={drawSmartRoute}
                          disabled={isGenerating || isLoadingVenues}
                          className={cn(
                            "w-full py-6 text-white rounded-[2rem] font-bold text-base uppercase tracking-[0.2em] shadow-[0_25px_60px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
                            (isGenerating || isLoadingVenues) ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0"
                          )}
                        >
                        <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full", !(isGenerating || isLoadingVenues) && "group-hover:animate-[shimmer_2s_infinite]")} />
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t.calculating}
                          </>
                        ) : isLoadingVenues ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {lang === 'tr' ? 'VERİLER YÜKLENİYOR...' : 'LOADING DATA...'}
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
                      <div className="flex flex-col gap-2 w-full">
                        <button 
                          onClick={handleShareRoute}
                          className="w-full h-12 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-950/40 active:scale-95"
                        >
                          <Share size={15} />
                          {lang === 'tr' ? 'ROTAYI PAYLAŞ' : 'SHARE ROUTE'}
                        </button>
                        <button 
                          onClick={clearRoute}
                          className="w-full py-3.5 text-slate-500 hover:text-red-500 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-trash-alt"></i>
                          {lang === 'tr' ? 'ROTAYI TEMİZLE' : 'CLEAR ROUTE'}
                        </button>
                      </div>
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
                      
                      <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
                        {/* Left Scroll Button */}
                        <button 
                          onClick={() => scrollCategories('left')}
                          className="shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-200/40 dark:border-slate-700/40"
                          title="Sola Kaydır"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <div 
                          ref={categoryScrollRef}
                          className="flex-1 flex gap-2 lg:gap-3 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
                        >
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

                        {/* Right Scroll Button */}
                        <button 
                          onClick={() => scrollCategories('right')}
                          className="shrink-0 w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-200/40 dark:border-slate-700/40"
                          title="Sağa Kaydır"
                        >
                          <ChevronRight size={16} />
                        </button>
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

                {isLoadingVenues ? (
                  <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4 transition-colors">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin shadow-sm" />
                    <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                      {lang === 'tr' ? 'Keşfedilecek mekanlar yükleniyor...' : 'Loading venues to explore...'}
                    </p>
                  </div>
                ) : (
                  <MapContainer 
                    center={[41.015, 28.97]} 
                    zoom={13} 
                    zoomControl={false} 
                    className="w-full h-full" 
                    preferCanvas={true} 
                    minZoom={10} 
                    maxZoom={18}
                    maxBounds={[[40.60, 27.9], [41.45, 29.85]]}
                    maxBoundsViscosity={1.0}
                    worldCopyJump={false}
                  >
                    <TileLayer 
                      url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} 
                      attribution='&copy; CARTO' 
                      crossOrigin="anonymous"
                      noWrap={true}
                    />
                    
                    {routeData.length === 0 && venues.filter(v => {
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

                    {/* Start Point Marker (Hotel or District or Current Location) */}
                    {(routeData.length > 0 || 
                      (activeTab === 'otel' && selectedHotel) || 
                      (activeTab === 'semt' && selectedDistrict && DISTRICT_COORDS[selectedDistrict]) ||
                      (activeTab === 'konum' && userLocation)) && (
                      <Marker 
                        position={
                          activeTab === 'otel' 
                            ? [selectedHotel.koordinat.enlem, selectedHotel.koordinat.boylam] 
                            : activeTab === 'konum' && userLocation
                            ? [userLocation.lat, userLocation.lng]
                            : [DISTRICT_COORDS[selectedDistrict]?.lat || 41.0082, DISTRICT_COORDS[selectedDistrict]?.lng || 28.9784]
                        }
                        zIndexOffset={5000}
                        icon={L.divIcon({
                          className: 'completely-invisible-leaflet-wrapper',
                          html: `
                            <div class="user-location-marker-outer" style="background: transparent !important; background-color: transparent !important; border: none !important; box-shadow: none !important; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; outline: none !important;">
                              <div class="user-location-marker" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: transparent !important; border: none !important; outline: none !important;">
                                <div style="background-color: ${activeTab === 'otel' ? '#3b82f6' : activeTab === 'konum' ? '#10b981' : '#4f46e5'}; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; border: 4px solid white; box-shadow: 0 8px 24px ${activeTab === 'otel' ? 'rgba(59,130,246,0.6)' : activeTab === 'konum' ? 'rgba(16,185,129,0.6)' : 'rgba(79,70,229,0.6)'}; z-index: 2; transition: all 0.3s ease;">
                                  <i class="fa-solid ${activeTab === 'otel' ? 'fa-hotel' : activeTab === 'konum' ? 'fa-location-crosshairs animate-pulse' : 'fa-map-pin'}"></i>
                                </div>
                                <div style="position: absolute; bottom: -28px; background: ${activeTab === 'otel' ? '#3b82f6' : activeTab === 'konum' ? '#10b981' : '#4f46e5'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 9px; font-weight: 900; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border: 2px solid white; z-index: 3; text-transform: uppercase; letter-spacing: 0.1em;">
                                  ${activeTab === 'otel' ? (lang === 'tr' ? 'KONAKLAMA' : 'YOUR STAY') : activeTab === 'konum' ? (lang === 'tr' ? 'MEVCUT KONUM' : 'CURRENT POSITION') : (lang === 'tr' ? 'BAŞLANGIÇ' : 'START POINT')}
                                </div>
                                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; border-radius: 50%; background: ${activeTab === 'otel' ? '#3b82f6' : activeTab === 'konum' ? '#10b981' : '#4f46e5'}; opacity: 0.3; z-index: 1;"></div>
                              </div>
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

                    <MapFlyer target={mapCenterState} />
                    <MapUpdater center={selectedVenue ? [selectedVenue.koordinat.enlem, selectedVenue.koordinat.boylam] : null} />
                    <RouteFitter routeData={visibleDay !== null ? routeData.filter(d => d.day === visibleDay) : routeData} />
                    <MapResizer 
                      isSidebarOpen={isSidebarOpen}
                      isRightSidebarOpen={isRightSidebarOpen}
                      isViewingRoute={isViewingRoute}
                      isExplorerMode={isExplorerMode}
                    />
                  </MapContainer>
                )}

                {/* Venue Detail Overlay */}
                <AnimatePresence>
                  {selectedVenue && (
                    <motion.div 
                      key={selectedVenue.isim}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      className="fixed bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-[1550]"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row h-auto md:h-72">
                        <div className="w-full md:w-1/2 h-44 md:h-full relative group">
                          <VenueImage 
                            src={selectedVenue.gorsel || ""} 
                            alt={lang === 'tr' ? selectedVenue.isim : (selectedVenue.isim_en || selectedVenue.isim)} 
                            className="w-full h-full transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                             <div className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">
                               {lang === 'tr' ? selectedVenue.tur : (selectedVenue.tur_en || selectedVenue.tur)}
                             </div>
                             <div className="text-white text-xl md:text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-lg">
                               {lang === 'tr' ? selectedVenue.isim : (selectedVenue.isim_en || selectedVenue.isim)}
                             </div>
                          </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-white dark:bg-slate-900">
                          <button onClick={() => setSelectedVenue(null)} className="absolute right-6 top-6 p-2 text-slate-300 dark:text-slate-600 hover:text-blue-600 transition-colors">
                            <X size={20} />
                          </button>
                          
                          <div className="pr-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic line-clamp-3">
                              "{lang === 'tr' ? selectedVenue.kisa_tarihce : (selectedVenue.kisa_tarihce_en || selectedVenue.kisa_tarihce)}"
                            </p>
                          </div>
                          
                          <div className="flex flex-row items-center gap-2 md:gap-3 mt-4 md:mt-6 w-full">
                              <button 
                                onClick={() => {
                                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.koordinat.enlem},${selectedVenue.koordinat.boylam}`;
                                  window.open(url, '_blank');
                                }}
                                className="flex-1 min-w-0 bg-blue-600 text-white h-12 md:h-14 rounded-2xl font-black text-[9px] min-[375px]:text-[10px] md:text-xs uppercase tracking-wide min-[375px]:tracking-wider hover:bg-blue-700 transition-all flex items-center justify-center gap-1 md:gap-2 shadow-lg shadow-blue-500/30 px-2 min-[375px]:px-3 md:px-4 active:scale-95"
                              >
                                 <Compass size={14} className="shrink-0" /> 
                                 <span className="whitespace-nowrap">{t.directions}</span>
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveAudioVenue(selectedVenue);
                                  setIsAudioPlaying(true);
                                  setAudioProgress(0);
                                }}
                                className="flex-1 min-w-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-12 md:h-14 rounded-2xl font-black text-[9px] min-[375px]:text-[10px] md:text-xs uppercase tracking-wide min-[375px]:tracking-wider hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-1 md:gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 px-2 min-[375px]:px-3 md:px-4"
                              >
                                 <Headphones size={14} className="text-white shrink-0 animate-pulse" />
                                 <span className="whitespace-nowrap">{t.audioGuide || (lang === 'tr' ? 'Sesli Rehber' : 'Audio Guide')}</span>
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
                    onClick={() => {
                      setIsSidebarOpen(true);
                      setIsRightSidebarOpen(false);
                    }}
                    className={cn(
                      "absolute top-6 lg:top-10 left-6 lg:left-10 z-[1100] bg-white dark:bg-slate-900 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-50 dark:border-slate-800 flex items-center gap-3 lg:gap-4 hover:scale-105 transition-all text-blue-600 group active:scale-95",
                      isViewingRoute && isRightSidebarOpen ? "hidden" : "hidden lg:flex"
                    )}
                  >
                    <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
                    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em]">{t.planner}</span>
                  </button>
                )}

                {/* Right Sidebar for Route Itinerary */}
                <AnimatePresence>
                  {isViewingRoute && (
                    <motion.aside 
                      initial={{ x: "100%" }}
                      animate={{ x: isRightSidebarOpen ? "0%" : "100%" }}
                      transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                      className="fixed lg:absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-100 dark:border-slate-800 z-[1200] shadow-2xl flex"
                    >
                      {/* Toggle Handle */}
                      <button 
                        onClick={() => {
                          const nextState = !isRightSidebarOpen;
                          setIsRightSidebarOpen(nextState);
                          if (nextState) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "absolute right-full top-24 h-14 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-l-3xl flex items-center justify-center text-blue-600 shadow-2xl transition-all duration-300 hover:text-blue-700 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/80 group",
                          isRightSidebarOpen 
                            ? "w-12 hidden sm:flex" 
                            : "w-auto px-6 gap-3 border-r-0 hidden lg:flex"
                        )}
                        title={isRightSidebarOpen ? (lang === 'tr' ? 'Kapat' : 'Close') : (lang === 'tr' ? 'Planı Gör' : 'View Plan')}
                      >
                        {isRightSidebarOpen ? (
                          <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <i className="fa-solid fa-calendar-day text-blue-600 text-xs animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-slate-200 whitespace-nowrap">
                              {lang === 'tr' ? 'PLANI GÖR' : 'VIEW PLAN'}
                            </span>
                            <div className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </div>
                          </div>
                        )}
                      </button>

                      <div className="flex-1 flex flex-col w-full max-w-full overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[11px] md:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                              {lang === 'tr' ? 'GÜNLÜK ROTA PLANI' : 'DAILY ROUTE PLAN'}
                            </h2>
                            <button 
                              onClick={() => setIsRightSidebarOpen(false)} 
                              className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 flex items-center justify-center text-slate-400 hover:text-red-500 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          {/* Smart Assistant Alert for Weather Optimization */}
                          {weatherOptimized && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mb-5 p-3.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/60 rounded-2xl flex items-start gap-2.5 shadow-md overflow-hidden"
                            >
                              <span className="text-base shrink-0 select-none">🌧️</span>
                              <div className="text-blue-950 dark:text-blue-100 text-[11px] font-extrabold leading-normal">
                                {lang === 'tr' 
                                  ? "İstanbul'da yağış beklendiği için rotanız kapalı mekan etkinlikleriyle otomatik olarak optimize edilmiştir." 
                                  : "Due to expected rain in Istanbul, your route has been automatically optimized with indoor activities."
                                }
                              </div>
                            </motion.div>
                          )}

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
                            {routeData.map((day) => {
                              const weatherObj = dailyWeather.find(w => w.day === day.day);
                              const emoji = weatherObj ? getWeatherEmoji(weatherObj.condition) : '☀️';
                              return (
                                <button 
                                  key={day.day}
                                  onClick={() => setVisibleDay(day.day)}
                                  className={cn(
                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all gap-1.5 flex items-center justify-center",
                                    visibleDay === day.day ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600"
                                  )}
                                  title={weatherObj ? `${getWeatherDesc(weatherObj.condition)} • ${weatherObj.temp}°C` : ''}
                                >
                                  <span>{t.day} {day.day}</span>
                                  <span className="text-xs">{emoji}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 md:space-y-10">
                          {routeData.filter(d => visibleDay === null || d.day === visibleDay).map((day, idx) => (
                            <div key={day.day} className="space-y-4 relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                              <div className="absolute -left-[5px] top-0 w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                  {t.day} {day.day}
                                </span>
                                {(() => {
                                  const weatherObj = dailyWeather.find(w => w.day === day.day);
                                  if (weatherObj) {
                                    return (
                                      <span className="text-[9px] font-extrabold text-slate-500 bg-slate-50 border border-slate-100 dark:bg-slate-800/85 dark:border-slate-700/80 dark:text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 shadow-sm">
                                        <span>{getWeatherEmoji(weatherObj.condition)}</span>
                                        <span>{getWeatherDesc(weatherObj.condition)}</span>
                                        <span>•</span>
                                        <span className="font-mono">{weatherObj.temp}°C</span>
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <div className="space-y-3">
                                {day.venues.map((v, vIdx) => (
                                  <motion.div 
                                    key={vIdx} 
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="group p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl hover:border-blue-200 shadow-sm hover:shadow-2xl hover:shadow-blue-50 dark:hover:shadow-blue-900/20 transition-all cursor-pointer"
                                    onClick={() => setSelectedVenue(v)}
                                  >
                                    <div className="flex items-center justify-between gap-4 w-full">
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-fit h-8 px-3 bg-slate-900 dark:bg-slate-600 text-white text-[10px] font-black rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors uppercase whitespace-nowrap">
                                          {day.day}. {t.day} - {vIdx + 1}
                                        </div>
                                        <div className="overflow-hidden">
                                          <div className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {lang === 'tr' ? v.isim : (v.isim_en || v.isim)}
                                          </div>
                                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            {lang === 'tr' ? v.tur : (v.tur_en || v.tur)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation(); // Avoid opening full card modal
                                          setActiveAudioVenue(v);
                                          setIsAudioPlaying(true);
                                          setAudioProgress(0);
                                        }}
                                        className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-600 dark:bg-slate-700 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shadow-sm"
                                        title={t.audioGuide || "Sesli Rehber"}
                                      >
                                        <i className="fa-solid fa-volume-high text-[10px]" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Download & Share Actions */}
                        <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex flex-col gap-2">
                          <button 
                            onClick={handleShareRoute}
                            className="w-full h-11 bg-blue-600 text-white rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                          >
                            <Share size={15} />
                            {lang === 'tr' ? 'ROTAYI PAYLAŞ' : 'SHARE ROUTE'}
                          </button>
                          
                          <button 
                            onClick={handleDownloadPDF}
                            disabled={isDownloadingPDF}
                            className="w-full h-11 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-100 dark:border-slate-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDownloadingPDF ? (
                              <>
                                <div className="w-4 h-4 border-2 border-slate-400 border-t-blue-600 rounded-full animate-spin" />
                                {lang === 'tr' ? 'PDF HAZIRLANIYOR...' : 'PREPARING PDF...'}
                              </>
                            ) : (
                              <>
                                <Download size={15} className="text-red-500" />
                                {lang === 'tr' ? 'LİSTEYİ İNDİR (PDF)' : 'DOWNLOAD ITINERARY (PDF)'}
                              </>
                            )}
                          </button>

                          <button 
                            onClick={clearRoute}
                            className="w-full py-2 bg-transparent hover:bg-red-50/50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-xl text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer border border-transparent hover:border-red-150 dark:hover:border-red-950/40 mt-1"
                          >
                            <i className="fas fa-trash-alt text-[11px]"></i>
                            {lang === 'tr' ? 'ROTAYI TEMİZLE' : 'CLEAR ROUTE'}
                          </button>
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </div>
            </div>


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
            className="fixed inset-0 z-[4000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] max-w-xl w-full p-6 sm:p-8 relative overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="absolute right-4 sm:right-6 top-4 sm:top-6 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-700 hover:scale-105 active:scale-95"
              >
                <X size={18} />
              </button>
              
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/20">
                <Sparkles size={24} />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">{t.howItWorksTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-semibold">
                {t.howItWorksDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Navigation size={18} /></div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">{t.optimization}</h4>
                    <p className="text-[10px] leading-snug text-slate-400 font-bold">{t.optimizationDesc}</p>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-3">
                  <div className="w-9 h-9 shrink-0 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><CheckCircle2 size={18} /></div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-[10px] sm:text-[11px] uppercase tracking-wider mb-0.5">{t.typeFiltering}</h4>
                    <p className="text-[10px] leading-snug text-slate-400 font-bold">{t.typeFilteringDesc}</p>
                  </div>
                </div>
              </div>

              <div className="mb-5 sm:mb-6">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-[0.20em]">{t.aboutTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">{t.aboutDesc}</p>
              </div>
              
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3.5 sm:py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                {t.ready}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[5000] lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col p-6 border-l border-slate-100 dark:border-slate-800/80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <div className="w-4 h-4 border-2 border-white rotate-45" />
                  </div>
                  <span className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    İstanbul <span className="text-blue-600">Rehberi</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 active:scale-95 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                <button 
                  onClick={() => {
                    setActiveScreen('landing');
                    setIsMobileNavOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-left transition-all group border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Compass size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {lang === 'tr' ? 'ANA SAYFA' : 'HOME'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'tr' ? 'Giriş ekranına dön' : 'Go back to landing page'}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    clearRoute();
                    setIsExplorerMode(true);
                    setIsSidebarOpen(false);
                    setIsRightSidebarOpen(false);
                    setIsMobileNavOpen(false);
                    setTimeout(() => {
                      const mapEl = document.getElementById('map-container');
                      if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-left transition-all group border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-map-location-dot text-sm" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {t.goToMap || "Haritaya Git"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'tr' ? 'Harita kâşifini doğrudan aç' : 'Explore the live map directly'}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setIsSidebarOpen(true);
                    setIsExplorerMode(false);
                    setIsMobileNavOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-left transition-all group border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-route text-sm" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {t.planner || "Seyahat Planlayıcısı"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'tr' ? 'Akıllı rota ve gezi planla' : 'Plan your custom itinerary'}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setShowHowItWorks(true);
                    setIsMobileNavOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-left transition-all group border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-circle-question text-sm" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {t.howItWorks || "Nasıl Çalışır?"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'tr' ? 'Sistemin çalışma prensipleri' : 'How the smart system functions'}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setShowHowItWorks(true); // also covers details
                    setIsMobileNavOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-left transition-all group border border-transparent hover:border-blue-100 dark:hover:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-circle-info text-sm" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {t.about || "Hakkımızda"}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'tr' ? 'Proje hakkında teknik detaylar' : 'Read project details'}
                    </div>
                  </div>
                </button>
              </div>

              {/* Language Selector + Theme inside Drawer Foot */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {lang === 'tr' ? 'DİL SEÇİMİ' : 'LANGUAGE'}
                  </span>
                  <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                    <button onClick={() => setLang('tr')} className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", lang === 'tr' ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-400")}>TR</button>
                    <button onClick={() => setLang('en')} className={cn("px-3 py-1 text-[10px] font-black rounded-lg transition-all", lang === 'en' ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600" : "text-slate-400")}>EN</button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 dark:border-slate-800"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={16} />
                      <span>{lang === 'tr' ? 'GECE MODU' : 'DARK MODE'}</span>
                    </>
                  ) : (
                    <>
                      <Sun size={16} />
                      <span>{lang === 'tr' ? 'GÜNDÜZ MODU' : 'LIGHT MODE'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Waveform Audio Player */}
      <AnimatePresence>
        {activeAudioVenue && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="fixed bottom-[110px] lg:bottom-10 right-4 lg:right-10 z-[3200] w-[92%] sm:w-[380px] bg-slate-950/95 text-white p-5 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-slate-800/80 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                  <Headphones size={13} className="text-emerald-400 shrink-0" />
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                    {lang === 'tr' ? 'SESLİ REHBER AKTİF' : 'AUDIO TOUR ACTIVE'}
                  </h4>
                  <div className="text-xs font-bold leading-tight line-clamp-1 max-w-[180px]">
                    {lang === 'tr' ? activeAudioVenue.isim : (activeAudioVenue.isim_en || activeAudioVenue.isim)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAudioPlaying(false);
                  setActiveAudioVenue(null);
                }}
                className="p-1.5 px-3 rounded-xl bg-slate-800 text-slate-400 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-wider active:scale-95"
              >
                {lang === 'tr' ? 'AKTARIMI KAPAT' : 'CLOSE AUDIO'}
              </button>
            </div>

            {/* Subtitle stream narration container */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/30 mb-4 h-24 overflow-y-auto custom-scrollbar flex items-center justify-center">
              <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic text-center w-full select-none">
                "{getVenueNarration(activeAudioVenue)}"
              </p>
            </div>

            {/* Simulated narration progress meter */}
            {(() => {
              const estimatedTotalSeconds = Math.max(5, Math.ceil(getVenueNarration(activeAudioVenue).split(/\s+/).filter(Boolean).length / 2.2));
              const elapsedSeconds = Math.round((audioProgress / 100) * estimatedTotalSeconds);
              const formatAudioTime = (secs: number) => {
                const m = Math.floor(secs / 60);
                const s = secs % 60;
                return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
              };

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>{formatAudioTime(elapsedSeconds)}</span>
                    <span>{formatAudioTime(estimatedTotalSeconds)}</span>
                  </div>
                  
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = Math.round((clickX / rect.width) * 100);
                    handleSeek(percentage);
                  }}>
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>

                  {/* Media Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <motion.div 
                          key={bar}
                          animate={isAudioPlaying ? { height: [4, 16, 4] } : { height: 4 }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: bar * 0.1 }}
                          className="w-1 bg-emerald-400 rounded-full"
                          style={{ height: 4 }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setSpeechOffsetCharIndex(0);
                          setAudioProgress(0);
                          setIsAudioPlaying(true);
                        }}
                        className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs active:scale-95 transition-transform"
                        title={lang === 'tr' ? 'Baştan Al' : 'Restart'}
                      >
                        <i className="fa-solid fa-backward-step"></i>
                      </button>
                      <button 
                        onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                        className="w-11 h-11 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        {isAudioPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play ml-0.5"></i>}
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      {isAudioPlaying ? (lang === 'tr' ? 'OYNATILIYOR' : 'PLAYING') : (lang === 'tr' ? 'DURDURULDU' : 'PAUSED')}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Mobile Bottom Navigation Floating Action Bar */}
      {activeScreen === 'app' && !isSidebarOpen && !isMobileNavOpen && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1150] w-[92%] max-w-sm">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-3xl px-6 py-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 flex items-center justify-around gap-2"
          >
            {/* Route Planner Button */}
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setIsRightSidebarOpen(false);
              }}
              className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-blue-400 transition-all active:scale-95 py-1"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1">
                <Calendar size={16} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                {lang === 'tr' ? 'PLANLAYICI' : 'PLANNER'}
              </span>
            </button>

            {/* Dynamic Route View Button (Only if route loaded) */}
            {routeData.length > 0 && (
              <>
                <div className="w-px h-8 bg-slate-800" />
                
                <button
                  onClick={() => {
                    const nextState = !isRightSidebarOpen;
                    setIsRightSidebarOpen(nextState);
                    if (nextState) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 transition-all active:scale-95 py-1 relative"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
                    <i className="fa-solid fa-route text-xs" />
                    <div className="absolute top-1.5 right-6 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981]">
                    {lang === 'tr' ? 'PLANI GÖR' : 'VIEW PLAN'}
                  </span>
                </button>
              </>
            )}

            {/* Explore / Clear Route button */}
            <div className="w-px h-8 bg-slate-800" />
            
            <button
              onClick={() => {
                clearRoute();
                setIsExplorerMode(true);
                setIsSidebarOpen(false);
                setIsRightSidebarOpen(false);
                setTimeout(() => {
                  const mapEl = document.getElementById('map-container');
                  if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 transition-all active:scale-95 py-1"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1">
                <i className="fa-solid fa-map-location-dot text-xs" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#f59e0b]">
                {lang === 'tr' ? 'HARİTA' : 'EXPLORE'}
              </span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Dynamic Toast custom feedback banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[8000] bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800/80 flex items-center gap-3 text-xs font-bold uppercase tracking-wider"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <i className="fa-solid fa-check text-[9px]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
