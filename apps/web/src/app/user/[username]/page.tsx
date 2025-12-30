import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Github,
  Globe,
  Linkedin,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Twitter,
  Users,
  Verified,
  Flag,
  UserPlus,
  Mail,
  Award,
  TrendingUp,
  BookOpen,
  Heart,
  Bookmark,
  Sparkles,
} from 'lucide-react';

import { Header } from '@/components/layout/header';
import { BentoGrid } from '@/components/post/bento-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatNumber, getInitials } from '@/lib/utils';

// Mock author data
const authors: Record<string, {
  username: string;
  fullName: string;
  avatarUrl: string;
  coverUrl?: string;
  bio: string;
  longBio: string;
  location: string;
  website?: string;
  joinedAt: string;
  isVerified: boolean;
  status?: 'open_to_work' | 'hiring' | 'mentor' | 'collab';
  company?: { name: string; role: string };
  stats: {
    followers: number;
    following: number;
    posts: number;
    karma: number;
    views: number;
    likes: number;
  };
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  skills: string[];
  achievements: Array<{ icon: string; title: string; description: string }>;
}> = {
  'johndoe': {
    username: 'johndoe',
    fullName: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=400&fit=crop',
    bio: 'Staff Engineer at Google • Building scalable systems • Open source enthusiast',
    longBio: 'I\'m a Staff Engineer at Google, working on large-scale distributed systems. Previously at Meta and Amazon. I write about system design, Go, Kubernetes, and career growth in tech.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinedAt: '2021-03-15',
    isVerified: true,
    status: 'hiring',
    company: { name: 'Google', role: 'Staff Engineer' },
    stats: { followers: 15234, following: 892, posts: 127, karma: 45670, views: 2340000, likes: 89500 },
    social: { twitter: 'johndoe', github: 'johndoe', linkedin: 'johndoe' },
    skills: ['Go', 'Kubernetes', 'System Design', 'Microservices', 'Python', 'AWS'],
    achievements: [
      { icon: '🏆', title: 'Top Contributor 2024', description: 'Top 1% of contributors' },
      { icon: '📚', title: '100+ Articles', description: 'Published 100+ articles' },
      { icon: '⭐', title: '10K Followers', description: 'Reached 10K followers' },
    ],
  },
  'sarahtech': {
    username: 'sarahtech',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&h=400&fit=crop',
    bio: 'AI Researcher @ DeepMind • PhD Stanford • Making AI accessible',
    longBio: 'AI Researcher at DeepMind, focusing on large language models and AI safety. Stanford PhD in Machine Learning. I write to make complex AI concepts accessible to everyone.',
    location: 'London, UK',
    website: 'https://sarahchen.ai',
    joinedAt: '2022-01-10',
    isVerified: true,
    status: 'open_to_work',
    company: { name: 'DeepMind', role: 'AI Researcher' },
    stats: { followers: 28450, following: 456, posts: 89, karma: 67890, views: 4560000, likes: 156000 },
    social: { twitter: 'sarahchen_ai', github: 'sarahchen', linkedin: 'sarahchen' },
    skills: ['Machine Learning', 'PyTorch', 'LLMs', 'NLP', 'Python', 'Research'],
    achievements: [
      { icon: '🎓', title: 'Stanford PhD', description: 'PhD in Machine Learning' },
      { icon: '🔬', title: 'Top Researcher', description: '50+ citations' },
      { icon: '💡', title: 'AI Pioneer', description: 'Featured in AI publications' },
    ],
  },
  'alexfounder': {
    username: 'alexfounder',
    fullName: 'Alex Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&h=400&fit=crop',
    bio: 'Serial Entrepreneur • 3x Founder • YC Alum • Angel Investor',
    longBio: 'Built and sold 2 startups, currently building my third. YC W20 alum. Angel investor in 20+ startups. I share lessons from the trenches of startup building.',
    location: 'New York, NY',
    website: 'https://alexkim.vc',
    joinedAt: '2020-08-22',
    isVerified: true,
    status: 'mentor',
    company: { name: 'Stealth Startup', role: 'Founder & CEO' },
    stats: { followers: 42300, following: 1234, posts: 203, karma: 89450, views: 8900000, likes: 234000 },
    social: { twitter: 'alexkimvc', linkedin: 'alexkimvc' },
    skills: ['Startups', 'Fundraising', 'Leadership', 'Product', 'Growth', 'Strategy'],
    achievements: [
      { icon: '🚀', title: 'YC Alum', description: 'Y Combinator W20' },
      { icon: '💰', title: '$50M+ Raised', description: 'Across all ventures' },
      { icon: '🤝', title: 'Top Mentor', description: '100+ founders mentored' },
    ],
  },
  'expertdev': {
    username: 'expertdev',
    fullName: 'Michael Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=400&fit=crop',
    bio: 'Principal Engineer at Meta • System Design Expert • Tech Educator',
    longBio: 'Principal Engineer at Meta with 12+ years of experience. I specialize in distributed systems and help engineers prepare for technical interviews at top companies.',
    location: 'Seattle, WA',
    website: 'https://michaelchen.dev',
    joinedAt: '2020-06-15',
    isVerified: true,
    status: 'hiring',
    company: { name: 'Meta', role: 'Principal Engineer' },
    stats: { followers: 34500, following: 567, posts: 156, karma: 67800, views: 5670000, likes: 189000 },
    social: { twitter: 'michaelchen_dev', github: 'michaelchen', linkedin: 'michaelchendev' },
    skills: ['System Design', 'Distributed Systems', 'Java', 'Python', 'AWS', 'Interviewing'],
    achievements: [
      { icon: '🎯', title: 'Interview Expert', description: 'Helped 500+ engineers' },
      { icon: '📖', title: 'Course Creator', description: 'System Design Masterclass' },
      { icon: '🏅', title: 'Top Voice', description: 'LinkedIn Top Voice 2024' },
    ],
  },
  'seniordev': {
    username: 'seniordev',
    fullName: 'Sarah Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1600&h=400&fit=crop',
    bio: 'Senior Software Engineer at Stripe • Full-Stack Developer • Writer',
    longBio: 'Senior Software Engineer at Stripe, building payment infrastructure that powers millions of businesses. I write about web development, best practices, and engineering culture.',
    location: 'Austin, TX',
    website: 'https://sarahjohnson.io',
    joinedAt: '2021-02-20',
    isVerified: true,
    company: { name: 'Stripe', role: 'Senior Software Engineer' },
    stats: { followers: 18900, following: 345, posts: 89, karma: 34500, views: 2890000, likes: 98000 },
    social: { twitter: 'sarahj_dev', github: 'sarahjohnson', linkedin: 'sarahjohnsondev' },
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS'],
    achievements: [
      { icon: '💳', title: 'Payments Expert', description: 'Building at scale' },
      { icon: '✍️', title: 'Prolific Writer', description: '50+ technical articles' },
      { icon: '🌟', title: 'Rising Star', description: 'Fast-growing author' },
    ],
  },
  'builder': {
    username: 'builder',
    fullName: 'David Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&h=400&fit=crop',
    bio: 'DevOps Lead at Netflix • Kubernetes Expert • Cloud Native Advocate',
    longBio: 'DevOps Lead at Netflix, managing infrastructure that serves 200M+ subscribers. Kubernetes contributor and cloud native advocate. I share real-world DevOps insights.',
    location: 'Los Angeles, CA',
    website: 'https://davidkim.cloud',
    joinedAt: '2019-11-10',
    isVerified: true,
    status: 'mentor',
    company: { name: 'Netflix', role: 'DevOps Lead' },
    stats: { followers: 28700, following: 234, posts: 134, karma: 56700, views: 4560000, likes: 145000 },
    social: { twitter: 'davidkim_devops', github: 'davidkim', linkedin: 'davidkimdevops' },
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'GCP', 'CI/CD'],
    achievements: [
      { icon: '☸️', title: 'K8s Contributor', description: 'Kubernetes contributor' },
      { icon: '🎬', title: 'Netflix Scale', description: 'Managing 200M+ users infra' },
      { icon: '📚', title: 'Author', description: 'DevOps Handbook contributor' },
    ],
  },
  'rustacean': {
    username: 'rustacean',
    fullName: 'Mike Brown',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1600&h=400&fit=crop',
    bio: 'Rust Developer at Cloudflare • Systems Programmer • Performance Enthusiast',
    longBio: 'Rust developer at Cloudflare, building high-performance edge computing solutions. I help developers transition from high-level languages to systems programming.',
    location: 'Portland, OR',
    joinedAt: '2022-03-05',
    isVerified: false,
    company: { name: 'Cloudflare', role: 'Systems Engineer' },
    stats: { followers: 12300, following: 189, posts: 67, karma: 23400, views: 1890000, likes: 67000 },
    social: { twitter: 'rustacean_mike', github: 'mikebrown' },
    skills: ['Rust', 'C++', 'WebAssembly', 'Performance', 'Systems Programming', 'Networking'],
    achievements: [
      { icon: '🦀', title: 'Rust Expert', description: 'Crates.io contributor' },
      { icon: '⚡', title: 'Performance Pro', description: 'Optimization specialist' },
      { icon: '🌐', title: 'Edge Computing', description: 'Building at the edge' },
    ],
  },
  'reactdev': {
    username: 'reactdev',
    fullName: 'Emma Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1600&h=400&fit=crop',
    bio: 'React Core Team • Next.js Contributor • Frontend Architect',
    longBio: 'Member of the React core team at Meta. I work on React Server Components and help shape the future of frontend development. Speaker and educator.',
    location: 'Boston, MA',
    website: 'https://emmawilson.dev',
    joinedAt: '2020-01-15',
    isVerified: true,
    status: 'collab',
    company: { name: 'Meta', role: 'React Core Team' },
    stats: { followers: 56700, following: 890, posts: 178, karma: 89000, views: 8900000, likes: 345000 },
    social: { twitter: 'emmawilson_react', github: 'emmawilson', linkedin: 'emmawilsondev' },
    skills: ['React', 'Next.js', 'TypeScript', 'RSC', 'Frontend Architecture', 'Performance'],
    achievements: [
      { icon: '⚛️', title: 'React Core', description: 'React core team member' },
      { icon: '🎤', title: 'Speaker', description: 'ReactConf, Next.js Conf' },
      { icon: '📘', title: 'Educator', description: 'React Patterns course' },
    ],
  },
  'mlexpert': {
    username: 'mlexpert',
    fullName: 'Lisa Zhang',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=400&fit=crop',
    bio: 'ML Engineer at OpenAI • PhD Berkeley • MLOps Specialist',
    longBio: 'ML Engineer at OpenAI working on production ML systems. Berkeley PhD in Machine Learning. I bridge the gap between research and production ML.',
    location: 'San Francisco, CA',
    website: 'https://lisazhang.ai',
    joinedAt: '2021-06-01',
    isVerified: true,
    status: 'open_to_work',
    company: { name: 'OpenAI', role: 'ML Engineer' },
    stats: { followers: 45600, following: 567, posts: 112, karma: 78900, views: 6780000, likes: 234000 },
    social: { twitter: 'lisazhang_ml', github: 'lisazhang', linkedin: 'lisazhangml' },
    skills: ['PyTorch', 'TensorFlow', 'MLOps', 'LLMs', 'Python', 'Kubernetes'],
    achievements: [
      { icon: '🤖', title: 'OpenAI', description: 'Building AGI' },
      { icon: '🎓', title: 'Berkeley PhD', description: 'ML research background' },
      { icon: '🔧', title: 'MLOps Pioneer', description: 'Production ML expert' },
    ],
  },
};

