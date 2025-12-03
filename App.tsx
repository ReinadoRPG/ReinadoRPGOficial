import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ShoppingCart, Settings, Moon, Sun, Globe, Search, 
  Trash2, Sword, Scroll, ShoppingBag, MessageCircle, HelpCircle, User,
  Copy, ShieldAlert, CheckCircle, MonitorSmartphone, Languages
} from 'lucide-react';
import { ServerStatus, StoreItem, CartItem, Command, Language } from './types';
import AiAssistant from './components/AiAssistant';

// --- Translation Data ---
const TRANSLATIONS = {
  pt: {
    nav: { home: "Início", commands: "Comandos", rules: "Regras", store: "Loja", support: "Suporte" },
    home: {
      javaIp: "Java IP",
      bedrockIp: "Bedrock IP",
      serverStatus: "Status do Reino",
      online: "ONLINE",
      offline: "OFFLINE",
      activePlayers: "aventureiros ativos",
      playersOnlineTitle: "Aventureiros Online",
      noPlayers: "Nenhum aventureiro nos campos de batalha no momento...",
      loreTitle: "Lore do Mundo",
      loreText: "O continente de Aeldrynn é dividido em 5 grandes regiões, cada uma com sua história, cidades, conflitos e criaturas próprias. No centro de tudo, um poder antigo desperta, chamando heróis de todas as eras para defenderem o que restou da luz... ou mergulharem o mundo nas trevas eternas.",
      discordBtn: "Discord",
      whatsappBtn: "WhatsApp"
    },
    commands: {
      searchPlaceholder: "Buscar encantamento...",
      title: "Comandos do Servidor",
      desc: "Lista de encantamentos verbais disponíveis."
    },
    rules: {
      title: "Código de Conduta",
      subtitle: "A violação destas leis pode resultar em exílio permanente."
    },
    store: {
      buy: "Comprar",
      cartTitle: "Sua Mochila",
      emptyCart: "Sua mochila está vazia.",
      total: "Total",
      checkout: "Finalizar Pedido",
      added: "adicionado ao carrinho!",
      cartEmptyError: "Carrinho vazio!"
    },
    support: {
      whatsappTitle: "WhatsApp Direto",
      whatsappDesc: "Fale diretamente com a administração.",
      discordTitle: "Discord Oficial",
      discordDesc: "Tickets, comunidade e anúncios."
    },
    footer: {
      rights: "Todos os direitos reservados.",
      disclaimer: "Não afiliado à Mojang Studios."
    }
  },
  en: {
    nav: { home: "Home", commands: "Commands", rules: "Rules", store: "Store", support: "Support" },
    home: {
      javaIp: "Java IP",
      bedrockIp: "Bedrock IP",
      serverStatus: "Realm Status",
      online: "ONLINE",
      offline: "OFFLINE",
      activePlayers: "active adventurers",
      playersOnlineTitle: "Adventurers Online",
      noPlayers: "No adventurers on the battlefield at the moment...",
      loreTitle: "World Lore",
      loreText: "The continent of Aeldrynn is divided into 5 great regions, each with its own history, cities, conflicts, and creatures. In the center of it all, an ancient power awakens, calling heroes from all eras to defend what remains of the light... or plunge the world into eternal darkness.",
      discordBtn: "Discord",
      whatsappBtn: "WhatsApp"
    },
    commands: {
      searchPlaceholder: "Search enchantment...",
      title: "Server Commands",
      desc: "List of available verbal enchantments."
    },
    rules: {
      title: "Code of Conduct",
      subtitle: "Violation of these laws may result in permanent exile."
    },
    store: {
      buy: "Buy",
      cartTitle: "Your Backpack",
      emptyCart: "Your backpack is empty.",
      total: "Total",
      checkout: "Checkout",
      added: "added to cart!",
      cartEmptyError: "Cart is empty!"
    },
    support: {
      whatsappTitle: "Direct WhatsApp",
      whatsappDesc: "Speak directly with administration.",
      discordTitle: "Official Discord",
      discordDesc: "Tickets, community, and announcements."
    },
    footer: {
      rights: "All rights reserved.",
      disclaimer: "Not affiliated with Mojang Studios."
    }
  },
  es: {
    nav: { home: "Inicio", commands: "Comandos", rules: "Reglas", store: "Tienda", support: "Soporte" },
    home: {
      javaIp: "Java IP",
      bedrockIp: "Bedrock IP",
      serverStatus: "Estado del Reino",
      online: "EN LÍNEA",
      offline: "DESCONECTADO",
      activePlayers: "aventureros activos",
      playersOnlineTitle: "Aventureros en Línea",
      noPlayers: "Ningún aventurero en el campo de batalla en este momento...",
      loreTitle: "Lore del Mundo",
      loreText: "El continente de Aeldrynn está dividido en 5 grandes regiones, cada una con su propia historia, ciudades, conflictos y criaturas. En el centro de todo, un poder antiguo despierta, llamando a héroes de todas las eras para defender lo que queda de la luz... o sumergir el mundo en la oscuridad eterna.",
      discordBtn: "Discord",
      whatsappBtn: "WhatsApp"
    },
    commands: {
      searchPlaceholder: "Buscar encantamiento...",
      title: "Comandos del Servidor",
      desc: "Lista de encantamientos verbales disponibles."
    },
    rules: {
      title: "Código de Conducta",
      subtitle: "La violación de estas leyes puede resultar en exilio permanente."
    },
    store: {
      buy: "Comprar",
      cartTitle: "Tu Mochila",
      emptyCart: "Tu mochila está vacía.",
      total: "Total",
      checkout: "Finalizar Pedido",
      added: "añadido al carrito!",
      cartEmptyError: "¡El carrito está vacío!"
    },
    support: {
      whatsappTitle: "WhatsApp Directo",
      whatsappDesc: "Habla directamente con la administración.",
      discordTitle: "Discord Oficial",
      discordDesc: "Tickets, comunidad y anuncios."
    },
    footer: {
      rights: "Todos los derechos reservados.",
      disclaimer: "No afiliado a Mojang Studios."
    }
  }
};

