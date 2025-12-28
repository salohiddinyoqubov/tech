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
  Globe,
  GraduationCap,
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Navigation categories with subcategories
const categories = [
  {
    title: 'Engineering',
    href: '/category/engineering',
    icon: Code2,
    description: 'Software development, architecture, and best practices',
    featured: [
      { title: 'Web Development', href: '/tag/webdev', icon: Globe },
      { title: 'Backend', href: '/tag/backend', icon: Layers },
      { title: 'DevOps', href: '/tag/devops', icon: Settings },
      { title: 'System Design', href: '/tag/system-design', icon: LayoutGrid },
    ],
  },
  {
    title: 'AI & ML',
    href: '/category/artificial-intelligence',
    icon: Sparkles,
    description: 'Artificial intelligence, machine learning, and data science',
    featured: [
      { title: 'Machine Learning', href: '/tag/ml', icon: Cpu },
      { title: 'Deep Learning', href: '/tag/deep-learning', icon: Zap },
      { title: 'LLMs & GPT', href: '/tag/llm', icon: Sparkles },
      { title: 'Computer Vision', href: '/tag/cv', icon: LayoutGrid },
    ],
  },
  {
    title: 'Startups',
    href: '/category/startups-venture',
    icon: Rocket,
    description: 'Entrepreneurship, funding, and startup ecosystem',
    featured: [
      { title: 'Fundraising', href: '/tag/fundraising', icon: TrendingUp },
      { title: 'Growth', href: '/tag/growth', icon: TrendingUp },
      { title: 'Product-Market Fit', href: '/tag/pmf', icon: Users },
      { title: 'Venture Capital', href: '/tag/vc', icon: Briefcase },
    ],
  },
  {
    title: 'Product',
    href: '/category/product-design',
    icon: Layers,
    description: 'Product management, design, and user experience',
    featured: [
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
    description: 'Professional development and career advancement',
    featured: [
      { title: 'Interviews', href: '/tag/interviews', icon: Users },
      { title: 'Leadership', href: '/tag/leadership', icon: TrendingUp },
      { title: 'Remote Work', href: '/tag/remote', icon: Globe },
      { title: 'Salary & Comp', href: '/tag/salary', icon: Briefcase },
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
  const [currentLang, setCurrentLang] = React.useState(languages[0]);
  const { theme, setTheme } = useTheme();

  // Mock auth state - replace with real auth
  const isAuthenticated = false;
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    karma: 1520,
    role: 'member',
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Open search modal - TODO: implement
        console.log('Open search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b shadow-sm'
          : 'bg-background'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <span className="text-primary-foreground font-bold text-lg">A</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-xl tracking-tight">ABS</span>
                <span className="text-[10px] text-muted-foreground -mt-1 font-medium">Platform</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {categories.map((category) => (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium">
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[500px] p-4">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <category.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <Link
                              href={category.href}
                              className="font-semibold text-base hover:text-primary transition-colors"
                            >
                              {category.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <Separator className="mb-4" />
                        <div className="grid grid-cols-2 gap-2">
                          {category.featured.map((item) => (
                            <NavigationMenuLink key={item.title} asChild>
                              <Link
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors group/item"
                              >
                                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center group-hover/item:bg-primary/10 transition-colors">
                                  <item.icon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                </div>
                                <span className="text-sm font-medium">{item.title}</span>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <Link
                          href={category.href}
                          className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                        >
                          View all in {category.title}
                          <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <Link href="/jobs" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                      <Briefcase className="h-4 w-4 mr-1.5" />
                      Jobs
                      <Badge variant="success" className="ml-2 h-5 px-1.5 text-[10px]">
                        New
                      </Badge>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 h-9 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => console.log('Open search')}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm hidden md:inline">Search...</span>
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>

            <Button variant="ghost" size="icon" className="sm:hidden h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <span className="text-base">{currentLang.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang)}
                    className={cn(
                      'cursor-pointer',
                      currentLang.code === lang.code && 'bg-accent'
                    )}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

            {isAuthenticated ? (
              <>
                {/* Write Button */}
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-2">
                  <Link href="/write">
                    <PenLine className="h-4 w-4" />
                    Write
                  </Link>
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9">
                      <Bell className="h-[18px] w-[18px]" />
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                        Mark all read
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar || ''} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {user.karma.toLocaleString()} karma
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookmarks" className="cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          Bookmarks
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/reading-list" className="cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Reading List
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/studio" className="cursor-pointer">
                          <PenLine className="mr-2 h-4 w-4" />
                          Creator Studio
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="shadow-lg shadow-primary/25">
                  <Link href="/register">
                    <Sparkles className="h-4 w-4 mr-1.5 hidden sm:inline" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <category.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{category.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {category.description}
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                href="/jobs"
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Jobs</span>
                  <Badge variant="success" className="h-5 px-1.5 text-[10px]">
                    New
                  </Badge>
                </div>
              </Link>

              <Separator className="my-3" />

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" asChild className="w-full justify-center">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center">
                    <Link href="/register">
                      <Sparkles className="h-4 w-4 mr-1.5" />
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
