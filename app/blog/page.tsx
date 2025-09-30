import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllBlogPosts } from "@/lib/blog"
import { ArrowRight } from "lucide-react"

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">StakeBarn Blog</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            Insights, guides, and news about crypto staking and the blockchain ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={`/.jpg?height=300&width=500&query=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {post.category}
                  </span>
                  <time>{post.date}</time>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-sm font-semibold text-primary">
                  Read more <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
