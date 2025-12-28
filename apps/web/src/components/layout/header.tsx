'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  ChevronDown,
  Code2,
  Command,
  Cpu,
  Flame,
  Globe,
  GraduationCap,
  Hash,
  Layers,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  PenLine,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Navigation categories
const categories = [
  {
    title: 'Engineering',
    href: '/category/engineering',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    description: 'Software development & architecture',
    subcategories: [
      { title: 'Web Development', href: '/tag/webdev', icon: Globe },
      { title: 'Backend', href: '/tag/backend', icon: Layers },
      { title: 'DevOps & Cloud', href: '/tag/devops', icon: Settings },
      { title: 'System Design', href: '/tag/system-design', icon: LayoutGrid },
      { title: 'Mobile Dev', href: '/tag/mobile', icon: Cpu },
    ],
  },
  {
    title: 'AI & ML',
    href: '/category/artificial-intelligence',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    description: 'Artificial intelligence & data science',
    subcategories: [
      { title: 'Machine Learning', href: '/tag/ml', icon: Cpu },
      { title: 'Deep Learning', href: '/tag/deep-learning', icon: Zap },
      { title: 'LLMs & ChatGPT', href: '/tag/llm', icon: Sparkles },
      { title: 'Computer Vision', href: '/tag/cv', icon: LayoutGrid },
      { title: 'Data Science', href: '/tag/data-science', icon: TrendingUp },
    ],
  },
  {
    title: 'Startups',
    href: '/category/startups-venture',
    icon: Rocket,
    color: 'from-orange-500 to-red-500',
    description: 'Entrepreneurship & venture',
    subcategories: [
      { title: 'Fundraising', href: '/tag/fundraising', icon: TrendingUp },
      { title: 'Growth Hacking', href: '/tag/growth', icon: Flame },
      { title: 'Product-Market Fit', href: '/tag/pmf', icon: Users },
      { title: 'Venture Capital', href: '/tag/vc', icon: Briefcase },
    ],
  },
  {
    title: 'Product',
    href: '/category/product-design',
    icon: Layers,
    color: 'from-green-500 to-emerald-500',
    description: 'Product management & UX',
    subcategories: [
      { title: 'Product Strategy', href: '/tag/product-strategy', icon: LayoutGrid },
      { title: 'UX Design', href: '/tag/ux', icon: Sparkles },
      { title: 'User Research', href: '/tag/user-research', icon: Users },
      { title: 'Design Systems', href: '/tag/design-systems', icon: Layers },
    ],
  },
  {
    title: 'Career',
    href: '/category/career-growth',
    icon: GraduationCap,
    color: 'from-amber-500 to-yellow-500',
    description: 'Professional development',
    subcategories: [
      { title: 'Interviews', href: '/tag/interviews', icon: Users },
      { title: 'Leadership', href: '/tag/leadership', icon: TrendingUp },
      { title: 'Remote Work', href: '/tag/remote', icon: Globe },
      { title: 'Salary Guide', href: '/tag/salary', icon: Briefcase },
    ],
  },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [currentLang, setCurrentLang] = React.useState(languages[0]);
  const { theme, setTheme } = useTheme();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = false;
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    karma: 1520,
  };

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        console.log('Open search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveCategory(null), 150);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-b' : 'bg-background'
      )}
    >
      {/* Main Nav */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all group-hover:scale-105">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ABS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-muted/50 rounded-full p-1">
                {categories.map((category) => (
                  <div
                    key={category.title}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.title)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={category.href}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
                        activeCategory === category.title
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <category.icon className="h-4 w-4" />
                      <span>{category.title}</span>
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 transition-transform',
                          activeCategory === category.title && 'rotate-180'
                        )}
                      />
                    </Link>

                    {/* Mega Dropdown */}
                    {activeCategory === category.title && (
                      <div
                        className="absolute top-full left-0 mt-2 w-72 p-3 bg-popover rounded-xl border shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
                        onMouseEnter={() => handleMouseEnter(category.title)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r opacity-90 mb-2" style={{
                          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        }}>
                          <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center', category.color)}>
                            <category.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{category.title}</h3>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="space-y-1">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group/item"
                            >
                              <div className="h-8 w-8 rounded-lg bg-muted group-hover/item:bg-primary/10 flex items-center justify-center transition-colors">
                                <sub.icon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                              </div>
                              <span className="text-sm font-medium">{sub.title}</span>
                            </Link>
                          ))}
                        </div>

                        <Separator className="my-2" />

                        <Link
                          href={category.href}
                          className="flex items-center justify-between px-3 py-2 text-sm text-primary hover:bg-accent rounded-lg transition-colors"
                        >
                          <span>View all articles</span>
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Jobs Link */}
              <Link
                href="/jobs"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                Jobs
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                  HOT
                </span>
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => console.log('Search')}
              className="hidden sm:flex items-center gap-2 h-10 px-4 bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
              <kbd className="ml-2 flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-background rounded border">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            <Button variant="ghost" size="icon" className="sm:hidden rounded-full">
              <Search className="h-5 w-5" />
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="text-lg">{currentLang.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang)}
                    className={cn('cursor-pointer rounded-lg', currentLang.code === lang.code && 'bg-accent')}
                  >
                    <span className="mr-2 text-lg">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  className="hidden sm:flex rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
                >
                  <Link href="/write">
                    <PenLine className="h-4 w-4 mr-2" />
                    Write
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 rounded-xl">
                    <DropdownMenuLabel className="flex justify-between items-center">
                      Notifications
                      <button className="text-xs text-primary hover:underline">Mark all read</button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-10 w-10 rounded-full ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || ''} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                        <Badge variant="secondary" className="mt-2 w-fit">
                          {user.karma.toLocaleString()} karma
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/bookmarks"><Bookmark className="mr-2 h-4 w-4" />Bookmarks</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/reading-list"><BookOpen className="mr-2 h-4 w-4" />Reading List</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/studio"><PenLine className="mr-2 h-4 w-4" />Creator Studio</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-lg cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex rounded-full">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 border-0"
                >
                  <Link href="/register">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center', category.color)}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{category.title}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                </Link>
              ))}

              <Link
                href="/jobs"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Jobs</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">HOT</span>
                </div>
              </Link>

              <Separator className="my-4" />

              {!isAuthenticated && (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full rounded-full">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600">
                    <Link href="/register">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