// --- Data Functions ---
const getCommands = (lang: Language): Command[] => {
  const list = [
    { name: '/register', desc_pt: 'Registra sua conta.', desc_en: 'Register your account.', desc_es: 'Registra tu cuenta.' },
    { name: '/login', desc_pt: 'Faz login na sua conta.', desc_en: 'Login to your account.', desc_es: 'Inicia sesión en tu cuenta.' },
    { name: '/kit', desc_pt: 'Abre menu de kits.', desc_en: 'Opens kit menu.', desc_es: 'Abre el menú de kits.' },
    { name: '/spawn', desc_pt: 'Ir para o spawn.', desc_en: 'Go to spawn.', desc_es: 'Ir al spawn.' },
    { name: '/rtp', desc_pt: 'Teleporte aleatório.', desc_en: 'Random teleport.', desc_es: 'Teletransporte aleatorio.' },
    { name: '/home', desc_pt: 'Teleporte para casa.', desc_en: 'Teleport home.', desc_es: 'Teletransporte a casa.' },
    { name: '/sethome', desc_pt: 'Define sua casa.', desc_en: 'Set your home.', desc_es: 'Establece tu casa.' },
    { name: '/g', desc_pt: 'Chat global.', desc_en: 'Global chat.', desc_es: 'Chat global.' },
    { name: '/tell', desc_pt: 'Mensagem privada.', desc_en: 'Private message.', desc_es: 'Mensaje privado.' },
    { name: '/balance', desc_pt: 'Ver saldo.', desc_en: 'Check balance.', desc_es: 'Ver saldo.' },
    { name: '/clan', desc_pt: 'Sistema de clãs.', desc_en: 'Clan system.', desc_es: 'Sistema de clanes.' },
    { name: '/level', desc_pt: 'Ver nível.', desc_en: 'Check level.', desc_es: 'Ver nivel.' }
  ];
  return list.map(c => ({
    name: c.name,
    desc: lang === 'pt' ? c.desc_pt : lang === 'en' ? c.desc_en : c.desc_es
  }));
};

