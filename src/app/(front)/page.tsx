// src/app/(front)/home/page.tsx

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/configs/site";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MovieAssistant from '../../components/MovieAssistant';

export default function Index() {
  return (
    <>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="container mx-auto flex flex-col items-center justify-center gap-4 pb-8 pt-28 text-center md:pb-12 lg:py-32"
      >
        <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
          <Badge
            aria-hidden="true"
            className="rounded-md px-3.5 py-1.5"
            variant="secondary"
          >
            <Icons.twitter className="mr-2 h-3.5 w-3.5" />
            Follow along on Twitter
          </Badge>
          <span className="sr-only">Twitter</span>
        </Link>
        <h1 className="max-w-screen-lg text-center font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          {siteConfig.name} - {siteConfig.slogan}
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Step into a world where entertainment knows no boundaries, where your
          screens come alive with an endless array of captivating stories.
        </p>
        <div className="space-x-4">
          <Link className={`${buttonVariants({ size: "lg" })}`} href="/home">
            Watch Now <ArrowRight className="ml-1 inline-block" />
          </Link>
        </div>
      </section>
      
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {siteConfig.name} offers a host of powerful features designed to
            enhance your movie-watching experience.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {/* Feature Cards */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-current">
                <path d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">Vast Movie Library</h3>
                <p className="text-sm text-muted-foreground">
                  Thousands of movies, spanning diverse genres, languages, and
                  decades.
                </p>
              </div>
            </div>
          </div>
          {/* Add more feature cards as needed */}
        </div>
      </section>

      {/* Movie Assistant Section */}
      <section className="container mx-auto py-8">
        <MovieAssistant />
      </section>
    </>
  );
}
