'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/services/supabase-client.service'

export default function LoginPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const next = searchParams.get('next') ?? '/skillbuilder'

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)
		setIsLoading(true)

		try {
			const supabase = getSupabaseBrowserClient()
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: email.trim().toLowerCase(),
				password,
			})

			if (signInError) {
				setError(signInError.message)
				return
			}

			router.replace(next)
			router.refresh()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main className='min-h-screen bg-[#f0f4f8] flex items-center justify-center px-4'>
			<div className='w-full max-w-md rounded-xl border bg-white p-6 shadow-sm'>
				<h1 className='text-2xl font-bold text-[#232f3e]'>Sign in</h1>
				<p className='mt-2 text-sm text-muted-foreground'>
					Use the invited email account to sign in.
				</p>

				<form className='mt-6 space-y-4' onSubmit={handleSubmit}>
					<div className='space-y-1'>
						<label className='text-sm font-medium' htmlFor='email'>
							Email
						</label>
						<input
							id='email'
							type='email'
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className='w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-[#ff9900]'
							required
						/>
					</div>
					<div className='space-y-1'>
						<label className='text-sm font-medium' htmlFor='password'>
							Password
						</label>
						<input
							id='password'
							type='password'
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className='w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-[#ff9900]'
							required
						/>
					</div>

					{error && (
						<p className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
							{error}
						</p>
					)}

					<button
						type='submit'
						disabled={isLoading}
						className='w-full rounded-md bg-[#ff9900] py-2.5 text-sm font-semibold text-white hover:bg-[#e68900] disabled:opacity-70'
					>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<p className='mt-4 text-xs text-muted-foreground'>
					Need access? Ask an admin to send an invitation.
				</p>
				<Link className='mt-3 inline-block text-xs text-[#232f3e] underline' href='/'>
					Back to homepage
				</Link>
			</div>
		</main>
	)
}