const generateAuthorPosts = (username: string) => [
  {
    id: '1',
    slug: 'lessons-from-scaling-to-1m-users',
    title: 'Lessons from Scaling to 1M Users: What Nobody Tells You',
    excerpt: 'The real challenges of scaling a product to millions of users.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    readingTime: 18, clapsCount: 4520, commentsCount: 156, publishedAt: '2025-01-15T10:00:00Z', format: 'deep_dive',
    author: { username, fullName: authors[username]?.fullName || 'Unknown', avatarUrl: authors[username]?.avatarUrl, status: authors[username]?.status },
    tags: [{ name: 'scaling', slug: 'scaling' }, { name: 'architecture', slug: 'architecture' }],
  },
  {
    id: '2',
    slug: 'my-journey-from-junior-to-staff',
    title: 'My Journey from Junior to Staff Engineer in 5 Years',
    excerpt: 'A detailed breakdown of how I progressed through my engineering career.',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop',
    readingTime: 15, clapsCount: 3200, commentsCount: 89, publishedAt: '2025-01-12T14:00:00Z', format: 'case_study',
    author: { username, fullName: authors[username]?.fullName || 'Unknown', avatarUrl: authors[username]?.avatarUrl, status: authors[username]?.status },
    tags: [{ name: 'career', slug: 'career' }, { name: 'growth', slug: 'growth' }],
  },
  {
    id: '3',
    slug: 'building-high-performance-go-services',
    title: 'Building High-Performance Go Services: A Complete Guide',
    excerpt: 'Everything you need to know about writing performant Go microservices.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    readingTime: 22, clapsCount: 2890, commentsCount: 67, publishedAt: '2025-01-10T09:00:00Z', format: 'tutorial',
    author: { username, fullName: authors[username]?.fullName || 'Unknown', avatarUrl: authors[username]?.avatarUrl, status: authors[username]?.status },
    tags: [{ name: 'golang', slug: 'golang' }, { name: 'performance', slug: 'performance' }],
  },
  {
    id: '4',
    slug: 'system-design-interview-prep',
    title: 'How I Prepared for System Design Interviews at FAANG',
    excerpt: 'My preparation strategy and resources for acing system design interviews.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    readingTime: 16, clapsCount: 5670, commentsCount: 234, publishedAt: '2025-01-08T11:00:00Z', format: 'deep_dive',
    author: { username, fullName: authors[username]?.fullName || 'Unknown', avatarUrl: authors[username]?.avatarUrl, status: authors[username]?.status },
    tags: [{ name: 'interviews', slug: 'interviews' }, { name: 'system-design', slug: 'system-design' }],
  },
  {
    id: '5',
    slug: 'kubernetes-production-lessons',
    title: 'Kubernetes in Production: Lessons Learned the Hard Way',
    excerpt: 'Real-world lessons from running Kubernetes at scale.',
    coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    readingTime: 14, clapsCount: 1890, commentsCount: 45, publishedAt: '2025-01-05T15:00:00Z', format: 'case_study',
    author: { username, fullName: authors[username]?.fullName || 'Unknown', avatarUrl: authors[username]?.avatarUrl, status: authors[username]?.status },
    tags: [{ name: 'kubernetes', slug: 'kubernetes' }, { name: 'devops', slug: 'devops' }],
  },
];

