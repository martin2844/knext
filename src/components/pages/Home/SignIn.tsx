import { Session } from 'next-auth'
import Link from 'next/link'

function SignIn({ session }: { session: Session | null }) {
    return (
        <section className="bg-slate-900 py-8 h-[150px]">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                {!session && (
                    <div className="space-y-4">
                        <p className="text-slate-300">Ready to get started?</p>
                        <Link
                            href="/api/auth/signin"
                            className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-purple-600 hover:to-pink-600 hover:shadow-xl transition-all duration-200"
                        >
                            Sign In to Continue
                        </Link>
                    </div>
                )}
                {session && (
                    <div className="space-y-4">
                        <p className="text-slate-300">Welcome back!</p>
                        <div className="inline-flex items-center rounded-md bg-slate-800 px-6 py-3 text-sm font-medium text-white">
                            Hello, {session?.user?.name}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default SignIn