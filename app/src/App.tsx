import { useEffect, useRef, useLayoutEffect, useState, createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Facebook,
  Youtube,
  Instagram,
  MapPin,
  Clock,
  Phone,
  ChevronDown,
  Menu,
  X,
  Globe,
  Copy,
  Check,
  Calendar,
  Play,
  PlayCircle,
  ArrowRight
} from 'lucide-react';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// ==================== MULTILINGUAL CONTEXT ====================
type Language = 'en' | 'sw' | 'fr' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    sw: string;
    fr: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  navHome: { en: 'Home', sw: 'Nyumbani', fr: 'Accueil', ar: 'الرئيسية' },
  navAbout: { en: 'About', sw: 'Kuhusu', fr: 'À propos', ar: 'عن الكنيسة' },
  navSermons: { en: 'Sermons', sw: 'Mahubiri', fr: 'Sermons', ar: 'العظات' },
  navEvents: { en: 'Events', sw: 'Matukio', fr: 'Événements', ar: 'الفعاليات' },
  navGive: { en: 'Give', sw: 'Changia', fr: 'Donner', ar: 'التبرع' },
  navContact: { en: 'Contact', sw: 'Wasiliana', fr: 'Contact', ar: 'اتصل بنا' },

  // Hero Section
  heroTitle: {
    en: 'OUR GOD IS',
    sw: 'MUNGU WETU NI',
    fr: 'NOTRE DIEU EST',
    ar: 'إلهنا هو'
  },
  heroSubtitle: {
    en: 'CONSUMING FIRE',
    sw: 'MOTO ULAO',
    fr: 'FEU CONSOMMATEUR',
    ar: 'نار آكلة'
  },
  heroLocation: {
    en: 'Christ Synagogue Ministries · Arusha, Tanzania',
    sw: 'Christ Synagogue Ministries · Arusha, Tanzania',
    fr: 'Christ Synagogue Ministries · Arusha, Tanzanie',
    ar: 'كنيس المسيح · أروشا، تنزانيا'
  },
  heroCTA: {
    en: 'Join Us This Sunday',
    sw: 'Ungana Nasi Jumapili',
    fr: 'Rejoignez-nous ce dimanche',
    ar: 'انضم إلينا يوم الأحد'
  },
  scrollHint: { en: 'Scroll', sw: 'Sogeza', fr: 'Défiler', ar: 'تمرير' },

  // Welcome Section
  welcomeLabel: { en: 'WELCOME', sw: 'KARIBU', fr: 'BIENVENUE', ar: 'أهلاً وسهلاً' },
  welcomeTitle: {
    en: 'A Prophetic Ministry',
    sw: 'Huduma ya Kinabii',
    fr: 'Une Ministère Prophétique',
    ar: 'خدمة نبوية'
  },
  welcomeBody: {
    en: 'Based on the foundation of Prophet Baraka D. Ogillo, Christ’s Synagogue Ministries is a global prophetic ministry. We are home to Prophetic Power TV and a monthly devotional magazine that reaches nations. Through these platforms, thousands have accepted Jesus as their Savior.',
    sw: 'Kwa msingi wa Nabii Baraka D. Ogillo, Christ’s Synagogue Ministries ni huduma ya kinabii ya kimataifa. Sisi ni nyumbani kwa Prophetic Power TV na jarida la kila mwezi linalofikia mataifa. Kupitia majukwaa haya, maelfu wamemkubali Yesu kama Mwokozi wao.',
    fr: 'Fondé par le Prophète Baraka D. Ogillo, Christ’s Synagogue Ministries est un ministère prophétique mondial. Nous abritons Prophetic Power TV et un magazine de dévotion mensuel qui touche les nations. À travers ces plateformes, des milliers ont accepté Jésus comme leur Sauveur.',
    ar: 'تأسست أسس خدمة كنيس المسيح على يد النبي باراكا د. أوجيلو، وهي خدمة نبوية عالمية. نحن موطن لقناة القوة النبوية ومجلة تعبدية شهرية تصل إلى الأمم. من خلال هذه المنصات، قبل الآلاف يسوع مخلصاً لهم.'
  },
  welcomeCTA1: { en: 'About Us', sw: 'Kuhusu Sisi', fr: 'À Propos', ar: 'عنّا' },
  welcomeCTA2: { en: 'Service Times', sw: 'Muda wa Ibada', fr: 'Horaires', ar: 'أوقات الخدمة' },

  // Calling Section
  callingLabel: { en: 'OUR CALLING', sw: 'WITO WETU', fr: 'NOTRE APPEL', ar: 'دعوتنا' },
  callingTitle1: { en: 'Preach the Gospel', sw: 'Kuhubiri Injili', fr: 'Prêcher l\'Évangile', ar: 'كرازة الإنجيل' },
  callingTitle2: { en: 'Heal the Broken', sw: 'Kuponya Waliovunjika', fr: 'Guérir les Brisés', ar: 'شفاء المكسورين' },
  callingBody: {
    en: 'Through teaching, prayer, and compassionate outreach.',
    sw: 'Kupitia mafundisho, maombi, na utume wenye huruma.',
    fr: 'À travers l\'enseignement, la prière et le service compassionnel.',
    ar: 'من خلال التعليم والصلاة والخدمة الرحيمة.'
  },
  callingCTA: { en: 'Our Ministries', sw: 'Huduma Zetu', fr: 'Nos Ministères', ar: 'خدماتنا' },

  // Sermons Section
  sermonsLabel: { en: 'SERMONS', sw: 'MAHUBIRI', fr: 'SERMONS', ar: 'العظات' },
  sermonsTitle: { en: 'Latest Message', sw: 'Ujumbe Mpya', fr: 'Dernier Message', ar: 'أحدث رسالة' },
  sermonsMeta: { en: 'Sundays · 10:00 AM EAT', sw: 'Jumapili · 10:00 AM EAT', fr: 'Dimanches · 10h00 EAT', ar: 'الأحد · 10:00 صباحاً بتوقيت شرق أفريقيا' },
  sermonsRecent: { en: 'Recent Sermons', sw: 'Mahubiri ya Hivi Karibuni', fr: 'Sermons Récents', ar: 'عظات حديثة' },
  sermonsViewAll: { en: 'View All Sermons', sw: 'Tazama Mahubiri Yote', fr: 'Voir Tous les Sermons', ar: 'عرض جميع العظات' },
  sermonsCTA: { en: 'Watch Online', sw: 'Tazama Mtandaoni', fr: 'Regarder en Ligne', ar: 'شاهد عبر الإنترنت' },

  // Events Section
  eventsLabel: { en: 'EVENTS', sw: 'MATUKIO', fr: 'ÉVÉNEMENTS', ar: 'الفعاليات' },
  eventsTitle: { en: 'Come Fellowship', sw: 'Njoo Kujumuika', fr: 'Venez en Communion', ar: 'تعال للشركة' },
  eventsBody: {
    en: 'Bible studies, youth nights, outreach, and seasonal gatherings.',
    sw: 'Masomo ya Biblia, usiku wa vijana, utume, na mikusanyiko ya msimu.',
    fr: 'Études bibliques, soirées jeunes, outreach et rassemblements saisonniers.',
    ar: 'دراسات الكتاب المقدس، ليالي الشباب، الخدمة الخارجية، والاجتماعات الموسمية.'
  },
  eventsCTA: { en: 'View Calendar', sw: 'Angalia Kalenda', fr: 'Voir le Calendrier', ar: 'عرض التقويم' },

  // Beliefs Section
  beliefsLabel: { en: 'OUR FAITH', sw: 'IMANI YETU', fr: 'NOTRE FOI', ar: 'إيماننا' },
  beliefsTitle: { en: 'What We Believe', sw: 'Tunayoamini', fr: 'Ce que Nous Croyons', ar: 'ما نؤمن به' },
  beliefsBody: {
    en: 'Jesus is Lord. The Bible is our authority. The Spirit empowers. The Church is family.',
    sw: 'Yesu ni Bwana. Biblia ni mamlaka yetu. Roho huwezesha. Kanisa ni familia.',
    fr: 'Jésus est Seigneur. La Bible est notre autorité. L\'Esprit donne la puissance. L\'Église est une famille.',
    ar: 'يسوع هو الرب. الكتاب المقدس هو سلطتنا. الروح يقوي. الكنيسة هي عائلة.'
  },
  beliefsCTA: { en: 'Statement of Faith', sw: 'Tamko la Imani', fr: 'Déclaration de Foi', ar: 'بيان الإيمان' },

  // Give Section
  giveLabel: { en: 'GIVE', sw: 'CHANGIA', fr: 'DONNER', ar: 'تبرع' },
  giveTitle: { en: 'Support the Mission', sw: 'Support Ujumbe', fr: 'Soutenir la Mission', ar: 'دعم المهمة' },
  giveBody: {
    en: 'Your generosity fuels outreach, discipleship, and care for our community.',
    sw: 'Ukaramavu wako unawasha utume, ufunuo, na utunzaji wa jamii yetu.',
    fr: 'Votre générosité alimente l\'outreach, le discipulat et les soins pour notre communauté.',
    ar: 'كرمكم يغذي الخدمة الخارجية والتلمذة والرعاية لمجتمعنا.'
  },
  giveCTA: { en: 'Give Online', sw: 'Changia Mtandaoni', fr: 'Donner en Ligne', ar: 'تبرع عبر الإنترنت' },
  giveNote: { en: 'Secure giving · Multiple methods', sw: 'Changio salama · Njia mbalimbali', fr: 'Don sécurisé · Méthodes multiples', ar: 'تبرع آمن · طرق متعددة' },

  // Contact Section
  contactLabel: { en: 'CONTACT', sw: 'WASILIANA', fr: 'CONTACT', ar: 'اتصل بنا' },
  contactTitle: { en: 'Visit Us', sw: 'Tutembelee', fr: 'Visitez-nous', ar: 'زورنا' },
  contactServiceTimes: { en: 'Service Times', sw: 'Muda wa Ibada', fr: 'Horaires', ar: 'أوقات الخدمة' },
  contactLocation: { en: 'Location', sw: 'Mahali', fr: 'Lieu', ar: 'الموقع' },
  contactContact: { en: 'Contact', sw: 'Mawasiliano', fr: 'Contact', ar: 'تواصل' },
  contactSunday: { en: 'Sunday Worship · 10:00 AM', sw: 'Ibada ya Jumapili · 10:00 AM', fr: 'Culte du Dimanche · 10h00', ar: 'عبادة الأحد · 10:00 صباحاً' },
  contactTuesday: { en: 'Tuesday · 6:00 PM', sw: 'Jumanne · 6:00 PM', fr: 'Mardi · 18h00', ar: 'الثلاثاء · 6:00 مساءً' },
  contactThursday: { en: 'Thursday · 6:00 PM', sw: 'Alhamisi · 6:00 PM', fr: 'Jeudi · 18h00', ar: 'الخميس · 6:00 مساءً' },
  contactSaturday: { en: 'Saturday · 2:00 PM', sw: 'Jumamosi · 2:00 PM', fr: 'Samedi · 14h00', ar: 'السبت · 2:00 مساءً' },
  contactArusha: { en: 'Arusha, Tanzania', sw: 'Arusha, Tanzania', fr: 'Arusha, Tanzanie', ar: 'أروشا، تنزانيا' },
  contactProphet: { en: 'Led by Prophet Baraka David Ogillo', sw: 'Inayoongozwa na Nabii Baraka David Ogillo', fr: 'Dirigé par le Prophète Baraka David Ogillo', ar: 'بقيادة النبي باراكا ديفيد أوجيلو' },
  contactPhone: { en: '+255 769 075 062', sw: '+255 769 075 062', fr: '+255 769 075 062', ar: '+255 769 075 062' },
  contactMpesa: { en: 'M-Pesa Available', sw: 'M-Pesa Inapatikana', fr: 'M-Pesa Disponible', ar: 'M-Pesa متاح' },
  contactBank: { en: 'CRDB Bank Transfer', sw: 'Uhamisho wa Benki ya CRDB', fr: 'Virement Bancaire CRDB', ar: 'تحويل بنك CRDB' },
  contactFormTitle: { en: 'Send Us a Message', sw: 'Tutumie Ujumbe', fr: 'Envoyez-nous un Message', ar: 'أرسل لنا رسالة' },
  contactName: { en: 'Your Name', sw: 'Jina Lako', fr: 'Votre Nom', ar: 'اسمك' },
  contactEmail: { en: 'Your Email', sw: 'Barua Pepe Yako', fr: 'Votre Email', ar: 'بريدك الإلكتروني' },
  contactMessage: { en: 'Your Message', sw: 'Ujumbe Wako', fr: 'Votre Message', ar: 'رسالتك' },
  contactSend: { en: 'Send Message', sw: 'Tuma Ujumbe', fr: 'Envoyer', ar: 'إرسال' },

  // Footer
  footerTagline: {
    en: 'A House of Prayer for All Nations.',
    sw: 'Nyumba ya Maombi kwa Mataifa Yote.',
    fr: 'Une Maison de Prière pour Toutes les Nations.',
    ar: 'بيت صلاة لجميع الأمم.'
  },
  footerCopyright: {
    en: 'All rights reserved.',
    sw: 'Haki zote zimehifadhiwa.',
    fr: 'Tous droits réservés.',
    ar: 'جميع الحقوق محفوظة.'
  },

  // Give Section Details
  giveMpesaTitle: { en: 'M-PESA', sw: 'M-PESA', fr: 'M-PESA', ar: 'M-PESA' },
  giveMpesaDesc: { en: 'Send your support via M-Pesa', sw: 'Tuma mchango wako kupitia M-Pesa', fr: 'Envoyez votre don via M-Pesa', ar: 'أرسل دعمك عبر M-Pesa' },
  giveMpesaNumber: { en: '+255 769 075 062', sw: '+255 769 075 062', fr: '+255 769 075 062', ar: '+255 769 075 062' },
  giveBankTitle: { en: 'CRDB BANK', sw: 'BENKI YA CRDB', fr: 'BANQUE CRDB', ar: 'بنك CRDB' },
  giveBankDesc: { en: 'Bank transfer to our ministry account', sw: 'Uhamisho wa benki kwenye akaunti ya huduma yetu', fr: 'Virement bancaire vers notre compte ministériel', ar: 'تحويل بنكي إلى حساب خدمتنا' },
  giveAccountNumber: { en: '015C922043100', sw: '015C922043100', fr: '015C922043100', ar: '015C922043100' },
  giveAccountName: { en: 'CHRISTS SYNAGOGUE MINISTRY', sw: 'CHRISTS SYNAGOGUE MINISTRY', fr: 'CHRISTS SYNAGOGUE MINISTRY', ar: 'CHRISTS SYNAGOGUE MINISTRY' },
  copySuccess: { en: 'Copied!', sw: 'Imenakiliwa!', fr: 'Copié!', ar: 'تم النسخ!' },
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}>({ lang: 'en', setLang: () => { }, t: (key) => key });

