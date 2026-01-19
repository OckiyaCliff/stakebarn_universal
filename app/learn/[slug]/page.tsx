"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getCourse, getAllCourses } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, BookOpen, CheckCircle } from "lucide-react"
import { useState } from "react"

export function generateStaticParams() {
    const courses = getAllCourses()
    return courses.map((course) => ({
        slug: course.slug,
    }))
}

export default function CoursePage({ params }: { params: { slug: string } }) {
    const course = getCourse(params.slug)
    const [activeLesson, setActiveLesson] = useState(0)
    const [completedLessons, setCompletedLessons] = useState<number[]>([])

    if (!course) {
        notFound()
    }

    const levelColors = {
        Beginner: "bg-green-500/10 text-green-500",
        Intermediate: "bg-yellow-500/10 text-yellow-500",
        Advanced: "bg-red-500/10 text-red-500",
    }

    const markComplete = () => {
        if (!completedLessons.includes(activeLesson)) {
            setCompletedLessons([...completedLessons, activeLesson])
        }
        if (activeLesson < course.content.length - 1) {
            setActiveLesson(activeLesson + 1)
        }
    }

    const progress = Math.round((completedLessons.length / course.content.length) * 100)

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Course Header */}
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <Button asChild variant="ghost" className="mb-4">
                        <Link href="/learn">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Courses
                        </Link>
                    </Button>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColors[course.level]}`}>
                                    {course.level}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {course.duration}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <BookOpen className="h-4 w-4" />
                                    {course.lessons} lessons
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-4">{course.title}</h1>
                            <p className="text-muted-foreground">{course.description}</p>
                        </div>
                        <div className="w-full lg:w-64 shrink-0">
                            <div className="rounded-lg border border-border bg-background p-4">
                                <div className="text-sm font-medium text-foreground mb-2">Your Progress</div>
                                <div className="h-2 bg-muted rounded-full mb-2">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {completedLessons.length} of {course.content.length} lessons completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content */}
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Lesson List */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <div className="sticky top-24 rounded-lg border border-border bg-card p-4">
                            <h2 className="font-semibold text-foreground mb-4">Lessons</h2>
                            <nav className="space-y-1">
                                {course.content.map((lesson, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveLesson(index)}
                                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeLesson === index
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${completedLessons.includes(index)
                                                ? "bg-green-500 text-white"
                                                : activeLesson === index
                                                    ? "bg-primary-foreground text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            }`}>
                                            {completedLessons.includes(index) ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <span className="line-clamp-1">{lesson.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <article className="rounded-lg border border-border bg-card p-8">
                            <h2 className="text-2xl font-bold text-foreground mb-6">
                                {course.content[activeLesson].title}
                            </h2>
                            <div className="prose prose-lg prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                    {course.content[activeLesson].content}
                                </div>
                            </div>

                            {/* Lesson Navigation */}
                            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                                    disabled={activeLesson === 0}
                                >
                                    Previous Lesson
                                </Button>
                                <Button onClick={markComplete}>
                                    {activeLesson === course.content.length - 1 ? "Complete Course" : "Next Lesson"}
                                </Button>
                            </div>
                        </article>

                        {/* Course Complete */}
                        {completedLessons.length === course.content.length && (
                            <div className="mt-8 rounded-lg border-2 border-primary bg-primary/10 p-8 text-center">
                                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
                                <p className="text-muted-foreground mb-6">
                                    You've completed the {course.title} course. Ready to put your knowledge into practice?
                                </p>
                                <div className="flex items-center justify-center gap-4">
                                    <Button asChild>
                                        <Link href="/auth/sign-up">Start Staking</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/learn">More Courses</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <SiteFooter />
        </div>
    )
}
