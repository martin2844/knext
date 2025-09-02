import React from 'react'
import Hero from './Hero'
import SignIn from './SignIn'
import { Session } from 'next-auth'

export default function Home({ session }: { session: Session | null }) {
    return (
        <div className="min-h-screen w-full">
            <Hero />
            <SignIn session={session} />
        </div>
    )
}