const useLanguage = () => useContext(LanguageContext);

// ==================== CROSS SVG COMPONENT ====================
import { forwardRef } from 'react';

const CrossSVG = forwardRef<SVGSVGElement, { className?: string; strokeWidth?: number; strokeColor?: string }>(
  ({ className = '', strokeWidth = 12, strokeColor }, ref) => (
    <svg
      ref={ref}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line
        x1="50" y1="0" x2="50" y2="100"
        stroke={strokeColor || "hsl(var(--primary))"}
        strokeWidth={strokeWidth * 0.1}
        className="cross-line"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="0" y1="50" x2="100" y2="50"
        stroke={strokeColor || "hsl(var(--primary))"}
        strokeWidth={strokeWidth * 0.1}
        className="cross-line"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
);
CrossSVG.displayName = 'CrossSVG';

// ==================== LANGUAGE SELECTOR ====================
const LanguageSelector = () => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <Globe size={18} />
        <span className="text-sm uppercase">{lang}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg overflow-hidden z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setIsOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-primary/10 transition-colors ${lang === l.code ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <span>{l.flag}</span>
              <span className="text-sm">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== NAVIGATION ====================
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('navAbout'), href: '#welcome' },
    { label: t('navSermons'), href: '#sermons' },
    { label: t('navEvents'), href: '#events' },
    { label: t('navGive'), href: '#give' },
    { label: t('navContact'), href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/90 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          <a href="#" className="font-serif text-xl lg:text-2xl text-foreground tracking-wide">
            Christ Synagogue
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageSelector />
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

// ==================== HERO SECTION ====================
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const cross = crossRef.current;
    if (!section || !content || !cross) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      const lines = cross.querySelectorAll('line');
      tl.fromTo(lines,
        { strokeDasharray: 2000, strokeDashoffset: 2000 },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', stagger: 0.1 }
      );

      tl.fromTo(content.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1 },
        '-=0.6'
      );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(content.children, { y: 0, opacity: 1 });
            gsap.set(lines, { opacity: 1 });
          }
        }
      });

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1, scale: 1 },
        { y: '-10vh', opacity: 0, scale: 1.05, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(lines,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-10">
      <img
        src="/hero_bg.jpg"
        alt="Church interior"
        className="bg-image"
      />
      <div className="absolute inset-0 bg-black/50" />

      <CrossSVG ref={crossRef} strokeWidth={12} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-tight tracking-wide">
          {t('heroTitle')}<br />
          <span className="text-primary">{t('heroSubtitle')}</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground tracking-wide">
          {t('heroLocation')}
        </p>
        <a href="#welcome" className="btn-primary mt-10">
          {t('heroCTA')}
        </a>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground">
          <span className="text-xs tracking-widest uppercase mb-2">{t('scrollHint')}</span>
          <ChevronDown className="animate-bounce" size={20} />
        </div>
      </div>
    </section>
  );
};

