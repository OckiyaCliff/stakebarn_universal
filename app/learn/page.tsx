import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllCourses } from "@/lib/courses"
import { Clock, BookOpen, ArrowRight } from "lucide-react"

export default function LearnPage() {
    const courses = getAllCourses()

    const levelColors = {
        Beginner: "bg-green-500/10 text-green-500",
        Intermediate: "bg-yellow-500/10 text-yellow-500",
        Advanced: "bg-red-500/10 text-red-500",
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance">
                            Learning Center
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                            Master cryptocurrency staking with our expert-led courses. From beginner fundamentals to advanced strategies.
                        </p>
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Link
                            key={course.slug}
                            href={`/learn/${course.slug}`}
                            className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="aspect-video bg-muted overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}>
                                        {course.level}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <BookOpen className="h-3 w-3" />
                                        {course.lessons} lessons
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors mb-2">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {course.description}
                                </p>
                                <div className="flex items-center text-sm font-semibold text-primary">
                                    Start Learning <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-border p-12 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Apply What You've Learned?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Put your knowledge into practice. Start staking with StakeBarn and earn rewards on your crypto.
                    </p>
                    <Link
                        href="/auth/sign-up"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Start Staking Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
