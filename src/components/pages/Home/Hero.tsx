import React from 'react'
import { Button } from '@/components/ui/button'

export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-150px)] flex w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZjJkM2QiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

            <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
                <div className="w-full text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            knext
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl lg:text-2xl">
                        A powerful Next.js starter template designed to accelerate your development journey.
                        Built with modern tools and best practices.
                    </p>
                    <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-4 text-sm text-slate-400">
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 backdrop-blur">
                            Next.js 16
                        </span>
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 backdrop-blur">
                            TypeScript
                        </span>
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 backdrop-blur">
                            Tailwind CSS
                        </span>
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 backdrop-blur">
                            shadcn/ui
                        </span>
                        <span className="rounded-full bg-slate-800/50 px-3 py-1 backdrop-blur">
                            Authentication
                        </span>
                    </div>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 hover:shadow-xl transition-all duration-200"
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-slate-600 bg-slate-800/20 text-slate-300 backdrop-blur hover:bg-slate-700/30 hover:text-white"
                        >
                            View Documentation
                        </Button>
                    </div>
                </div>

                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
                    <div className="h-64 w-64 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl"></div>
                </div>
            </div>
        </section>
    )
}