// ==================== WELCOME SECTION ====================
const WelcomeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(section.querySelector('img'),
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="welcome" ref={sectionRef} className="section-pinned z-20">
      <img
        src="/welcome_bg.jpg"
        alt="Community worship"
        className="bg-image"
      />
      <div className="absolute inset-0 bg-black/50" />

      <CrossSVG strokeWidth={10} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="label-text text-primary mb-6">{t('welcomeLabel')}</span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          {t('welcomeTitle')}
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {t('welcomeBody')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a href="#calling" className="btn-primary">{t('welcomeCTA1')}</a>
          <a href="#contact" className="btn-outline">{t('welcomeCTA2')}</a>
        </div>
      </div>
    </section>
  );
};

// ==================== CALLING SECTION ====================
const CallingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(section.querySelector('img'),
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      const headline1 = content.querySelector('.headline-1');
      const headline2 = content.querySelector('.headline-2');

      scrollTl.fromTo(headline1,
        { x: '-12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(headline2,
        { x: '12vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.05
      );

      scrollTl.fromTo(content.querySelectorAll('.fade-in'),
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.03, ease: 'power2.out' },
        0.1
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="calling" ref={sectionRef} className="section-pinned z-30">
      <img
        src="/calling_bg.jpg"
        alt="Hands in prayer"
        className="bg-image"
      />
      <div className="absolute inset-0 bg-black/50" />

      <CrossSVG strokeWidth={10} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="label-text text-primary mb-6 fade-in">{t('callingLabel')}</span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          <span className="headline-1 block">{t('callingTitle1')}</span>
          <span className="headline-2 block text-primary">{t('callingTitle2')}</span>
        </h2>
        <p className="fade-in mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
          {t('callingBody')}
        </p>
        <a href="#contact" className="btn-primary mt-10 fade-in">{t('callingCTA')}</a>
      </div>
    </section>
  );
};

// ==================== SERMONS SECTION ====================
const SermonsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // Background parallax
      scrollTl.fromTo(section.querySelector('.bg-image'),
        { scale: 1.08 },
        { scale: 1, ease: 'none' },
        0
      );

      // Content fade in
      scrollTl.fromTo(content,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 },
        0
      );

      // Content fade out
      scrollTl.fromTo(content,
        { opacity: 1 },
        { opacity: 0, y: -30, ease: 'power2.in' },
        0.8
      );

    }, section);

    return () => ctx.revert();
  }, []);

  // YouTube video thumbnail URL (keep existing or update nicely)
  const youtubeThumbnail = "/sermon_thumb.jpg";
  const youtubeVideoUrl = "https://www.youtube.com/live/RrdxyQ9mwDU?si=Trnde5gwaejaa7nV";

  const recentSermons = [
    { title: "The Power of Faith", meta: "Last Sunday · 45 min", url: "#" },
    { title: "Walking in Victory", meta: "Two weeks ago · 52 min", url: "#" },
  ];

  return (
    <section id="sermons" ref={sectionRef} className="section-pinned z-40 flex items-center">
      {/* Background with Golden Black aesthetic */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-image grayscale brightness-75 contrast-125 sepia-[.5]"
        style={{ backgroundImage: `url(${youtubeThumbnail})` }}
      />
      <div className="absolute inset-0 bg-background/70 mix-blend-hard-light" />
      <div className="absolute inset-0 bg-primary/40 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-80" />
      {/* Void Transitions */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      <CrossSVG strokeWidth={10} />

      <div ref={contentRef} className="relative z-10 container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
        {/* Left Column: Featured Message */}
        <div className="flex flex-col items-start text-left pt-20 lg:pt-0">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-primary/60"></div>
            <span className="text-primary tracking-[0.2em] text-sm font-medium uppercase">{t('sermonsLabel')}</span>
            <div className="h-[1px] w-12 bg-primary/60"></div>
          </div>

          <h2 className="font-serif text-5xl lg:text-7xl text-foreground leading-none mb-6">
            Latest <span className="text-primary">Message</span>
          </h2>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 text-sm lg:text-base">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>Sundays</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              <span>10:00 AM EAT</span>
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-10 max-w-xl leading-relaxed">
            Join us every Sunday for powerful messages that will inspire, challenge, and transform your life. Experience the Word of God preached with passion and clarity.
          </p>

          <a
            href={youtubeVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-3 pl-6 pr-8"
          >
            <Play size={20} fill="currentColor" />
            {t('sermonsCTA')}
          </a>
        </div>

        {/* Right Column: Recent Sermons List */}
        <div className="w-full max-w-lg mx-auto lg:ml-auto">
          <div className="flex items-center gap-3 mb-6 text-muted-foreground/80">
            <PlayCircle size={18} className="text-primary" />
            <span className="text-xs font-semibold tracking-widest uppercase">{t('sermonsRecent')}</span>
          </div>

          <div className="space-y-4">
            {recentSermons.map((sermon, i) => (
              <a
                key={i}
                href={sermon.url}
                className="group block bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 rounded-xl p-6 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
                      {sermon.title}
                    </h4>
                    <span className="text-sm text-muted-foreground mt-2 block">
                      {sermon.meta}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shrink-0">
                    <Play size={14} fill="currentColor" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center lg:text-left">
            <a
              href="https://www.youtube.com/@ProphetBarakaOgillo/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-white transition-colors tracking-widest uppercase py-2"
            >
              {t('sermonsViewAll')} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== EVENTS SECTION ====================
const EventsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(section.querySelector('img'),
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="events" ref={sectionRef} className="section-pinned z-50">
      <img
        src="/IMG_2136.jpg"
        alt="Fellowship"
        className="bg-image object-cover object-top grayscale brightness-75 contrast-125 sepia-[.5]"
      />
      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
      {/* Gradient overlay: Dark at bottom for text, semi-transparent in center, clear at top for face */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <CrossSVG strokeWidth={12} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="label-text text-primary mb-6">{t('eventsLabel')}</span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          {t('eventsTitle')}
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
          {t('eventsBody')}
        </p>
        <a
          href="https://csm.church/announcements"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-10"
        >
          {t('eventsCTA')}
        </a>
      </div>
    </section>
  );
};

// ==================== BELIEFS SECTION ====================
const BeliefsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(section.querySelector('img'),
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="beliefs" ref={sectionRef} className="section-pinned z-[60]">
      <img
        src="/beliefs_bg.jpg"
        alt="Bible and prayer"
        className="bg-image"
      />
      <div className="absolute inset-0 bg-black/50" />

      <CrossSVG strokeWidth={10} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="label-text text-primary mb-6">{t('beliefsLabel')}</span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          {t('beliefsTitle')}
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl">
          {t('beliefsBody')}
        </p>
        <button className="btn-primary mt-10">{t('beliefsCTA')}</button>
      </div>
    </section>
  );
};

// ==================== GIVE SECTION ====================
const GiveSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      scrollTl.fromTo(section.querySelector('img'),
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(content.children,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="give" ref={sectionRef} className="section-pinned z-[70]">
      <img
        src="/give_bg.jpg"
        alt="Giving hands"
        className="bg-image"
      />
      <div className="absolute inset-0 bg-black/50" />

      <CrossSVG strokeWidth={10} />

      <div ref={contentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="label-text text-primary mb-6">{t('giveLabel')}</span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          {t('giveTitle')}
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl">
          {t('giveBody')}
        </p>

        {/* Payment Methods */}
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          {/* M-Pesa */}
          <div className="info-card text-left min-w-[280px]">
            <h3 className="font-serif text-xl text-primary mb-2">{t('giveMpesaTitle')}</h3>
            <p className="text-muted-foreground text-sm mb-3">{t('giveMpesaDesc')}</p>
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
              <span className="text-foreground">{t('giveMpesaNumber')}</span>
              <button
                onClick={() => copyToClipboard('+255769075062', 'mpesa')}
                className="text-primary hover:text-white transition-colors"
              >
                {copied === 'mpesa' ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="info-card text-left min-w-[280px]">
            <h3 className="font-serif text-xl text-primary mb-2">{t('giveBankTitle')}</h3>
            <p className="text-muted-foreground text-sm mb-3">{t('giveBankDesc')}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                <span className="text-foreground text-sm">{t('giveAccountNumber')}</span>
                <button
                  onClick={() => copyToClipboard('015C922043100', 'account')}
                  className="text-primary hover:text-white transition-colors"
                >
                  {copied === 'account' ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                <span className="text-foreground text-sm">{t('giveAccountName')}</span>
                <button
                  onClick={() => copyToClipboard('CHRISTS SYNAGOGUE MINISTRY', 'name')}
                  className="text-primary hover:text-white transition-colors"
                >
                  {copied === 'name' ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{t('giveNote')}</p>
      </div>
    </section>
  );
};

// ==================== CONTACT SECTION ====================
const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content.children,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      const cards = section.querySelectorAll('.info-card');
      gsap.fromTo(cards,
        { y: '4vh', opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative z-[80] bg-background py-24 lg:py-32">
      <div ref={contentRef} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="label-text text-primary mb-4 block">{t('contactLabel')}</span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">
            {t('contactTitle')}
          </h2>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <div className="info-card text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-3">{t('contactServiceTimes')}</h3>
            <p className="text-muted-foreground">{t('contactSunday')}</p>
            <p className="text-muted-foreground">{t('contactTuesday')}</p>
            <p className="text-muted-foreground">{t('contactThursday')}</p>
            <p className="text-muted-foreground">{t('contactSaturday')}</p>
          </div>

          <div className="info-card text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-3">{t('contactLocation')}</h3>
            <p className="text-muted-foreground">{t('contactArusha')}</p>
            <p className="text-muted-foreground">{t('contactProphet')}</p>
          </div>

          <div className="info-card text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-3">{t('contactContact')}</h3>
            <p className="text-muted-foreground">{t('contactPhone')}</p>
            <p className="text-muted-foreground">{t('contactMpesa')}</p>
            <p className="text-muted-foreground">{t('contactBank')}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="info-card">
            <h3 className="font-serif text-2xl text-foreground text-center mb-8">{t('contactFormTitle')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder={t('contactName')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder={t('contactEmail')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <textarea
                placeholder={t('contactMessage')}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="form-input resize-none"
                required
              />
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? '...' : submitted ? '✓' : t('contactSend')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(footer.querySelector('.footer-content'),
        { y: '3vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative z-[80] bg-background py-16 border-t border-primary/15">
      <div className="footer-content max-w-4xl mx-auto px-6 text-center">
        <h3 className="font-serif text-3xl text-foreground mb-4">
          Christ Synagogue
        </h3>
        <p className="text-primary font-serif text-xl mb-8">
          {t('footerTagline')}
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-10">
          <a
            href="https://web.facebook.com/Prophetbaraka.ogillo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.youtube.com/@ogillob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@propheticpowertvp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram size={24} />
          </a>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
          <a href="#welcome" className="text-muted-foreground hover:text-primary transition-colors">{t('navAbout')}</a>
          <a href="#sermons" className="text-muted-foreground hover:text-primary transition-colors">{t('navSermons')}</a>
          <a href="#events" className="text-muted-foreground hover:text-primary transition-colors">{t('navEvents')}</a>
          <a href="#give" className="text-muted-foreground hover:text-primary transition-colors">{t('navGive')}</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">{t('navContact')}</a>
        </div>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Christ Synagogue Ministries. {t('footerCopyright')}
        </p>
      </div>
    </footer>
  );
};

// ==================== MAIN APP ====================
function App() {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  useEffect(() => {
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out'
        }
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="relative bg-background">
        <div className="grain-overlay" />
        <Navigation />
        <main className="relative">
          <HeroSection />
          <WelcomeSection />
          <CallingSection />
          <SermonsSection />
          <EventsSection />
          <BeliefsSection />
          <GiveSection />
          <ContactSection />
          <Footer />
        </main>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;
