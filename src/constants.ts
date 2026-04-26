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
  "toplam_mekan_sayisi": 101,
  "toplam_otel_sayisi": 40,
  "turistik_mekanlar": [
    { "isim": "Ayasofya-i Kebir Cami-i Şerifi", "tur": "Cami / Tarihi Yapı", "kisa_tarihce": "537'de katedral olarak açılan yapı, Fatih'in fethiyle camiye dönüşmüş dünya mirasıdır.", "koordinat": { "enlem": 41.0086, "boylam": 28.9799 }, "gorsel": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Sultanahmet Camii", "tur": "Cami", "kisa_tarihce": "17. yüzyılda Mavi Camii olarak da bilinen, 6 minareli mimari şaheser.", "koordinat": { "enlem": 41.0054, "boylam": 28.9768 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Topkapı Sarayı Müzesi", "tur": "Saray / Müze", "kisa_tarihce": "Osmanlı padişahlarının 400 yıl boyunca ikamet ettiği idari merkez.", "koordinat": { "enlem": 41.0115, "boylam": 28.9833 }, "gorsel": "https://images.unsplash.com/photo-1566371534003-685cc1c59cfc?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Dolmabahçe Sarayı", "tur": "Saray / Müze", "kisa_tarihce": "19. yüzyılda inşa edilen, Batı mimarili görkemli Osmanlı sahil sarayı.", "koordinat": { "enlem": 41.0392, "boylam": 29.0020 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Galata Kulesi", "tur": "Kule / Manzara", "kisa_tarihce": "1348'de Cenevizliler tarafından inşa edilen ikonik kule.", "koordinat": { "enlem": 41.0256, "boylam": 28.9741 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Kız Kulesi", "tur": "Tarihi Yapı / Manzara", "kisa_tarihce": "Boğaz'ın girişinde, antik çağlardan beri var olan efsanevi yapı.", "koordinat": { "enlem": 41.0211, "boylam": 29.0041 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Yerebatan Sarnıcı", "tur": "Sarnıç / Müze", "kisa_tarihce": "6. yüzyılda inşa edilen, Medusa başlarıyla ünlü dev yeraltı su deposu.", "koordinat": { "enlem": 41.0084, "boylam": 28.9779 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Süleymaniye Camii", "tur": "Cami", "kisa_tarihce": "Mimar Sinan'ın Kanuni Sultan Süleyman için yaptığı kalfalık eseri.", "koordinat": { "enlem": 41.0161, "boylam": 28.9639 }, "gorsel": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Kapalıçarşı", "tur": "Tarihi Çarşı", "kisa_tarihce": "4000'den fazla dükkanıyla dünyanın en eski ticaret merkezlerinden biri.", "koordinat": { "enlem": 41.0107, "boylam": 28.9681 }, "gorsel": "https://images.unsplash.com/photo-1566371534003-685cc1c59cfc?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Mısır Çarşısı", "tur": "Tarihi Çarşı", "kisa_tarihce": "1660'tan beri baharat ve yöresel lezzetlerin merkezi olan tarihi çarşı.", "koordinat": { "enlem": 41.0164, "boylam": 28.9706 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Pierre Loti Tepesi", "tur": "Manzara / Kafe", "kisa_tarihce": "Haliç manzarasına hakim, adını Fransız yazardan alan popüler tepe.", "koordinat": { "enlem": 41.0535, "boylam": 28.9338 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Rumeli Hisarı", "tur": "Kale / Müze", "kisa_tarihce": "Fatih Sultan Mehmed tarafından İstanbul'un fethi öncesi 4 ayda yapılmıştır.", "koordinat": { "enlem": 41.0851, "boylam": 29.0566 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "İstanbul Arkeoloji Müzeleri", "tur": "Müze", "kisa_tarihce": "İskender Lahdi gibi dünya çapında eserlerin sergilendiği ilk Türk müzesi.", "koordinat": { "enlem": 41.0116, "boylam": 28.9813 }, "gorsel": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Beylerbeyi Sarayı", "tur": "Saray / Müze", "kisa_tarihce": "Osmanlı padişahlarının yazlık konutu olarak Boğaz kıyısına yapılmıştır.", "koordinat": { "enlem": 41.0427, "boylam": 29.0401 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Ortaköy Camii", "tur": "Cami / Manzara", "kisa_tarihce": "Boğaz Köprüsü eşliğinde İstanbul'un en çok fotoğraflanan barok yapısı.", "koordinat": { "enlem": 41.0473, "boylam": 29.0269 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Gülhane Parkı", "tur": "Tarihi Park", "kisa_tarihce": "Sarayın eski dış bahçesi, tarihte Tanzimat Fermanı'na ev sahipliği yapmıştır.", "koordinat": { "enlem": 41.0128, "boylam": 28.9815 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Taksim Meydanı", "tur": "Meydan / Şehir Merkezi", "kisa_tarihce": "Cumhuriyet Anıtı'na ev sahipliği yapan, modern İstanbul'un kalbi sayılan meydan.", "koordinat": { "enlem": 41.0369, "boylam": 28.9851 }, "gorsel": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=800" },
    { "isim": "İstiklal Caddesi", "tur": "Tarihi Cadde / Alışveriş", "kisa_tarihce": "Beyoğlu'nun tarihi dokusu, tramvayı ve pasajlarıyla ünlü yaya yolu.", "koordinat": { "enlem": 41.0341, "boylam": 28.9791 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Bağdat Caddesi", "tur": "Alışveriş / Yaşam", "kisa_tarihce": "Anadolu Yakası'nın en popüler, lüks mağaza ve cafelerle dolu uzun caddesi.", "koordinat": { "enlem": 40.9632, "boylam": 29.0655 } },
    { "isim": "Belgrad Ormanı", "tur": "Doğa / Park", "kisa_tarihce": "Osmanlı'dan beri şehrin su kaynaklarını koruyan en büyük yeşil alanı.", "koordinat": { "enlem": 41.1819, "boylam": 28.9565 } },
    { "isim": "Büyük Çamlıca Tepesi", "tur": "Manzara / Park", "kisa_tarihce": "İstanbul'un en yüksek noktalarından biri, panoramik Boğaz manzarası sunar.", "koordinat": { "enlem": 41.0287, "boylam": 29.0667 } },
    { "isim": "Galata Köprüsü", "tur": "Köprü / Tarihi Yapı", "kisa_tarihce": "Eminönü ve Karaköy'ü bağlayan, balıkçılarıyla ünlü sembolik köprü.", "koordinat": { "enlem": 41.0202, "boylam": 28.9734 } },
    { "isim": "15 Temmuz Şehitler Köprüsü", "tur": "Köprü", "kisa_tarihce": "Asya ve Avrupa'yı ilk kez birbirine bağlayan, 1973 yapımı Boğaz köprüsü.", "koordinat": { "enlem": 41.0458, "boylam": 29.0345 } },
    { "isim": "Kadıköy Boğa Heykeli", "tur": "Meydan / Yaşam / Heykel", "kisa_tarihce": "1864 yapımı orijinal heykel, Kadıköy'ün en popüler simgesidir.", "koordinat": { "enlem": 40.9904, "boylam": 29.0305 } },
    { "isim": "Moda Sahili", "tur": "Sahil / Manzara", "kisa_tarihce": "Cumhuriyet sonrası İstanbul burjuvazisinin ve günümüz gençliğinin uğrak yeri.", "koordinat": { "enlem": 40.9791, "boylam": 29.0239 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Bebek Sahili", "tur": "Sahil / Sosyalleşme", "kisa_tarihce": "Boğaz hattının en lüks semti ve yürüyüş parkuruyla ünlü sahil şeridi.", "koordinat": { "enlem": 41.0762, "boylam": 29.0435 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Kuzguncuk", "tur": "Tarihi Semt", "kisa_tarihce": "Ahşap evleri ve hoşgörü kültürüyle bilinen, dizilerin platosu tarihi mahalle.", "koordinat": { "enlem": 41.0366, "boylam": 29.0306 } },
    { "isim": "Atatürk Arboretumu", "tur": "Doğa / Botanik Bahçe", "kisa_tarihce": "Binlerce bitki türüne ev sahipliği yapan canlı bir ağaç müzesidir.", "koordinat": { "enlem": 41.1764, "boylam": 28.9859 } },
    { "isim": "Zorlu Center", "tur": "Modern Yaşam / AVM", "kisa_tarihce": "Lüks markaları ve performans sanatları merkeziyle modern İstanbul'un yüzü.", "koordinat": { "enlem": 41.0665, "boylam": 29.0169 }, "gorsel": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Haydarpaşa Garı", "tur": "Tarihi Yapı / İstasyon", "kisa_tarihce": "1908'de Alman mimarlarca yapılan, Hicaz Demiryolu'nun başlangıç noktası.", "koordinat": { "enlem": 40.9968, "boylam": 29.0189 } },
    { "isim": "Sirkeci Garı", "tur": "Tarihi Yapı / İstasyon", "kisa_tarihce": "Ünlü Şark Ekspresi'nin (Orient Express) son durağı olan tarihi gar.", "koordinat": { "enlem": 41.0152, "boylam": 28.9774 } },
    { "isim": "Maçka Parkı", "tur": "Park / Dinlenme", "kisa_tarihce": "Şehrin merkezinde teleferik hattına da ev sahipliği yapan popüler park.", "koordinat": { "enlem": 41.0454, "boylam": 28.9926 } },
    { "isim": "Otağtepe Fatih Korusu", "tur": "Manzara / Park", "kisa_tarihce": "İki köprüyü aynı anda gören, İstanbul'un en iyi fotoğraf noktasıdır.", "koordinat": { "enlem": 41.0927, "boylam": 29.0889 } },
    { "isim": "İstinye Park", "tur": "Alışveriş Merkezi", "kisa_tarihce": "Açık ve kapalı alan konseptiyle İstanbul'un en lüks AVM'lerinden biri.", "koordinat": { "enlem": 41.1124, "boylam": 29.0351 } },
    { "isim": "Balat Renkli Evler", "tur": "Tarihi Semt / Turizm", "kisa_tarihce": "Haliç kıyısında yer alan, UNESCO korumasındaki tarihi ve renkli evler.", "koordinat": { "enlem": 41.0326, "boylam": 28.9475 } },
    { "isim": "Vialand (Isfanbul)", "tur": "Tema Park", "kisa_tarihce": "Türkiye'nin ilk ve en büyük tematik eğlence parkı ve yaşam merkezi.", "koordinat": { "enlem": 41.0772, "boylam": 28.9221 } },
    { "isim": "İstanbul Akvaryum (Florya)", "tur": "Eğlence / Akvaryum", "kisa_tarihce": "Dünyanın en büyük tematik akvaryumlarından biridir.", "koordinat": { "enlem": 40.9639, "boylam": 28.7981 } },
    { "isim": "Sapphire Seyir Terası", "tur": "Manzara / Modern Yapı", "kisa_tarihce": "236 metre yükseklikten şehri 360 derece izleme imkanı sunan gökdelen.", "koordinat": { "enlem": 41.0851, "boylam": 29.0069 } },
    { "isim": "Atatürk Kültür Merkezi (AKM)", "tur": "Sanat Merkezi", "kisa_tarihce": "Modern tasarımıyla Türkiye'nin sanat hafızası ve opera binası.", "koordinat": { "enlem": 41.0367, "boylam": 28.9869 } },
    { "isim": "Yıldız Parkı", "tur": "Park / Doğa", "kisa_tarihce": "Beşiktaş'ta saray kompleksi içinde yer alan tarihi koru.", "koordinat": { "enlem": 41.0489, "boylam": 29.0118 } },
    { "isim": "Polonezköy Tabiat Parkı", "tur": "Doğa / Köy", "kisa_tarihce": "19. yüzyılda Polonyalı sürgünler tarafından kurulan yemyeşil yerleşim.", "koordinat": { "enlem": 41.1192, "boylam": 29.2131 } },
    { "isim": "Haliç Metro Köprüsü", "tur": "Köprü / Seyir", "kisa_tarihce": "Modern tasarımı ve üzerindeki metro durağı ile eşsiz bir manzara noktası.", "koordinat": { "enlem": 41.0236, "boylam": 28.9664 } },
    { "isim": "Caddebostan Sahili", "tur": "Sahil / Etkinlik", "kisa_tarihce": "Bisiklet yolları ve parklarıyla Anadolu Yakası'nın nefes alma noktası.", "koordinat": { "enlem": 40.9678, "boylam": 29.0569 } },
    { "isim": "Nakkaştepe Millet Bahçesi", "tur": "Manzara / Park", "kisa_tarihce": "Boğaz'a karşı zipline ve yürüyüş alanları sunan modern park.", "koordinat": { "enlem": 41.0375, "boylam": 29.0378 } },
    { "isim": "Çiçek Pasajı", "tur": "Tarihi Yapı / Eğlence", "kisa_tarihce": "Beyoğlu'nun en süslü binası, eski adıyla Cité de Péra.", "koordinat": { "enlem": 41.0336, "boylam": 28.9774 } },
    { "isim": "Fransız Sokağı", "tur": "Kültür / Eğlence", "kisa_tarihce": "Beyoğlu'nda Paris atmosferini yansıtan renkli ve basamaklı sokak.", "koordinat": { "enlem": 41.0317, "boylam": 28.9798 } },
    { "isim": "Akaretler Sıraevler", "tur": "Tarihi Yapı / Mimari", "kisa_tarihce": "Sultan Abdülaziz döneminde saray çalışanları için yapılan ilk lojmanlar.", "koordinat": { "enlem": 41.0425, "boylam": 29.0001 } },
    { "isim": "Arnavutköy Sahili", "tur": "Sahil / Tarihi Semt", "kisa_tarihce": "Yalıları ve balık lokantalarıyla ünlü, mimarisi bozulmamış Boğaz köyü.", "koordinat": { "enlem": 41.0673, "boylam": 29.0436 } },
    { "isim": "Kanlıca", "tur": "Tarihi Semt", "kisa_tarihce": "Meşhur yoğurdu ve sakin atmosferiyle bilinen tarihi semt.", "koordinat": { "enlem": 41.1017, "boylam": 29.0664 } },
    { "isim": "Anadolu Kavağı", "tur": "Balıkçı Köyü / Kale", "kisa_tarihce": "Şehrin en kuzeyinde, Karadeniz'e açılan kapıda yer alan huzur noktası.", "koordinat": { "enlem": 41.1731, "boylam": 29.0886 } },
    { "isim": "Yoros Kalesi", "tur": "Kale / Manzara", "kisa_tarihce": "Doğu Roma döneminden kalma, Boğaz ve Karadeniz'e hakim stratejik kale.", "koordinat": { "enlem": 41.1772, "boylam": 29.0944 } },
    { "isim": "Emirgan Korusu", "tur": "Park / Lale Festivali", "kisa_tarihce": "Köşkleri ve her yıl düzenlenen lale festivaliyle ünlü dev bahçe.", "koordinat": { "enlem": 41.1075, "boylam": 29.0528 } },
    { "isim": "Validebağ Korusu", "tur": "Doğa / Tarih", "kisa_tarihce": "Adile Sultan Kasrı'na (Hababam Sınıfı Müzesi) ev sahipliği yapan koru.", "koordinat": { "enlem": 41.0118, "boylam": 29.0415 } },
    { "isim": "Şile Feneri", "tur": "Deniz Feneri / Manzara", "kisa_tarihce": "Dünyanın en büyük aktif deniz fenerlerinden biri (1859).", "koordinat": { "enlem": 41.1778, "boylam": 29.6105 } },
    { "isim": "Yeşilköy Sahili", "tur": "Sahil / Dinlenme", "kisa_tarihce": "Havacılık Müzesi ve marinasıyla popüler olan, eski adı San Stefano olan semt.", "koordinat": { "enlem": 40.9575, "boylam": 28.8264 } },
    { "isim": "Büyükada", "tur": "Ada / Doğa", "kisa_tarihce": "Prens Adaları'nın en büyüğü; köşkleri ve Aya Yorgi Kilisesi ile meşhur.", "koordinat": { "enlem": 40.8576, "boylam": 29.1278 } },
    { "isim": "Kanyon AVM", "tur": "Alışveriş / Mimari", "kisa_tarihce": "Açık hava konseptli ve ödüllü modern kanyon tasarımıyla ünlü alışveriş merkezi.", "koordinat": { "enlem": 41.0785, "boylam": 29.0114 } },
    { "isim": "Aydos Tepesi", "tur": "Doğa / Manzara", "kisa_tarihce": "İstanbul'un en yüksek noktası ve kalesi bulunan doğal yaşam alanı.", "koordinat": { "enlem": 40.9167, "boylam": 29.2501 } },
    { "isim": "Fatih Sultan Mehmet Köprüsü", "tur": "Köprü", "kisa_tarihce": "Asya ve Avrupa'yı bağlayan ikinci köprü (1988).", "koordinat": { "enlem": 41.0911, "boylam": 29.0608 } },
    { "isim": "Beşiktaş Çarşı", "tur": "Yaşam / Semt", "kisa_tarihce": "Şehrin en dinamik öğrenci ve taraftar kültürünün kalbi.", "koordinat": { "enlem": 41.0428, "boylam": 29.0075 } },
    { "isim": "Emaar Square Mall", "tur": "Modern Alışveriş / Eğlence", "kisa_tarihce": "Yeraltı akvaryumu ve lüks mağazalarıyla büyük yaşam merkezi.", "koordinat": { "enlem": 41.0021, "boylam": 29.0652 } },
    { "isim": "Nevizade Sokağı", "tur": "Eğlence / Gastronomi", "kisa_tarihce": "Beyoğlu'nun meşhur meyhaneler sokağı.", "koordinat": { "enlem": 41.0345, "boylam": 28.9772 } },
    { "isim": "Atatürk Havalimanı Millet Bahçesi", "tur": "Park / Etkinlik", "kisa_tarihce": "Eski havalimanı arazisine kurulan devasa şehir parkı.", "koordinat": { "enlem": 40.9769, "boylam": 28.8144 } },
    { "isim": "Rumeli Kavağı", "tur": "Balıkçı Köyü", "kisa_tarihce": "Huzurlu sahil lokantaları ve plajlarıyla bilinen uç semt.", "koordinat": { "enlem": 41.1811, "boylam": 29.0747 } },
    { "isim": "Büyük Valide Han", "tur": "Tarihi Yapı", "kisa_tarihce": "Kösem Sultan tarafından yaptırılan, çatısından sunduğu manzarayla ünlü han.", "koordinat": { "enlem": 41.0139, "boylam": 28.9691 } },
    { "isim": "Miniatürk", "tur": "Açık Hava Müzesi", "kisa_tarihce": "Türkiye ve Osmanlı coğrafyasındaki eserlerin maketlerinden oluşan park.", "koordinat": { "enlem": 41.0601, "boylam": 28.9439 } },
    { "isim": "Galataport", "tur": "Alışveriş / Çarşı / Liman", "kisa_tarihce": "Dünyanın ilk yer altı kruvaziyer terminalini barındıran modern sahil bandı.", "koordinat": { "enlem": 41.0267, "boylam": 28.9814 }, "gorsel": "https://images.unsplash.com/photo-1590604109724-40660f545195?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Pera Müzesi", "tur": "Sanat Müzesi", "kisa_tarihce": "Tarihi Bristol Oteli binasında bulunan önemli sanat merkezi.", "koordinat": { "enlem": 41.0315, "boylam": 28.9752 } },
    { "isim": "Rahmi M. Koç Müzesi", "tur": "Sanayi Müzesi", "kisa_tarihce": "Sanayi, ulaşım ve iletişim tarihine ışık tutan dev müze.", "koordinat": { "enlem": 41.0422, "boylam": 28.9491 } },
    { "isim": "Sultanahmet Meydanı", "tur": "Meydan", "kisa_tarihce": "Roma'dan bugüne şehrin tören ve etkinlik merkezi olan tarihi meydan.", "koordinat": { "enlem": 41.0062, "boylam": 28.9761 } },
    { "isim": "Abbasaga Parkı", "tur": "Park", "kisa_tarihce": "Beşiktaş'ta sosyal etkinliklerin ve mahalle kültürünün merkezi olan park.", "koordinat": { "enlem": 41.0461, "boylam": 29.0019 } },
    { "isim": "Kariye Camii", "tur": "Cami / Tarihi Yapı", "kisa_tarihce": "Bizans döneminden kalma, mozaik ve freskleriyle ünlü eski bir manastır kilisesidir.", "koordinat": { "enlem": 41.0312, "boylam": 28.9392 } },
    { "isim": "Fatih Camii", "tur": "Cami", "kisa_tarihce": "Fatih Sultan Mehmed tarafından kentin fethinden sonra yaptırılan ilk büyük sultan camisidir.", "koordinat": { "enlem": 41.0198, "boylam": 28.9497 } },
    { "isim": "Panorama 1453 Tarih Müzesi", "tur": "Müze", "kisa_tarihce": "İstanbul'un fethini 360 derece panoramik bir resimle anlatan etkileyici müze.", "koordinat": { "enlem": 41.0189, "boylam": 28.9204 } },
    { "isim": "Heybeliada", "tur": "Ada / Manzara", "kisa_tarihce": "Prens Adaları'nın en yeşil adası, Deniz Lisesi ve Ruhban Okulu ile bilinir.", "koordinat": { "enlem": 40.8775, "boylam": 29.0964 } },
    { "isim": "Burgazada", "tur": "Ada / Doğa", "kisa_tarihce": "Sait Faik Abasıyanık'ın evi ve Kalpazankaya manzarasıyla ünlü huzurlu ada.", "koordinat": { "enlem": 40.8814, "boylam": 29.0658 } },
    { "isim": "Kınalıada", "tur": "Ada", "kisa_tarihce": "Şehre en yakın ada, yazlıkçıların ve plajların uğrak noktası.", "koordinat": { "enlem": 40.9103, "boylam": 29.0494 } },
    { "isim": "Masumiyet Müzesi", "tur": "Müze", "kisa_tarihce": "Orhan Pamuk'un aynı adlı romanından yola çıkarak kurduğu, Çukurcuma'daki butik müze.", "koordinat": { "enlem": 41.0309, "boylam": 28.9796 } },
    { "isim": "Galata Mevlevihanesi", "tur": "Kültür / Müze", "kisa_tarihce": "İstanbul'un en eski Mevlevihanesi, sema gösterilerinin yapıldığı tarihi mekan.", "koordinat": { "enlem": 41.0278, "boylam": 28.9747 } },
    { "isim": "Çinili Köşk", "tur": "Tarihi Yapı / Müze", "kisa_tarihce": "Fatih Sultan Mehmed tarafından yaptırılan, Selçuklu etkisindeki seramik müzesi.", "koordinat": { "enlem": 41.0119, "boylam": 28.9818 } },
    { "isim": "İslam Bilim ve Teknoloji Tarihi Müzesi", "tur": "Müze", "kisa_tarihce": "Gülhane Parkı içinde, Müslüman bilim insanlarının buluşlarını sergileyen müze.", "koordinat": { "enlem": 41.0135, "boylam": 28.9816 } },
    { "isim": "Sakıp Sabancı Müzesi", "tur": "Müze / Sanat", "kisa_tarihce": "Emirgan'daki Atlı Köşk'te bulunan, hat ve resim koleksiyonuyla ünlü müze.", "koordinat": { "enlem": 41.1065, "boylam": 29.0565 } },
    { "isim": "İstanbul Modern", "tur": "Sanat Müzesi", "kisa_tarihce": "Türkiye'nin ilk modern ve çağdaş sanat müzesi, Karaköy sahilindeki yeni binasındadır.", "koordinat": { "enlem": 41.0264, "boylam": 28.9825 } },
    { "isim": "Santralİstanbul", "tur": "Müze / Kültür", "kisa_tarihce": "Eski Silahtarağa Elektrik Santrali'nin dönüştürülmesiyle kurulan enerji ve sanat kompleksi.", "koordinat": { "enlem": 41.0669, "boylam": 28.9461 } },
    { "isim": "Harbiye Askeri Müze", "tur": "Müze / Tarih", "kisa_tarihce": "Mehteran gösterileriyle ünlü, dünyanın sayılı askeri müzelerinden biridir.", "koordinat": { "enlem": 41.0475, "boylam": 28.9886 } },
    { "isim": "Büyük Çamlıca Camii", "tur": "Cami", "kisa_tarihce": "Cumhuriyet tarihinin en büyük camisi, Çamlıca Tepesi'nde şehre hakim noktadadır.", "koordinat": { "enlem": 41.0345, "boylam": 29.0708 } },
    { "isim": "Eyüp Sultan Camii", "tur": "Cami / Türbe", "kisa_tarihce": "Ebu Eyyub el-Ensari'nin türbesinin bulunduğu, İslam dünyasının kutsal duraklarından biri.", "koordinat": { "enlem": 41.0474, "boylam": 28.9339 } },
    { "isim": "Sepetçiler Kasrı", "tur": "Tarihi Yapı", "kisa_tarihce": "Sarayburnu sahilinde, Bizans surları üzerine inşa edilmiş bir Osmanlı yapısı.", "koordinat": { "enlem": 41.0169, "boylam": 28.9839 } },
    { "isim": "Aynalıkavak Kasrı", "tur": "Kasır", "kisa_tarihce": "Haliç kıyısında yer alan, musiki müzesi olarak da kullanılan tarihi köşk.", "koordinat": { "enlem": 41.0371, "boylam": 28.9554 } },
    { "isim": "Florya Atatürk Deniz Köşkü", "tur": "Müze / Kasır", "kisa_tarihce": "Atatürk'ün dinlenmesi için denizin içine inşa edilmiş modern mimari örneği köşk.", "koordinat": { "enlem": 40.9631, "boylam": 28.7997 } },
    { "isim": "Şerefiye Sarnıcı", "tur": "Sarnıç / Müze", "kisa_tarihce": "1600 yıllık tarihiyle, modern restorasyonu ve ışık gösterileriyle ünlü sarnıç.", "koordinat": { "enlem": 41.0076, "boylam": 28.9725 } },
    { "isim": "Binbirdirek Sarnıcı", "tur": "Sarnıç", "kisa_tarihce": "İstanbul'un ikinci büyük sarnıcı, Bizans dönemi su depolama yapısı.", "koordinat": { "enlem": 41.0081, "boylam": 28.9744 } },
    { "isim": "Cağaloğlu Hamamı", "tur": "Tarih / Müze / Tarihi Hamam", "kisa_tarihce": "1741'de I. Mahmud tarafından yaptırılan, dünyanın en ünlü tarihi hamamlarından.", "koordinat": { "enlem": 41.0108, "boylam": 28.9754 } },
    { "isim": "Çemberlitaş Hamamı", "tur": "Tarih / Müze / Tarihi Hamam", "kisa_tarihce": "Mimar Sinan tarafından 1584 yılında III. Murad'ın annesi için inşa edilmiştir.", "koordinat": { "enlem": 41.0082, "boylam": 28.9715 } },
    { "isim": "Yeni Cami (Eminönü)", "tur": "Cami", "kisa_tarihce": "Eminönü meydanında yer alan, yapımı 66 yıl süren görkemli Osmanlı camisi.", "koordinat": { "enlem": 41.0169, "boylam": 28.9719 } },
    { "isim": "Malta Köşkü", "tur": "Tarihi Yapı", "kisa_tarihce": "Yıldız Parkı içinde yer alan, Sultan Abdülaziz döneminden kalma av köşkü.", "koordinat": { "enlem": 41.0501, "boylam": 29.0135 } },
    { "isim": "Yedikule Zindanları", "tur": "Müze / Tarih", "kisa_tarihce": "Bizans'ın Altın Kapısı ve Osmanlı'nın zindan olarak kullandığı tarihi kale.", "koordinat": { "enlem": 40.9937, "boylam": 28.9228 } },
    { "isim": "Hıdiv Kasrı", "tur": "Kasır / Park", "kisa_tarihce": "Beykoz'da Mısır Hıdivi Abbas Hilmi Paşa tarafından yaptırılan Art Nouveau köşk.", "koordinat": { "enlem": 41.1058, "boylam": 29.0722 } },
    { "isim": "Yuşa Tepesi", "tur": "İnanç / Manzara", "kisa_tarihce": "Hz. Yuşa'nın makamının bulunduğuna inanılan, Boğaz girişine hakim tepe.", "koordinat": { "enlem": 41.1648, "boylam": 29.0915 } },
    { "isim": "Garipçe Köyü", "tur": "Doğa / Köy", "kisa_tarihce": "Boğaz'ın Karadeniz çıkışında, sakin balıkçı lokantalarıyla ünlü sahil köyü.", "koordinat": { "enlem": 41.2117, "boylam": 29.1089 } },
    { "isim": "Atatürk Kent Ormanı", "tur": "Doğa / Park", "kisa_tarihce": "Sarıyer'de göletleri ve yürüyüş yollarıyla kentin içindeki devasa yeşil alan.", "koordinat": { "enlem": 41.1275, "boylam": 29.0255 } }
  ],
  "populer_oteller": [
    { "isim": "Four Seasons Sultanahmet", "koordinat": { "enlem": 41.0081, "boylam": 28.9791 }, "gorsel": "https://images.unsplash.com/photo-1566371534003-685cc1c59cfc?auto=format&fit=crop&q=80&w=800" },
    { "isim": "The Ritz-Carlton Istanbul", "koordinat": { "enlem": 41.0396, "boylam": 28.9928 } },
    { "isim": "Pera Palace Hotel", "koordinat": { "enlem": 41.0312, "boylam": 28.9739 }, "gorsel": "https://images.unsplash.com/photo-1614742617631-098520894567?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Ciragan Palace Kempinski", "koordinat": { "enlem": 41.0441, "boylam": 29.0162 }, "gorsel": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800" },
    { "isim": "Swissotel The Bosphorus", "koordinat": { "enlem": 41.0401, "boylam": 28.9987 } },
    { "isim": "The Marmara Taksim", "koordinat": { "enlem": 41.0361, "boylam": 28.9855 } },
    { "isim": "Hilton Istanbul Bosphorus", "koordinat": { "enlem": 41.0449, "boylam": 28.9897 } },
    { "isim": "Shangri-La Bosphorus", "koordinat": { "enlem": 41.0416, "boylam": 29.0068 } },
    { "isim": "InterContinental Istanbul", "koordinat": { "enlem": 41.0388, "boylam": 28.9876 } },
    { "isim": "Raffles Istanbul", "koordinat": { "enlem": 41.0664, "boylam": 29.0163 } },
    { "isim": "CVK Park Bosphorus", "koordinat": { "enlem": 41.0368, "boylam": 28.9881 } },
    { "isim": "Conrad Istanbul Bosphorus", "koordinat": { "enlem": 41.0485, "boylam": 29.0090 } },
    { "isim": "Grand Hyatt Istanbul", "koordinat": { "enlem": 41.0405, "boylam": 28.9892 } },
    { "isim": "Sheraton Istanbul City Center", "koordinat": { "enlem": 41.0385, "boylam": 28.9698 } },
    { "isim": "Divan Istanbul", "koordinat": { "enlem": 41.0418, "boylam": 28.9877 } },
    { "isim": "Elite World Istanbul", "koordinat": { "enlem": 41.0382, "boylam": 28.9852 } },
    { "isim": "Titanic Downtown Beyoglu", "koordinat": { "enlem": 41.0365, "boylam": 28.9654 } },
    { "isim": "Soho House Istanbul", "koordinat": { "enlem": 41.0298, "boylam": 28.9721 } },
    { "isim": "Wyndham Grand Istanbul Levant", "koordinat": { "enlem": 41.0765, "boylam": 29.0123 } },
    { "isim": "Point Hotel Barbaros", "koordinat": { "enlem": 41.0621, "boylam": 29.0065 } },
    { "isim": "Renaissance Istanbul Polat Bosphorus", "koordinat": { "enlem": 41.0585, "boylam": 29.0042 } },
    { "isim": "Dedeman Istanbul", "koordinat": { "enlem": 41.0652, "boylam": 29.0012 } },
    { "isim": "The Stay Bosphorus", "koordinat": { "enlem": 41.0478, "boylam": 29.0272 } },
    { "isim": "A'jia Hotel", "koordinat": { "enlem": 41.1042, "boylam": 29.0654 } },
    { "isim": "Sumahan on the Water", "koordinat": { "enlem": 41.0545, "boylam": 29.0521 } },
    { "isim": "Bebek Hotel by The Stay", "koordinat": { "enlem": 41.0772, "boylam": 29.0435 } },
    { "isim": "Mandarin Oriental Bosphorus", "koordinat": { "enlem": 41.0612, "boylam": 29.0345 } },
    { "isim": "Six Senses Kocatas Mansions", "koordinat": { "enlem": 41.1652, "boylam": 29.0512 } },
    { "isim": "Fuad Pasa Yalisi", "koordinat": { "enlem": 41.1212, "boylam": 29.0712 } },
    { "isim": "Grand Tarabya", "koordinat": { "enlem": 41.1412, "boylam": 29.0552 } },
    { "isim": "Hilton Istanbul Bakirkoy", "koordinat": { "enlem": 40.9752, "boylam": 28.8512 } },
    { "isim": "Sheraton Istanbul Atakoy", "koordinat": { "enlem": 40.9712, "boylam": 28.8752 } },
    { "isim": "Hyatt Regency Istanbul Atakoy", "koordinat": { "enlem": 40.9721, "boylam": 28.8652 } },
    { "isim": "DoubleTree by Hilton Moda", "koordinat": { "enlem": 40.9852, "boylam": 29.0252 } },
    { "isim": "Wyndham Grand Kalamis", "koordinat": { "enlem": 40.9782, "boylam": 29.0382 } },
    { "isim": "Park Hyatt Istanbul Macka Palas", "koordinat": { "enlem": 41.0482, "boylam": 28.9952 } },
    { "isim": "W Istanbul", "koordinat": { "enlem": 41.0423, "boylam": 29.0005 } },
    { "isim": "Ajwa Sultanahmet", "koordinat": { "enlem": 41.0058, "boylam": 28.9712 } },
    { "isim": "Legacy Ottoman Hotel", "koordinat": { "enlem": 41.0162, "boylam": 28.9742 } }

  ]
};

export const TRANSLATIONS = {
  tr: {
    title: "İstanbul Akıllı Rehber", discover: "İstanbul'u Keşfet", subtitle: "Sizin için en mantıklı gezi rotasını hazırlıyoruz.",
    start: "Hemen Başla", planner: "Seyahat Planlayıcı", hotelStart: "Otelden Başla", districtStart: "Semtten Başla",
    hotelLabel: "Konakladığınız Otel", districtLabel: "Başlangıç Semti", duration: "Süre", days: "GÜN",
    interests: "İlgi Alanları", dailyPace: "Günlük Tempo", paceScale: ["Yavaş", "Normal", "Yoğun", "Zirve"],
    createRoute: "Rota Çiz", calculating: "Hesaplanıyor...", dailyRoute: "Günlük Rota Planınız", day: "GÜN",
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
    }
  },
  en: {
    title: "Istanbul Smart Guide", discover: "Discover Istanbul", subtitle: "We prepare the most logical travel route for you.",
    start: "Start Now", planner: "Travel Planner", hotelStart: "Start from Hotel", districtStart: "Start from District",
    hotelLabel: "Your Hotel", districtLabel: "Starting District", duration: "Duration", days: "DAYS",
    interests: "Interests", dailyPace: "Daily Pace", paceScale: ["Relaxed", "Normal", "Active", "Peak"],
    createRoute: "Create Route", calculating: "Calculating...", dailyRoute: "Your Daily Route Plan", day: "DAY",
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

export type Venue = typeof ISTANBUL_DATA.turistik_mekanlar[0];
export type Hotel = typeof ISTANBUL_DATA.populer_oteller[0];