const getStoreItems = (lang: Language): StoreItem[] => {
  // Simplification for brevity, real app would have full translations
  return [
    { 
      id: 'vip_future', name: 'VIP Cavaleiro', price: 50.00, category: 'vip',
      description: lang === 'pt' ? 'Kit supremo para guerreiros.' : (lang === 'en' ? 'Supreme kit for warriors.' : 'Kit supremo para guerreros.')
    },
    { id: 'pass_1m', name: lang === 'pt' ? 'Passe 1 Mês' : (lang === 'en' ? '1 Month Pass' : 'Pase 1 Mes'), price: 30.00, category: 'pass', description: 'Premium + Bronze Tag.' },
    { id: 'pass_1y', name: lang === 'pt' ? 'Passe 1 Ano' : (lang === 'en' ? '1 Year Pass' : 'Pase 1 Año'), price: 360.00, category: 'pass', description: 'Premium + Legend Tag.' },
    { id: 'unban', name: 'Unban', price: 15.00, category: 'unban', description: lang === 'pt' ? 'Recuperar acesso.' : 'Recover access.' },
    { id: 'coins_100', name: '100 Coins', price: 5.00, category: 'coins', description: 'Currency.' },
    { id: 'coins_5000', name: '5000 Coins', price: 345.00, category: 'coins', description: 'Currency.' },
  ];
};