const getSimilarAuthors = (currentUsername: string) => Object.values(authors).filter((a) => a.username !== currentUsername).slice(0, 3);

const statusLabels: Record<string, { label: string; color: string }> = {
  open_to_work: { label: 'Open to Work', color: 'bg-green-500' },
  hiring: { label: 'Hiring', color: 'bg-purple-500' },
  mentor: { label: 'Mentor', color: 'bg-orange-500' },
  collab: { label: 'Open to Collab', color: 'bg-blue-500' },
};

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function AuthorPage({ params }: PageProps) {
  const { username } = await params;
  const author = authors[username];
  if (!author) notFound();

  const posts = generateAuthorPosts(username);
  const similarAuthors = getSimilarAuthors(username);
  const statusInfo = author.status ? statusLabels[author.status] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Cover */}
        <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
          {author.coverUrl && <img src={author.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Profile Header */}
        <section className="relative container mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24 mb-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              <div className="relative">
                <Avatar className={cn('h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl', author.status && 'ring-4 ring-offset-4 ring-offset-background', author.status === 'open_to_work' && 'ring-green-500', author.status === 'hiring' && 'ring-purple-500', author.status === 'mentor' && 'ring-orange-500', author.status === 'collab' && 'ring-blue-500')}>
                  <AvatarImage src={author.avatarUrl} alt={author.fullName} />
                  <AvatarFallback className="text-4xl">{getInitials(author.fullName)}</AvatarFallback>
                </Avatar>
                {statusInfo && <div className={cn('absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap', statusInfo.color)}>{statusInfo.label}</div>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{author.fullName}</h1>
                  {author.isVerified && <Badge className="w-fit bg-blue-500 hover:bg-blue-600"><Verified className="h-3 w-3 mr-1" />Verified</Badge>}
                </div>
                <p className="text-lg text-muted-foreground mb-3">@{author.username}</p>
                <p className="text-lg mb-4 max-w-2xl">{author.bio}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {author.company && <div className="flex items-center gap-1.5"><Award className="h-4 w-4" /><span>{author.company.role} at <strong className="text-foreground">{author.company.name}</strong></span></div>}
                  {author.location && <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{author.location}</span></div>}
                  {author.website && <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><Globe className="h-4 w-4" /><span>{author.website.replace('https://', '')}</span></a>}
                  <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>Joined {new Date(author.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button size="lg" className="shadow-lg shadow-primary/25"><UserPlus className="h-4 w-4 mr-2" />Follow</Button>
                <Button size="lg" variant="outline"><Mail className="h-4 w-4 mr-2" />Message</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="outline" className="h-11 w-11"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Share2 className="h-4 w-4 mr-2" />Share Profile</DropdownMenuItem>
                    <DropdownMenuItem><Bookmark className="h-4 w-4 mr-2" />Save to List</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive"><Flag className="h-4 w-4 mr-2" />Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t">
              <div className="flex items-center gap-2"><div className="text-2xl font-bold">{formatNumber(author.stats.followers)}</div><div className="text-muted-foreground">Followers</div></div>
              <div className="flex items-center gap-2"><div className="text-2xl font-bold">{formatNumber(author.stats.following)}</div><div className="text-muted-foreground">Following</div></div>
              <div className="flex items-center gap-2"><div className="text-2xl font-bold">{author.stats.posts}</div><div className="text-muted-foreground">Posts</div></div>
              <div className="flex items-center gap-2"><div className="text-2xl font-bold text-primary">{formatNumber(author.stats.karma)}</div><div className="text-muted-foreground">Karma</div></div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /><div className="text-2xl font-bold">{formatNumber(author.stats.views)}</div><div className="text-muted-foreground">Views</div></div>
              <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-red-500" /><div className="text-2xl font-bold">{formatNumber(author.stats.likes)}</div><div className="text-muted-foreground">Likes</div></div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {author.social.twitter && <a href={`https://twitter.com/${author.social.twitter}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Twitter className="h-5 w-5" /></a>}
              {author.social.github && <a href={`https://github.com/${author.social.github}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Github className="h-5 w-5" /></a>}
              {author.social.linkedin && <a href={`https://linkedin.com/in/${author.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>}
            </div>
          </div>
        </section>

        <Separator />

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_320px] gap-12">
              <div>
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                  <Button variant="secondary" size="sm"><BookOpen className="h-4 w-4 mr-2" />Posts ({author.stats.posts})</Button>
                  <Button variant="ghost" size="sm"><Sparkles className="h-4 w-4 mr-2" />Series</Button>
                  <Button variant="ghost" size="sm"><MessageCircle className="h-4 w-4 mr-2" />Discussions</Button>
                  <Button variant="ghost" size="sm"><Bookmark className="h-4 w-4 mr-2" />Reading List</Button>
                </div>
                <BentoGrid posts={posts} />
                <div className="text-center mt-12"><Button variant="outline" size="lg" className="min-w-[200px]">Load More Posts</Button></div>
              </div>

              <aside className="space-y-8">
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-4">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{author.longBio}</p>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.skills.map((skill) => (
                      <Link key={skill} href={`/tag/${skill.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                        {skill}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-4">Achievements</h3>
                  <div className="space-y-4">
                    {author.achievements.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">{a.icon}</div>
                        <div>
                          <p className="font-medium">{a.title}</p>
                          <p className="text-sm text-muted-foreground">{a.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Similar Authors
                  </h3>
                  <div className="space-y-4">
                    {similarAuthors.map((sa) => (
                      <Link key={sa.username} href={`/user/${sa.username}`} className="flex items-center gap-3 group">
                        <Avatar className="h-11 w-11" status={sa.status}>
                          <AvatarImage src={sa.avatarUrl} alt={sa.fullName} />
                          <AvatarFallback>{getInitials(sa.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">{sa.fullName}</p>
                          <p className="text-sm text-muted-foreground truncate">{sa.bio.split('•')[0].trim()}</p>
                        </div>
                        <Button variant="outline" size="sm">Follow</Button>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-6">
                  <h3 className="font-semibold mb-2">Connect with {author.fullName.split(' ')[0]}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Get personalized insights and exclusive content by following.</p>
                  <Button className="w-full shadow-lg shadow-primary/25">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow {author.fullName.split(' ')[0]}
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const author = authors[username];
  if (!author) return { title: 'Author Not Found' };
  return { title: `${author.fullName} (@${author.username}) - ABS Platform`, description: author.bio };
}

export function generateStaticParams() {
  return Object.keys(authors).map((username) => ({ username }));
}
