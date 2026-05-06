import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getBlogPost, getAllBlogPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

export function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

/**
 * Simple markdown-to-HTML renderer for blog content.
 * Handles headings, bold, italic, lists, and paragraphs.
 */
function renderMarkdown(content: string): string {
  const lines = content.trim().split("\n")
  const htmlLines: string[] = []
  let inList = false
  let inOrderedList = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Skip empty lines — close any open list
    if (line.trim() === "") {
      if (inList) {
        htmlLines.push("</ul>")
        inList = false
      }
      if (inOrderedList) {
        htmlLines.push("</ol>")
        inOrderedList = false
      }
      continue
    }

    // Headings
    if (line.startsWith("### ")) {
      if (inList) { htmlLines.push("</ul>"); inList = false }
      if (inOrderedList) { htmlLines.push("</ol>"); inOrderedList = false }
      htmlLines.push(`<h3>${processInline(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith("## ")) {
      if (inList) { htmlLines.push("</ul>"); inList = false }
      if (inOrderedList) { htmlLines.push("</ol>"); inOrderedList = false }
      htmlLines.push(`<h2>${processInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith("# ")) {
      if (inList) { htmlLines.push("</ul>"); inList = false }
      if (inOrderedList) { htmlLines.push("</ol>"); inOrderedList = false }
      htmlLines.push(`<h1>${processInline(line.slice(2))}</h1>`)
      continue
    }

    // Unordered list items
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (inOrderedList) { htmlLines.push("</ol>"); inOrderedList = false }
      if (!inList) {
        htmlLines.push("<ul>")
        inList = true
      }
      const text = line.trim().slice(2)
      htmlLines.push(`<li>${processInline(text)}</li>`)
      continue
    }

    // Ordered list items
    const orderedMatch = line.trim().match(/^(\d+)\.\s(.*)$/)
    if (orderedMatch) {
      if (inList) { htmlLines.push("</ul>"); inList = false }
      if (!inOrderedList) {
        htmlLines.push("<ol>")
        inOrderedList = true
      }
      htmlLines.push(`<li>${processInline(orderedMatch[2])}</li>`)
      continue
    }

    // Regular paragraph
    if (inList) { htmlLines.push("</ul>"); inList = false }
    if (inOrderedList) { htmlLines.push("</ol>"); inOrderedList = false }
    htmlLines.push(`<p>${processInline(line)}</p>`)
  }

  if (inList) htmlLines.push("</ul>")
  if (inOrderedList) htmlLines.push("</ol>")

  return htmlLines.join("\n")
}

/**
 * Process inline markdown: **bold**, *italic*
 */
function processInline(text: string): string {
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  // Italic: *text*
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>")
  return text
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const renderedContent = renderMarkdown(post.content)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <Button asChild variant="ghost" className="mb-8 rounded-full">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance mb-6">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="aspect-video rounded-2xl bg-muted mb-12 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Written by</p>
              <p className="font-semibold text-foreground">{post.author}</p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/auth/sign-up">Start Staking Today</Link>
            </Button>
          </div>
        </div>
      </article>

      <SiteFooter />
    </div>
  )
}