const getRules = (lang: Language) => {
  if (lang === 'en') return [
    { title: "Respect", desc: "No insults, spam, or harassment." },
    { title: "Fair Play", desc: "No hacks, cheats, or X-Ray." },
    { title: "PvP Rules", desc: "PvP only at night." },
    { title: "Bugs", desc: "Do not abuse bugs. Report them." }
  ];
  if (lang === 'es') return [
    { title: "Respeto", desc: "Sin insultos, spam o acoso." },
    { title: "Juego Limpio", desc: "Sin hacks, trucos o X-Ray." },
    { title: "Reglas PvP", desc: "PvP solo por la noche." },
    { title: "Bugs", desc: "No abusar de bugs. Repórtalos." }
  ];
  return [
    { title: "Respeito Mútuo", desc: "Proibido ofensas, flood, spam, assédio ou preconceito." },
    { title: "Jogo Limpo", desc: "Estritamente proibido uso de hacks, cheats ou X-Ray." },
    { title: "Regras de PvP", desc: "PvP apenas à noite. Respeite as áreas seguras." },
    { title: "Bugs", desc: "Proibido abusar de bugs. Reporte à staff para recompensas." },
  ];
};

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<'home' | 'commands' | 'rules' | 'store' | 'support'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('pt');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Theme init
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) setTheme(savedTheme);
    
    // Server polling
    const fetchStatus = async () => {
      try {
        const res = await fetch("https://api.mcsrvstat.us/2/sd-br7.blazebr.com:25575");
        const data = await res.json();
        setServerStatus({
          online: data.online,
          players: {
            online: data.players?.online || 0,
            max: data.players?.max || 0,
            list: data.players?.list || []
          }
        });
      } catch (e) {
        console.error("Failed to fetch server status", e);
        setServerStatus({ online: false, players: { online: 0, max: 0 } });
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Helpers ---
  const t = (section: keyof typeof TRANSLATIONS.pt, key: string) => {
    // @ts-ignore
    return TRANSLATIONS[lang][section][key] || key;
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (item: StoreItem) => {
    setCart([...cart, { ...item, cartId: Date.now().toString() }]);
    showNotification(`${item.name} ${t('store', 'added')}`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(i => i.cartId !== cartId));
  };

  const checkout = () => {
    if (cart.length === 0) {
      showNotification(t('store', 'cartEmptyError'), 'error');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const text = `Olá! Gostaria de comprar:\n${cart.map(i => `- ${i.name} (R$${i.price})`).join('\n')}\nTotal: R$${total.toFixed(2)}`;
    window.open(`https://wa.me/5514998199235?text=${encodeURIComponent(text)}`, '_blank');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  
  const cycleLang = () => {
    const next: Record<Language, Language> = { 'pt': 'en', 'en': 'es', 'es': 'pt' };
    setLang(next[lang]);
    showNotification(`Language: ${next[lang].toUpperCase()}`);
  };

  // --- UI Components ---
  const NavLink = ({ target, label, icon: Icon }: { target: typeof view, label: string, icon: any }) => (
    <button 
      onClick={() => { setView(target); setIsMobileMenuOpen(false); window.scrollTo(0,0); }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border shadow-sm ${
        view === target 
        ? 'dark:bg-accent/20 dark:border-accent bg-[#c99a5b] border-[#a87c4a] text-[#1a1612] dark:text-accent font-bold transform scale-105' 
        : 'dark:bg-black/20 dark:border-transparent bg-[#dccbb1] border-[#c0b090] text-[#5c401f] dark:text-medieval-text hover:bg-[#c99a5b]/20 hover:border-[#c99a5b]/50'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen relative flex flex-col font-cinzel">
      {/* Background with overlay */}
      <div className="fixed inset-0 -z-20 bg-[url('/fantasy.png')] bg-cover bg-center bg-fixed backdrop-blur-sm" />
      <div className={`fixed inset-0 -z-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-black/80' : 'bg-[#e6d0a8]/80'}`} />

      {/* Notifications */}
      {notification && (
        <div className={`fixed top-5 right-5 z-[100] px-6 py-4 rounded-lg shadow-xl animate-fade-in-up flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <ShieldAlert size={20} />}
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 pb-4 pt-6 px-4 transition-colors duration-300 ${
        theme === 'dark' 
        ? 'bg-gradient-to-b from-black/90 to-transparent' 
        : 'bg-[#e6d0a8] border-b-2 border-[#8c6b3f]/30 shadow-md'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
             <h1 className="font-medieval text-4xl md:text-5xl text-accent dark:text-accent text-accent-contrast drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] animate-glow">
              ReinadoRPG
            </h1>
            <button className="md:hidden text-accent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

          <nav className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto animate-fade-in-up md:animate-none`}>
            <NavLink target="home" label={t('nav', 'home')} icon={Sword} />
            <NavLink target="commands" label={t('nav', 'commands')} icon={MonitorSmartphone} />
            <NavLink target="rules" label={t('nav', 'rules')} icon={Scroll} />
            <NavLink target="store" label={t('nav', 'store')} icon={ShoppingBag} />
            <NavLink target="support" label={t('nav', 'support')} icon={HelpCircle} />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 mb-20">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="glass-panel p-6 md:p-8 rounded-xl border-t-4 border-accent relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-dark"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                
                <div className={`p-4 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-black/30 border-accent/20 hover:border-accent/50' : 'bg-[#dccbb1] border-[#8c6b3f]/30 hover:border-[#8c6b3f]'}`}>
                  <div className="dark:text-medieval-muted text-medieval-mutedDark text-sm mb-1">{t('home', 'javaIp')}</div>
                  <div className="text-xl md:text-2xl font-bold text-accent font-medieval tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform" 
                       onClick={() => {navigator.clipboard.writeText("reinadorpg.blazebr.com:25575"); showNotification("IP copiado!")}}>
                    reinadorpg.blazebr.com <Copy size={16} className="opacity-50" />
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors flex flex-col justify-center ${theme === 'dark' ? 'bg-black/30 border-accent/20 hover:border-accent/50' : 'bg-[#dccbb1] border-[#8c6b3f]/30 hover:border-[#8c6b3f]'}`}>
                  <div className="dark:text-medieval-muted text-medieval-mutedDark text-sm">{t('home', 'serverStatus')}</div>
                  <div className={`text-2xl font-bold font-medieval ${serverStatus?.online ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                    {serverStatus ? (serverStatus.online ? t('home', 'online') : t('home', 'offline')) : '...'}
                  </div>
                  <div className="text-sm dark:text-medieval-muted text-medieval-mutedDark">
                    {serverStatus?.players.online || 0} {t('home', 'activePlayers')}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-black/30 border-accent/20 hover:border-accent/50' : 'bg-[#dccbb1] border-[#8c6b3f]/30 hover:border-[#8c6b3f]'}`}>
                  <div className="dark:text-medieval-muted text-medieval-mutedDark text-sm mb-1">{t('home', 'bedrockIp')}</div>
                  <div className="text-sm md:text-lg font-bold text-accent font-medieval tracking-wide flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform overflow-hidden truncate"
                       onClick={() => {navigator.clipboard.writeText("reinadorpgmobile.blazebr.com"); showNotification("IP copiado!")}}>
                    <span className="truncate">reinadorpgmobile.blazebr.com</span> <Copy size={16} className="opacity-50 flex-shrink-0" />
                  </div>
                </div>

              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                 <a href="https://discord.gg/5jvwssAV9t" target="_blank" rel="noreferrer" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center gap-2">
                   <MessageCircle size={20} /> {t('home', 'discordBtn')}
                 </a>
                 <a href="https://chat.whatsapp.com/EyBu39XdT7LEYKy4OXibOp" target="_blank" rel="noreferrer" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center gap-2">
                   <MessageCircle size={20} /> {t('home', 'whatsappBtn')}
                 </a>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h2 className="text-2xl font-medieval text-accent dark:text-accent text-accent-contrast border-b border-accent/30 pb-2 mb-4">{t('home', 'playersOnlineTitle')}</h2>
              {serverStatus?.players.list && serverStatus.players.list.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {serverStatus.players.list.map((player, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-black/20 border-accent/10' : 'bg-[#dccbb1] border-[#8c6b3f]/20'}`}>
                       <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs border border-accent/50">
                         {player.charAt(0).toUpperCase()}
                       </div>
                       <span className="text-sm">{player}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dark:text-medieval-muted text-medieval-mutedDark italic">{t('home', 'noPlayers')}</p>
              )}
            </div>

            <div className="glass-panel p-6 rounded-xl">
                <h2 className="text-2xl font-medieval text-accent dark:text-accent text-accent-contrast border-b border-accent/30 pb-2 mb-4">{t('home', 'loreTitle')}</h2>
                <p className="leading-relaxed dark:text-medieval-muted text-medieval-mutedDark">
                   {t('home', 'loreText')}
                </p>
            </div>
          </div>
        )}

        {/* VIEW: COMMANDS */}
        {view === 'commands' && (
           <div className="animate-fade-in-up">
              <div className="glass-panel p-6 rounded-xl mb-6">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={t('commands', 'searchPlaceholder')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full border rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-accent ${theme === 'dark' ? 'bg-black/30 border-accent/30 text-medieval-text' : 'bg-[#dccbb1] border-[#8c6b3f]/30 text-medieval-textDark placeholder-medieval-mutedDark/60'}`}
                    />
                    <Search className={`absolute left-4 top-3.5 opacity-70 ${theme === 'dark' ? 'text-accent' : 'text-[#8c6b3f]'}`} size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCommands(lang).filter(c => 
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((cmd, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-lg border-l-4 border-l-accent hover:transform hover:-translate-y-1 transition-transform duration-300">
                          <code className={`block font-bold mb-1 p-1 rounded w-fit ${theme === 'dark' ? 'bg-black/20 text-accent' : 'bg-[#dccbb1] text-[#3d2b15]'}`}>{cmd.name}</code>
                          <p className="text-sm dark:text-medieval-muted text-medieval-mutedDark">{cmd.desc}</p>
                      </div>
                  ))}
              </div>
           </div>
        )}

        {/* VIEW: RULES */}
        {view === 'rules' && (
           <div className="animate-fade-in-up space-y-6">
               <div className="glass-panel p-8 rounded-xl text-center">
                   <h2 className="text-3xl font-medieval text-accent dark:text-accent text-accent-contrast mb-2">{t('rules', 'title')}</h2>
                   <p className="dark:text-medieval-muted text-medieval-mutedDark">{t('rules', 'subtitle')}</p>
               </div>
               
               <div className="space-y-4">
                   {getRules(lang).map((rule, idx) => (
                       <div key={idx} className="glass-panel p-6 rounded-xl flex gap-4 items-start relative overflow-hidden">
                           <div className="absolute -left-4 -top-4 w-16 h-16 bg-accent/20 rounded-full blur-xl"></div>
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-dark-bg font-bold font-medieval text-xl shadow-lg z-10">
                               {idx + 1}
                           </div>
                           <div className="z-10">
                               <h3 className="text-xl font-bold text-accent dark:text-accent text-accent-contrast mb-1">{rule.title}</h3>
                               <p className="dark:text-medieval-muted text-medieval-mutedDark">{rule.desc}</p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
        )}

        {/* VIEW: STORE */}
        {view === 'store' && (
           <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getStoreItems(lang).map((item) => (
                      <div key={item.id} className="glass-panel rounded-xl overflow-hidden flex flex-col group border hover:border-accent transition-colors">
                          <div className="bg-gradient-to-r from-accent to-accent-dark p-4 text-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                              <h3 className="text-dark-bg font-bold font-medieval text-xl relative z-10">{item.name}</h3>
                              <div className="text-dark-darker font-bold text-lg mt-1 relative z-10">R$ {item.price.toFixed(2)}</div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                              <p className="dark:text-medieval-muted text-medieval-mutedDark mb-4 italic text-sm">{item.description}</p>
                              <div className="mt-auto">
                                  <button 
                                    onClick={() => addToCart(item)}
                                    className={`w-full py-3 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 ${
                                      theme === 'dark' 
                                      ? 'bg-black/40 hover:bg-accent hover:text-dark-bg border border-accent/30 text-medieval-text' 
                                      : 'bg-[#dccbb1] hover:bg-accent hover:text-[#1a1612] border border-[#8c6b3f]/30 text-[#3d2b15]'
                                    }`}
                                  >
                                      <ShoppingBag size={16} /> {t('store', 'buy')}
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
           </div>
        )}

        {/* VIEW: SUPPORT */}
        {view === 'support' && (
           <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6">
                <div className="glass-panel p-6 rounded-xl flex items-center justify-between hover:border-green-500/50 transition-colors cursor-pointer group" onClick={() => window.open('https://wa.me/5514998199235', '_blank')}>
                    <div>
                        <h3 className="text-xl font-bold text-accent dark:text-accent text-accent-contrast group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{t('support', 'whatsappTitle')}</h3>
                        <p className="text-sm dark:text-medieval-muted text-medieval-mutedDark">{t('support', 'whatsappDesc')}</p>
                    </div>
                    <MessageCircle size={32} className="text-green-600 dark:text-green-500" />
                </div>

                <div className="glass-panel p-6 rounded-xl flex items-center justify-between hover:border-indigo-500/50 transition-colors cursor-pointer group" onClick={() => window.open('https://discord.gg/5jvwssAV9t', '_blank')}>
                    <div>
                        <h3 className="text-xl font-bold text-accent dark:text-accent text-accent-contrast group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('support', 'discordTitle')}</h3>
                        <p className="text-sm dark:text-medieval-muted text-medieval-mutedDark">{t('support', 'discordDesc')}</p>
                    </div>
                    <MessageCircle size={32} className="text-indigo-600 dark:text-indigo-500" />
                </div>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`border-t py-8 text-center text-sm mt-auto ${theme === 'dark' ? 'bg-black/80 border-accent/20 text-medieval-muted' : 'bg-[#e6d0a8] border-[#8c6b3f]/30 text-[#5c401f]'}`}>
         <p>© 2025 ReinadoRPG. {t('footer', 'rights')}</p>
         <p className="mt-2 opacity-50">{t('footer', 'disclaimer')}</p>
      </footer>

      {/* Floating UI Elements */}
      
      {/* Cart Button & Panel */}
      <div className="fixed bottom-6 left-6 z-50">
         <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className={`p-4 backdrop-blur-md border rounded-full shadow-lg relative transition-colors ${theme === 'dark' ? 'bg-glass-panel border-accent/30 hover:bg-accent/20' : 'bg-[#e6d0a8] border-[#8c6b3f] text-[#3d2b15] hover:bg-[#dccbb1]'}`}
         >
             <ShoppingCart className={theme === 'dark' ? "text-accent" : "text-[#8c6b3f]"} />
             {cart.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce">
                     {cart.length}
                 </span>
             )}
         </button>

         {isCartOpen && (
             <div className="absolute bottom-16 left-0 w-72 glass-panel rounded-xl overflow-hidden shadow-2xl animate-fade-in-up border border-accent/40">
                 <div className={`p-3 border-b font-bold flex justify-between items-center ${theme === 'dark' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-[#dccbb1] border-[#8c6b3f]/30 text-[#3d2b15]'}`}>
                     <span>{t('store', 'cartTitle')}</span>
                     <button onClick={() => setIsCartOpen(false)}><X size={16}/></button>
                 </div>
                 <div className="max-h-60 overflow-y-auto p-2">
                     {cart.length === 0 ? (
                         <p className="text-center dark:text-medieval-muted text-medieval-mutedDark text-sm py-4">{t('store', 'emptyCart')}</p>
                     ) : (
                         cart.map((item) => (
                             <div key={item.cartId} className="flex justify-between items-center p-2 border-b border-accent/10 last:border-0 text-sm">
                                 <div>
                                     <div className="dark:text-medieval-text text-medieval-textDark truncate w-40">{item.name}</div>
                                     <div className="text-accent text-xs">R$ {item.price.toFixed(2)}</div>
                                 </div>
                                 <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                             </div>
                         ))
                     )}
                 </div>
                 <div className={`p-3 border-t ${theme === 'dark' ? 'bg-black/20 border-accent/20' : 'bg-[#dccbb1] border-[#8c6b3f]/30'}`}>
                     <div className="flex justify-between font-bold mb-3 dark:text-medieval-text text-medieval-textDark">
                         <span>{t('store', 'total')}:</span>
                         <span className="text-accent">R$ {cart.reduce((a,b) => a+b.price, 0).toFixed(2)}</span>
                     </div>
                     <button onClick={checkout} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-sm transition-colors">
                         {t('store', 'checkout')}
                     </button>
                 </div>
             </div>
         )}
      </div>

      {/* Settings (Theme & Language) - Bottom Right fixed, next to AI */}
      <div className="fixed bottom-36 right-6 z-40 flex flex-col gap-3">
          <button 
            onClick={cycleLang} 
            className={`w-12 h-12 rounded-full shadow-xl border-2 transition-all duration-300 flex items-center justify-center relative group ${
                theme === 'dark' 
                ? 'bg-black/90 border-accent text-accent hover:bg-accent hover:text-dark-bg' 
                : 'bg-[#5c401f] border-[#c99a5b] text-[#e6d0a8] hover:bg-[#c99a5b] hover:text-[#3d2b15]'
            }`}
          >
              <Languages size={22} />
              <span className="absolute right-full mr-2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">{lang.toUpperCase()}</span>
          </button>
          
          <button 
            onClick={toggleTheme} 
             className={`w-12 h-12 rounded-full shadow-xl border-2 transition-all duration-300 flex items-center justify-center relative group ${
                theme === 'dark' 
                ? 'bg-black/90 border-accent text-accent hover:bg-accent hover:text-dark-bg' 
                : 'bg-[#5c401f] border-[#c99a5b] text-[#e6d0a8] hover:bg-[#c99a5b] hover:text-[#3d2b15]'
            }`}
          >
              {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
              <span className="absolute right-full mr-2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
          </button>
      </div>

      {/* AI Assistant */}
      <AiAssistant />

    </div>
  );
};

export default App;