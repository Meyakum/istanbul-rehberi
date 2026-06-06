import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800";

export const ISTANBUL_DATA = {
  "sehir": "İstanbul",
  "toplam_otel_sayisi": 40,
  "populer_oteller": [
    { "isim": "Four Seasons Sultanahmet", "isim_en": "Four Seasons Sultanahmet", "kisa_tarihce": "Sultanahmet'te eski bir cezaevinden dönüştürülmüş lüks otel.", "kisa_tarihce_en": "Luxury hotel converted from an old prison in Sultanahmet.", "koordinat": { "enlem": 41.0081, "boylam": 28.9791 }, "gorsel": "https://images.unsplash.com/photo-1566371534003-685cc1c59cfc?auto=format&fit=crop&q=80&w=800" },
    { "isim": "The Ritz-Carlton Istanbul", "isim_en": "The Ritz-Carlton Istanbul", "kisa_tarihce": "Boğaz manzaralı, modern ve lüks konaklama merkezi.", "kisa_tarihce_en": "Modern and luxury accommodation with a Bosphorus view.", "koordinat": { "enlem": 41.0396, "boylam": 28.9928 } },
    { "isim": "Pera Palace Hotel", "isim_en": "Pera Palace Hotel", "kisa_tarihce": "Atatürk, Agatha Christie gibi isimleri ağırlamış tarihi otel.", "kisa_tarihce_en": "Historical hotel that hosted names like Ataturk and Agatha Christie.", "koordinat": { "enlem": 41.0312, "boylam": 28.9739 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Ciragan Palace Kempinski", "isim_en": "Ciragan Palace Kempinski", "kisa_tarihce": "Eski bir Osmanlı sarayında yer alan eşsiz Boğaz oteli.", "kisa_tarihce_en": "Unique Bosphorus hotel located in a former Ottoman palace.", "koordinat": { "enlem": 41.0441, "boylam": 29.0162 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Swissotel The Bosphorus", "isim_en": "Swissotel The Bosphorus", "kisa_tarihce": "Maçka Parkı'nın yanında, panoramik şehir manzaralı lüks otel.", "kisa_tarihce_en": "Luxury hotel next to Macka Park with a panoramic city view.", "koordinat": { "enlem": 41.0401, "boylam": 28.9987 } },
    { "isim": "The Marmara Taksim", "isim_en": "The Marmara Taksim", "kisa_tarihce": "Taksim Meydanı'nın simgesi olan merkezi ve lüks otel.", "kisa_tarihce_en": "Central and luxury hotel that is the symbol of Taksim Square.", "koordinat": { "enlem": 41.0361, "boylam": 28.9855 } },
    { "isim": "Hilton Istanbul Bosphorus", "isim_en": "Hilton Istanbul Bosphorus", "kisa_tarihce": "Türkiye'nin ilk modern oteli olarak bilinen ikonik yapı.", "kisa_tarihce_en": "Iconic building known as Turkey's first modern hotel.", "koordinat": { "enlem": 41.0449, "boylam": 28.9897 } },
    { "isim": "Shangri-La Bosphorus", "isim_en": "Shangri-La Bosphorus", "kisa_tarihce": "Beşiktaş sahilinde lüks ve konforun buluşma noktası.", "kisa_tarihce_en": "The meeting point of luxury and comfort on the Besiktas coast.", "koordinat": { "enlem": 41.0416, "boylam": 29.0068 } },
    { "isim": "InterContinental Istanbul", "isim_en": "InterContinental Istanbul", "kisa_tarihce": "Taksim bölgesinde şehre hakim konumuyla bilinen prestijli otel.", "kisa_tarihce_en": "Prestigious hotel known for its dominant location over the city in the Taksim area.", "koordinat": { "enlem": 41.0388, "boylam": 28.9876 } },
    { "isim": "Raffles Istanbul", "isim_en": "Raffles Istanbul", "kisa_tarihce": "Zorlu Center kompleksinde yer alan ultra lüks konaklama.", "kisa_tarihce_en": "Ultra-luxury accommodation located in the Zorlu Center complex.", "koordinat": { "enlem": 41.0664, "boylam": 29.0163 } },
    { "isim": "CVK Park Bosphorus", "isim_en": "CVK Park Bosphorus", "kisa_tarihce": "Eski Park Otel arazisinde yükselen modern ve görkemli tesis.", "kisa_tarihce_en": "A modern and majestic facility rising on the site of the former Park Hotel.", "koordinat": { "enlem": 41.0368, "boylam": 28.9881 } },
    { "isim": "Conrad Istanbul Bosphorus", "isim_en": "Conrad Istanbul Bosphorus", "kisa_tarihce": "S eğrisindeki mimarisiyle ünlü Boğaz manzaralı lüks otel.", "kisa_tarihce_en": "Luxury hotel with a Bosphorus view, famous for its S-curved architecture.", "koordinat": { "enlem": 41.0485, "boylam": 29.0090 } },
    { "isim": "Grand Hyatt Istanbul", "isim_en": "Grand Hyatt Istanbul", "kisa_tarihce": "Şehir merkezinde modern tasarımıyla öne çıkan şık otel.", "kisa_tarihce_en": "Stylish hotel standing out with its modern design in the city center.", "koordinat": { "enlem": 41.0405, "boylam": 28.9892 } },
    { "isim": "Sheraton Istanbul City Center", "isim_en": "Sheraton Istanbul City Center", "kisa_tarihce": "Beyoğlu'nun kalbinde modern ve konforlu konaklama.", "kisa_tarihce_en": "Modern and comfortable accommodation in the heart of Beyoğlu.", "koordinat": { "enlem": 41.0385, "boylam": 28.9698 } },
    { "isim": "Divan Istanbul", "isim_en": "Divan Istanbul", "kisa_tarihce": "Türk misafirperverliğini modern lüksle birleştiren köklü otel.", "kisa_tarihce_en": "Well-established hotel combining Turkish hospitality with modern luxury.", "koordinat": { "enlem": 41.0418, "boylam": 28.9877 } },
    { "isim": "Elite World Istanbul", "isim_en": "Elite World Istanbul", "kisa_tarihce": "Taksim bölgesinde klasik ve modern çizgilerin buluştuğu otel.", "kisa_tarihce_en": "Hotel where classic and modern lines meet in the Taksim area.", "koordinat": { "enlem": 41.0382, "boylam": 28.9852 } },
    { "isim": "Titanic Downtown Beyoglu", "isim_en": "Titanic Downtown Beyoglu", "kisa_tarihce": "Beyoğlu bölgesinde modern mimarisiyle konforlu bir seçenek.", "kisa_tarihce_en": "A comfortable option with its modern architecture in the Beyoğlu region.", "koordinat": { "enlem": 41.0365, "boylam": 28.9654 } },
    { "isim": "Soho House Istanbul", "isim_en": "Soho House Istanbul", "kisa_tarihce": "Eski Amerikan Konsolosluğu binasında yer alan özel üyelik kulübü ve otel.", "kisa_tarihce_en": "Private members club and hotel located in the former American Consulate building.", "koordinat": { "enlem": 41.0298, "boylam": 28.9721 } },
    { "isim": "Wyndham Grand Istanbul Levant", "isim_en": "Wyndham Grand Istanbul Levant", "kisa_tarihce": "Levent finans merkezinde yer alan modern iş ve yaşam oteli.", "kisa_tarihce_en": "Modern business and lifestyle hotel located in the Levent financial center.", "koordinat": { "enlem": 41.0765, "boylam": 29.0123 } },
    { "isim": "Point Hotel Barbaros", "isim_en": "Point Hotel Barbaros", "kisa_tarihce": "Sanat ve teknolojiyi birleştiren modern konseptli otel.", "kisa_tarihce_en": "Modern concept hotel combining art and technology.", "koordinat": { "enlem": 41.0621, "boylam": 29.0065 } },
    { "isim": "Renaissance Istanbul Polat Bosphorus", "isim_en": "Renaissance Istanbul Polat Bosphorus", "kisa_tarihce": "Beşiktaş sırtlarında harika şehir ve Boğaz manzaralı otel.", "kisa_tarihce_en": "Hotel with great city and Bosphorus views on the slopes of Besiktas.", "koordinat": { "enlem": 41.0585, "boylam": 29.0042 } },
    { "isim": "Dedeman Istanbul", "isim_en": "Dedeman Istanbul", "kisa_tarihce": "Geleneksel Türk misafirperverliğini odağına alan köklü tesis.", "kisa_tarihce_en": "Well-established facility focusing on traditional Turkish hospitality.", "koordinat": { "enlem": 41.0652, "boylam": 29.0012 } },
    { "isim": "The Stay Bosphorus", "isim_en": "The Stay Bosphorus", "kisa_tarihce": "Ortaköy'de denize sıfır, butik ve şık konaklama deneyimi.", "kisa_tarihce_en": "Waterfront, boutique and stylish accommodation experience in Ortakoy.", "koordinat": { "enlem": 41.0478, "boylam": 29.0272 } },
    { "isim": "A'jia Hotel", "isim_en": "A'jia Hotel", "kisa_tarihce": "Kanlıca sahilinde, tarihi bir yalıda butik konaklama keyfi.", "kisa_tarihce_en": "Boutique accommodation pleasure in a historic mansion on the Kanlica coast.", "koordinat": { "enlem": 41.1042, "boylam": 29.0654 } },
    { "isim": "Sumahan on the Water", "isim_en": "Sumahan on the Water", "kisa_tarihce": "Çengelköy'de eski bir damıtım evinden dönüştürülmüş butik otel.", "kisa_tarihce_en": "Boutique hotel converted from an old distillery in Cengelköy.", "koordinat": { "enlem": 41.0545, "boylam": 29.0521 } },
    { "isim": "Bebek Hotel by The Stay", "isim_en": "Bebek Hotel by The Stay", "kisa_tarihce": "Bebek sahilinin en ikonik ve köklü butik otellerinden biri.", "kisa_tarihce_en": "One of the most iconic and established boutique hotels on the Bebek coast.", "koordinat": { "enlem": 41.0772, "boylam": 29.0435 } },
    { "isim": "Mandarin Oriental Bosphorus", "isim_en": "Mandarin Oriental Bosphorus", "kisa_tarihce": "Kuruçeşme sahilinde lüksün en üst seviyesini sunan modern otel.", "kisa_tarihce_en": "Modern hotel offering the highest level of luxury on the Kurucesme coast.", "koordinat": { "enlem": 41.0612, "boylam": 29.0345 } },
    { "isim": "Six Senses Kocatas Mansions", "isim_en": "Six Senses Kocatas Mansions", "kisa_tarihce": "Sarıyer sahilinde tarihi iki köşkte yer alan lüks ve wellness odaklı otel.", "kisa_tarihce_en": "Luxury and wellness-oriented hotel located in two historic mansions on the Sariyer coast.", "koordinat": { "enlem": 41.1652, "boylam": 29.0512 } },
    { "isim": "Fuad Pasa Yalisi", "isim_en": "Fuad Pasa Yalisi", "kisa_tarihce": "19. yüzyıldan kalma tarihi bir paşa yalısında eşsiz konaklama.", "kisa_tarihce_en": "Unique accommodation in a historic 19th-century pasha's mansion.", "koordinat": { "enlem": 41.1212, "boylam": 29.0712 } },
    { "isim": "Grand Tarabya", "isim_en": "Grand Tarabya", "kisa_tarihce": "Tarabya koyuna hakim, İstanbul'un en köklü otellerinden biri.", "kisa_tarihce_en": "One of Istanbul's most established hotels, dominating the Tarabya bay.", "koordinat": { "enlem": 41.1412, "boylam": 29.0552 } },
    { "isim": "Hilton Istanbul Bakirkoy", "isim_en": "Hilton Istanbul Bakirkoy", "kisa_tarihce": "Marmara Denizi kıyısında modern ve konforlu sahil oteli.", "kisa_tarihce_en": "Modern and comfortable seaside hotel on the shores of the Marmara Sea.", "koordinat": { "enlem": 40.9752, "boylam": 28.8512 } },
    { "isim": "Sheraton Istanbul Atakoy", "isim_en": "Sheraton Istanbul Atakoy", "kisa_tarihce": "Ataköy Marina'da yer alan huzurlu sahil oteli.", "kisa_tarihce_en": "Peaceful seaside hotel located in Ataköy Marina.", "koordinat": { "enlem": 40.9712, "boylam": 28.8752 } },
    { "isim": "Hyatt Regency Istanbul Atakoy", "isim_en": "Hyatt Regency Istanbul Atakoy", "kisa_tarihce": "Modern tasarımıyla Ataköy sahilinde lüks segment konaklama.", "kisa_tarihce_en": "Luxury segment accommodation on the Ataköy coast with modern design.", "koordinat": { "enlem": 40.9721, "boylam": 28.8652 } },
    { "isim": "DoubleTree by Hilton Moda", "isim_en": "DoubleTree by Hilton Moda", "kisa_tarihce": "Kadıköy Moda'da, panoramik Adalar ve Boğaz manzaralı modern otel.", "kisa_tarihce_en": "Modern hotel in Kadıköy Moda with panoramic Prince Islands and Bosphorus views.", "koordinat": { "enlem": 40.9852, "boylam": 29.0252 } },
    { "isim": "Wyndham Grand Kalamis", "isim_en": "Wyndham Grand Kalamis", "kisa_tarihce": "Kalamış Marina'nın kalbinde yer alan prestijli sahil oteli.", "kisa_tarihce_en": "Prestigious seaside hotel located in the heart of Kalamış Marina.", "koordinat": { "enlem": 40.9782, "boylam": 29.0382 } },
    { "isim": "Park Hyatt Istanbul Macka Palas", "isim_en": "Park Hyatt Istanbul Macka Palas", "kisa_tarihce": "Nişantaşı'nın en şık binalarından Maçka Palas'ta lüks konaklama.", "kisa_tarihce_en": "Luxury accommodation in Maçka Palas, one of Nişantaşı's most stylish buildings.", "koordinat": { "enlem": 41.0482, "boylam": 28.9952 } },
    { "isim": "W Istanbul", "isim_en": "W Istanbul", "kisa_tarihce": "Akaretler Sıraevler'de yer alan şık ve dinamik butik otel.", "kisa_tarihce_en": "Stylish and dynamic boutique hotel located in Akaretler Row Houses.", "koordinat": { "enlem": 41.0423, "boylam": 29.0005 } },
    { "isim": "Ajwa Sultanahmet", "isim_en": "Ajwa Sultanahmet", "kisa_tarihce": "Sultanahmet'te Osmanlı saray mimarisini modern lüksle buluşturan otel.", "kisa_tarihce_en": "Hotel in Sultanahmet bringing Ottoman palace architecture together with modern luxury.", "koordinat": { "enlem": 41.0058, "boylam": 28.9712 } },
    { "isim": "Legacy Ottoman Hotel", "isim_en": "Legacy Ottoman Hotel", "kisa_tarihce": "Eminönü sahilinde, tarihi 4. Vakıf Han binasında yer alan görkemli otel.", "kisa_tarihce_en": "Majestic hotel located in the historic 4th Vakıf Han building on the Eminönü coast.", "koordinat": { "enlem": 41.0162, "boylam": 28.9742 } }


  ]
};

export const TRANSLATIONS = {
  tr: {
    title: "İstanbul Akıllı Rehber", discover: "İstanbul'u Keşfet", subtitle: "Sizin için en mantıklı gezi rotasını hazırlıyoruz.",
    start: "Hemen Başla", planner: "Seyahat Planlayıcı", hotelStart: "Otelden Başla", districtStart: "Semtten Başla", locationStart: "Konumdan Başla",
    hotelLabel: "Konakladığınız Otel", districtLabel: "Başlangıç Semti", duration: "Süre", days: "GÜN",
    interests: "İlgi Alanları", dailyPace: "Günlük Tempo", dailyPaceTooltip: "Bu seçenekle, bir gün içerisinde toplam kaç farklı yeri ziyaret etmek istediğinizi belirleyebilirsiniz.", paceScale: ["Yavaş", "Normal", "Yoğun", "Zirve"],
    createRoute: "Rota Çiz", calculating: "Hesaplanıyor...", dailyRoute: "Günlük Rota Planınız", day: "GÜN",
    directions: "Yol Tarifi",
    audioGuide: "Sesli Rehber", howItWorks: "Nasıl Çalışır?", about: "Hakkımızda", goToMap: "Haritaya Git",
    settings: "Ayarları Aç", serverActive: "Sunucu Aktif", dataStandards: "Kültür ve Turizm Bakanlığı Veri Standartları",
    howItWorksTitle: "Akıllı Rota Teknolojisi", ready: "Keşfetmeye Hazırım", aboutTitle: "Hakkımızda",
    howItWorksDesc: "Otelini veya gezmek istediğin semti seç, gün sayısını belirle; yapay zekamız senin için en kısa ulaşım süreli ve en mantıklı gezi rotasını anında hazırlasın!",
    optimization: "Mesafe Optimizasyonu", optimizationDesc: "En yakın noktalar algoritma ile sıralanır.",
    typeFiltering: "Tür Bazlı Filtreleme", typeFilteringDesc: "Sadece ilgi duyduğunuz kategoriler dâhil edilir.",
    aboutDesc: "İstanbul Akıllı Rehber, dünyanın en güzel şehirlerinden biri olan İstanbul'u en verimli şekilde gezebilmeniz için geliştirilmiş yapay zeka destekli bir rotalama platformudur.",
    cats: {
      worship: "İbadet & İnanç",
      history: "Tarih & Müze",
      nature: "Doğa & Park",
      views: "Seyir & Manzara",
      shopping: "Alışveriş & Çarşı",
      water: "Sahil & Ada",
      transport: "Mimari & Ulaşım",
      fortress: "Kale & Hisar",
      life: "Meydan & Yaşam",
      fun: "Eğlence & Sanat"
    },
    districts: {
      "Adalar": "Adalar", "Arnavutköy": "Arnavutköy", "Ataşehir": "Ataşehir", "Avcılar": "Avcılar", "Bağcılar": "Bağcılar",
      "Bahçelievler": "Bahçelievler", "Bakırköy": "Bakırköy", "Başakşehir": "Başakşehir", "Bayrampaşa": "Bayrampaşa",
      "Beşiktaş": "Beşiktaş", "Beykoz": "Beykoz", "Beylikdüzü": "Beylikdüzü", "Beyoğlu": "Beyoğlu", "Büyükçekmece": "Büyükçekmece",
      "Çatalca": "Çatalca", "Çekmeköy": "Çekmeköy", "Esenler": "Esenler", "Esenyurt": "Esenyurt", "Eyüpsultan": "Eyüpsultan",
      "Fatih": "Fatih", "Gaziosmanpaşa": "Gaziosmanpaşa", "Gungören": "Güngören", "Kadıköy": "Kadıköy", "Kağıthane": "Kağıthane",
      "Kartal": "Kartal", "Küçükçekmece": "Küçükçekmece", "Maltepe": "Maltepe", "Pendik": "Pendik", "Sancaktepe": "Sancaktepe",
      "Sarıyer": "Sarıyer", "Silivri": "Silivri", "Sultanbeyli": "Sultanbeyli", "Sultangazi": "Sultangazi", "Şile": "Şile",
      "Şişli": "Şişli", "Tuzla": "Tuzla", "Ümraniye": "Ümraniye", "Üsküdar": "Üsküdar", "Zeytinburnu": "Zeytinburnu"
    }
  },
  en: {
    title: "Istanbul Smart Guide", discover: "Discover Istanbul", subtitle: "We prepare the most logical travel route for you.",
    start: "Start Now", planner: "Travel Planner", hotelStart: "Start from Hotel", districtStart: "Start from District", locationStart: "Start from Location",
    hotelLabel: "Your Hotel", districtLabel: "Starting District", duration: "Duration", days: "DAYS",
    interests: "Interests", dailyPace: "Daily Pace", dailyPaceTooltip: "With this option, you can determine how many different places you want to visit in total in one day.", paceScale: ["Relaxed", "Normal", "Active", "Peak"],
    createRoute: "Create Route", calculating: "Calculating...", dailyRoute: "Your Daily Route Plan", day: "DAY",
    directions: "Directions",
    audioGuide: "Audio Guide", howItWorks: "How it Works?", about: "About Us", goToMap: "Go to Map",
    settings: "Open Settings", serverActive: "Server Active", dataStandards: "Ministry of Culture and Tourism Data Standards",
    howItWorksTitle: "Smart Route Technology", ready: "I'm Ready to Explore", aboutTitle: "About Us",
    howItWorksDesc: "Choose your hotel or the district you want to visit, set the number of days; our AI will instantly prepare the most logical travel route with the shortest transportation time for you!",
    optimization: "Distance Optimization", optimizationDesc: "Nearest points are ordered by algorithm.",
    typeFiltering: "Type-Based Filtering", typeFilteringDesc: "Only categories you are interested in are included.",
    aboutDesc: "Istanbul Smart Guide is an AI-powered routing platform developed to help you visit Istanbul, one of the most beautiful cities in the world, in the most efficient way.",
    cats: {
      worship: "Worship & Faith",
      history: "History & Museum",
      nature: "Nature & Park",
      views: "Views & Scenery",
      shopping: "Shopping & Bazaar",
      water: "Coast & Island",
      transport: "Architecture & Transport",
      fortress: "Fortress & Defense",
      life: "Square & Life",
      fun: "Entertainment & Art"
    },
    districts: {
      "Adalar": "Princes' Islands", "Arnavutköy": "Arnavutkoy", "Ataşehir": "Atasehir", "Avcılar": "Avcilar", "Bağcılar": "Bagcilar",
      "Bahçelievler": "Bahcelievler", "Bakırköy": "Bakirkoy", "Başakşehir": "Basaksehir", "Bayrampaşa": "Bayrampasa",
      "Beşiktaş": "Besiktas", "Beykoz": "Beykoz", "Beylikdüzü": "Beylikduzu", "Beyoğlu": "Beyoglu", "Büyükçekmece": "Buyukcekmece",
      "Çatalca": "Catalca", "Çekmeköy": "Cekmekoy", "Esenler": "Esenler", "Esenyurt": "Esenyurt", "Eyüpsultan": "Eyupsultan",
      "Fatih": "Fatih", "Gaziosmanpaşa": "Gaziosmanpasa", "Gungören": "Gungoren", "Kadıköy": "Kadikoy", "Kağıthane": "Kagithane",
      "Kartal": "Kartal", "Küçükçekmece": "Kucukcekmece", "Maltepe": "Maltepe", "Pendik": "Pendik", "Sancaktepe": "Sancaktepe",
      "Sarıyer": "Sariyer", "Silivri": "Silivri", "Sultanbeyli": "Sultanbeyli", "Sultangazi": "Sultangazi", "Şile": "Sile",
      "Şişli": "Sisli", "Tuzla": "Tuzla", "Ümraniye": "Umraniye", "Üsküdar": "Uskudar", "Zeytinburnu": "Zeytinburnu"
    }
  }
};

export const ALL_DISTRICTS = ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Gungören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"];

export const DISTRICT_COORDS: { [key: string]: { lat: number, lng: number } } = {
  "Adalar": { lat: 40.8715, lng: 29.1311 }, "Arnavutköy": { lat: 41.1852, lng: 28.7417 }, "Ataşehir": { lat: 40.9924, lng: 29.1272 }, "Avcılar": { lat: 41.0003, lng: 28.7184 },
  "Bağcılar": { lat: 41.0341, lng: 28.8354 }, "Bahçelievler": { lat: 41.0051, lng: 28.8622 }, "Bakırköy": { lat: 40.9829, lng: 28.8617 }, "Başakşehir": { lat: 41.0805, lng: 28.8016 },
  "Bayrampaşa": { lat: 41.045, lng: 28.8996 }, "Beşiktaş": { lat: 41.0428, lng: 29.0075 }, "Beykoz": { lat: 41.1352, lng: 29.1023 }, "Beylikdüzü": { lat: 41.0012, lng: 28.6417 },
  "Beyoğlu": { lat: 41.0369, lng: 28.9851 }, "Büyükçekmece": { lat: 41.0189, lng: 28.5917 }, "Çatalca": { lat: 41.1444, lng: 28.4611 }, "Çekmeköy": { lat: 41.0352, lng: 29.1722 },
  "Esenler": { lat: 41.0392, lng: 28.8856 }, "Esenyurt": { lat: 41.0267, lng: 28.6784 }, "Eyüpsultan": { lat: 41.0474, lng: 28.9339 }, "Fatih": { lat: 41.015, lng: 28.94 },
  "Gaziosmanpaşa": { lat: 41.0652, lng: 28.9117 }, "Gungören": { lat: 41.0252, lng: 28.8717 }, "Kadıköy": { lat: 40.9904, lng: 29.0305 }, "Kağıthane": { lat: 41.0825, lng: 28.9754 },
  "Kartal": { lat: 40.8891, lng: 29.1852 }, "Küçükçekmece": { lat: 41.0019, lng: 28.7754 }, "Maltepe": { lat: 40.9452, lng: 29.1352 }, "Pendik": { lat: 40.8769, lng: 29.2319 },
  "Sancaktepe": { lat: 41.0052, lng: 29.2317 }, "Sarıyer": { lat: 41.1714, lng: 29.0569 }, "Silivri": { lat: 41.0741, lng: 28.2475 }, "Sultanbeyli": { lat: 40.9652, lng: 29.2617 },
  "Sultangazi": { lat: 41.1052, lng: 28.8717 }, "Şile": { lat: 41.1752, lng: 29.6117 }, "Şişli": { lat: 41.0602, lng: 28.9876 }, "Tuzla": { lat: 40.8152, lng: 29.3017 },
  "Ümraniye": { lat: 41.0252, lng: 29.0917 }, "Üsküdar": { lat: 41.0267, lng: 29.0156 }, "Zeytinburnu": { lat: 40.9884, lng: 28.8951 }
};

export interface Venue {
  isim: string;
  isim_en: string;
  tur: string;
  tur_en: string;
  kisa_tarihce: string;
  kisa_tarihce_en: string;
  koordinat: { enlem: number; boylam: number };
  gorsel?: string;
}
export type Hotel = typeof ISTANBUL_DATA.populer_oteller[0];
