import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export default function PostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>

          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/explore">
                <Search className="h-4 w-4 mr-2" />
                Explore Posts
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
