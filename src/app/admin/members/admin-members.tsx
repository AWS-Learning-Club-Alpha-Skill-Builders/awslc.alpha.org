'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
	BookOpen,
	Check,
	Mail,
	Search,
	Send,
	ShieldCheck,
	UserPlus,
	Users,
	X,
	XCircle,
} from 'lucide-react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { inviteMemberAction } from '@/actions/invite-member'
import { approveMemberAction } from '@/actions/approve-member'
import EnrollmentModal from './enrollment-modal'
import type { MemberRow } from '@/types/admin.types'

interface AdminMembersProps {
	members: MemberRow[]
	superAdminEmails: string[]
	allCategories: { id: string; name: string; emoji: string }[]
	enrollmentsByMember: Record<string, string[]>
}

type FilterTab = 'all' | 'pending' | 'approved'

export default function AdminMembers({
	members,
	superAdminEmails,
	allCategories,
	enrollmentsByMember,
}: AdminMembersProps) {
	const pageRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const [search, setSearch] = useState('')
	const [tab, setTab] = useState<FilterTab>('all')
	const [showInvite, setShowInvite] = useState(false)
	const [inviteEmail, setInviteEmail] = useState('')
	const [inviteMsg, setInviteMsg] = useState<
		string | null
	>(null)
	const [isPending, startTransition] = useTransition()
	const [enrollMemberId, setEnrollMemberId] = useState<
		string | null
	>(null)

	const enrollMember = enrollMemberId
		? members.find((m) => m.id === enrollMemberId)
		: null

	useEffect(() => {
		if (!pageRef.current) return
		const rows = Array.from(
			pageRef.current.querySelectorAll('[data-row]'),
		)
		if (rows.length === 0) return

		gsap.set(rows, { opacity: 0, y: 10 })
		gsap.to(rows, {
			opacity: 1,
			y: 0,
			duration: 0.35,
			stagger: 0.03,
			ease: 'power3.out',
			delay: 0.1,
		})
	}, [tab])

	const pendingCount = members.filter(
		(m) =>
			!m.isApproved &&
			!superAdminEmails.includes(
				m.email.toLowerCase(),
			),
	).length

	const filtered = members.filter((m) => {
		if (tab === 'pending' && m.isApproved) return false
		if (tab === 'approved' && !m.isApproved)
			return false
		if (!search) return true
		const q = search.toLowerCase()
		return (
			m.email.toLowerCase().includes(q) ||
			(m.fullName?.toLowerCase().includes(q) ?? false)
		)
	})

	function handleInvite() {
		if (!inviteEmail.trim()) return
		startTransition(async () => {
			const result = await inviteMemberAction(
				inviteEmail.trim(),
			)
			setInviteMsg(result.message)
			if (result.ok) {
				setInviteEmail('')
				router.refresh()
			}
		})
	}

	function handleApprove(
		memberId: string,
		approved: boolean,
	) {
		startTransition(async () => {
			await approveMemberAction(memberId, approved)
			router.refresh()
		})
	}

	return (
		<div ref={pageRef}>
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
				<div>
					<h1 className='text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2'>
						<Users className='w-5 sm:w-6 h-5 sm:h-6 text-[#ff9900]' />
						Members
					</h1>
					<p className='text-xs sm:text-sm text-white/40 mt-1'>
						{members.length} total members
						{pendingCount > 0 && (
							<span className='text-[#ff9900] ml-1'>
								&middot; {pendingCount} pending
								approval
							</span>
						)}
					</p>
				</div>
				<button
					type='button'
					onClick={() => setShowInvite(true)}
					className={cn(
						'inline-flex items-center gap-2',
						'rounded-xl px-4 py-2.5',
						'bg-[#ff9900] text-white',
						'text-sm font-semibold',
						'hover:bg-[#e68900]',
						'transition-colors',
						'self-start sm:self-auto',
					)}
				>
					<UserPlus className='w-4 h-4' />
					Invite Member
				</button>
			</div>

			{/* Invite modal */}
			{showInvite && (
				<div
					className={cn(
						'fixed inset-0 z-50',
						'bg-black/60 backdrop-blur-sm',
						'flex items-center justify-center',
						'px-4',
					)}
					onClick={(e) => {
						if (e.target === e.currentTarget)
							setShowInvite(false)
					}}
					role='dialog'
					aria-modal='true'
					aria-label='Invite member'
				>
					<div
						className={cn(
							'w-full max-w-md rounded-2xl',
							'border border-white/[0.08]',
							'bg-[#12131a] p-6',
						)}
					>
						<div className='flex items-center justify-between mb-5'>
							<h2 className='text-lg font-bold text-white'>
								Invite Member
							</h2>
							<button
								type='button'
								onClick={() => {
									setShowInvite(false)
									setInviteMsg(null)
								}}
								className='text-white/30 hover:text-white/60'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<p className='text-xs text-white/35 mb-4'>
							Enter a Gmail address to add to
							the allowlist.
						</p>
						<div className='relative mb-3'>
							<Mail
								className={cn(
									'absolute left-3.5',
									'top-1/2 -translate-y-1/2',
									'w-4 h-4 text-white/20',
									'pointer-events-none',
								)}
							/>
							<input
								type='email'
								value={inviteEmail}
								onChange={(e) =>
									setInviteEmail(
										e.target.value,
									)
								}
								placeholder='member@gmail.com'
								className={cn(
									'w-full rounded-xl',
									'border border-white/[0.08]',
									'bg-white/[0.04]',
									'pl-10 pr-4 py-3',
									'text-sm text-white',
									'placeholder:text-white/20',
									'outline-none',
									'focus:border-[#ff9900]/40',
									'transition-all',
								)}
							/>
						</div>
						{inviteMsg && (
							<p
								className={cn(
									'text-xs rounded-lg',
									'px-3 py-2 mb-3',
									inviteMsg.includes(
										'success',
									)
										? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
										: 'text-red-400 bg-red-500/10 border border-red-500/20',
								)}
							>
								{inviteMsg}
							</p>
						)}
						<button
							type='button'
							disabled={
								isPending ||
								!inviteEmail.trim()
							}
							onClick={handleInvite}
							className={cn(
								'w-full inline-flex',
								'items-center justify-center',
								'gap-2 rounded-xl py-3',
								'bg-[#ff9900] text-white',
								'text-sm font-semibold',
								'hover:bg-[#e68900]',
								'disabled:opacity-50',
								'transition-colors',
							)}
						>
							<Send className='w-4 h-4' />
							{isPending
								? 'Sending...'
								: 'Send Invite Link'}
						</button>
					</div>
				</div>
			)}

			{/* Tabs */}
			<div className='flex gap-1 mb-5'>
				{(
					[
						{
							key: 'all',
							label: 'All',
							count: members.length,
						},
						{
							key: 'pending',
							label: 'Pending',
							count: pendingCount,
						},
						{
							key: 'approved',
							label: 'Approved',
							count:
								members.length - pendingCount,
						},
					] as const
				).map((t) => (
					<button
						key={t.key}
						type='button'
						onClick={() => setTab(t.key)}
						className={cn(
							'px-3.5 py-1.5 rounded-lg',
							'text-xs font-medium',
							'transition-all',
							tab === t.key
								? 'bg-[#ff9900]/15 text-[#ff9900]'
								: 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]',
						)}
					>
						{t.label}
						{t.key === 'pending' &&
							t.count > 0 && (
								<span
									className={cn(
										'ml-1.5 px-1.5 py-0.5',
										'rounded-full',
										'text-[9px] font-bold',
										'bg-[#ff9900] text-white',
									)}
								>
									{t.count}
								</span>
							)}
					</button>
				))}
			</div>

			{/* Search */}
			<div className='relative mb-6 max-w-sm'>
				<Search
					className={cn(
						'absolute left-3.5',
						'top-1/2 -translate-y-1/2',
						'w-4 h-4 text-white/20',
						'pointer-events-none',
					)}
				/>
				<input
					type='text'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Search by name or email...'
					className={cn(
						'w-full rounded-xl',
						'border border-white/[0.08]',
						'bg-white/[0.03]',
						'pl-10 pr-4 py-2.5',
						'text-sm text-white',
						'placeholder:text-white/20',
						'outline-none',
						'focus:border-[#ff9900]/40',
						'transition-all',
					)}
				/>
			</div>

			{/* Members table — desktop */}
			<div
				className={cn(
					'rounded-2xl overflow-hidden',
					'border border-white/[0.06]',
					'bg-white/[0.02]',
					'hidden md:block',
				)}
			>
				{/* Header */}
				<div
					className={cn(
						'grid grid-cols-[1fr_6rem_5rem_5rem_6rem_7rem]',
						'gap-4 px-5 py-3',
						'border-b border-white/[0.06]',
						'text-[10px] uppercase tracking-wider',
						'text-white/25 font-semibold',
					)}
				>
					<span>Member</span>
					<span className='text-center'>
						Status
					</span>
					<span className='text-right'>Done</span>
					<span className='text-right'>
						Active
					</span>
					<span className='text-right'>
						Joined
					</span>
					<span className='text-center'>
						Action
					</span>
				</div>

				{/* Rows */}
				{filtered.length === 0 ? (
					<p className='text-sm text-white/20 text-center py-12'>
						No members found.
					</p>
				) : (
					filtered.map((member) => {
						const isMemberAdmin =
							superAdminEmails.includes(
								member.email.toLowerCase(),
							)

						return (
							<div
								key={member.id}
								data-row
								className={cn(
									'grid grid-cols-[1fr_6rem_5rem_5rem_6rem_7rem]',
									'gap-4 px-5 py-3.5',
									'border-b border-white/[0.03]',
									'hover:bg-white/[0.02]',
									'transition-colors',
									!member.isApproved &&
										!isMemberAdmin &&
										'bg-[#ff9900]/[0.02]',
								)}
							>
								<div className='min-w-0'>
									<p className='text-sm font-medium text-white truncate'>
										{member.fullName ??
											member.email}
									</p>
									{member.fullName && (
										<p className='text-[11px] text-white/25 truncate'>
											{member.email}
										</p>
									)}
								</div>
								<div className='flex items-center justify-center'>
									{isMemberAdmin ? (
										<span
											className={cn(
												'inline-flex items-center gap-1',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-[#ff9900]/15 text-[#ff9900]',
											)}
										>
											<ShieldCheck className='w-3 h-3' />
											Super Admin
										</span>
									) : member.isApproved ? (
										<span
											className={cn(
												'inline-flex items-center gap-1',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-emerald-500/10 text-emerald-400',
											)}
										>
											<Check className='w-3 h-3' />
											Approved
										</span>
									) : (
										<span
											className={cn(
												'inline-flex items-center gap-1',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-yellow-500/10 text-yellow-400',
											)}
										>
											Pending
										</span>
									)}
								</div>
								<div className='flex items-center justify-end'>
									<span className='text-sm text-emerald-400 tabular-nums'>
										{member.modulesCompleted}
									</span>
								</div>
								<div className='flex items-center justify-end'>
									<span className='text-sm text-[#ff9900] tabular-nums'>
										{member.modulesInProgress}
									</span>
								</div>
								<div className='flex items-center justify-end'>
									<span className='text-[11px] text-white/25'>
										{new Date(
											member.createdAt,
										).toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center justify-center gap-1.5'>
									{isMemberAdmin ? (
										<span className='text-[10px] text-white/15'>
											&mdash;
										</span>
									) : member.isApproved ? (
										<>
											<button
												type='button'
												onClick={() =>
													setEnrollMemberId(
														member.id,
													)
												}
												title='Manage enrollments'
												className={cn(
													'p-1.5 rounded-lg',
													'text-white/20',
													'hover:text-[#ff9900]',
													'hover:bg-[#ff9900]/10',
													'transition-all',
												)}
											>
												<BookOpen className='w-4 h-4' />
											</button>
											<button
												type='button'
												disabled={isPending}
												onClick={() =>
													handleApprove(
														member.id,
														false,
													)
												}
												title='Revoke access'
												className={cn(
													'p-1.5 rounded-lg',
													'text-white/20',
													'hover:text-red-400',
													'hover:bg-red-500/10',
													'transition-all',
													'disabled:opacity-40',
												)}
											>
												<XCircle className='w-4 h-4' />
											</button>
										</>
									) : (
										<button
											type='button'
											disabled={isPending}
											onClick={() =>
												handleApprove(
													member.id,
													true,
												)
											}
											className={cn(
												'inline-flex items-center',
												'gap-1 px-3 py-1.5',
												'rounded-lg',
												'bg-emerald-500/15',
												'text-emerald-400',
												'text-[11px] font-semibold',
												'hover:bg-emerald-500/25',
												'transition-all',
												'disabled:opacity-40',
											)}
										>
											<Check className='w-3 h-3' />
											Approve
										</button>
									)}
								</div>
							</div>
						)
					})
				)}
			</div>

			{/* Members cards — mobile */}
			<div className='space-y-3 md:hidden'>
				{filtered.length === 0 ? (
					<p className='text-sm text-white/20 text-center py-12'>
						No members found.
					</p>
				) : (
					filtered.map((member) => {
						const isMemberAdmin =
							superAdminEmails.includes(
								member.email.toLowerCase(),
							)

						return (
							<div
								key={member.id}
								data-row
								className={cn(
									'rounded-xl p-4',
									'border border-white/[0.06]',
									'bg-white/[0.02]',
									!member.isApproved &&
										!isMemberAdmin &&
										'border-[#ff9900]/10',
								)}
							>
								<div className='flex items-start justify-between gap-3 mb-3'>
									<div className='min-w-0'>
										<p className='text-sm font-medium text-white truncate'>
											{member.fullName ??
												member.email}
										</p>
										{member.fullName && (
											<p className='text-[11px] text-white/25 truncate'>
												{member.email}
											</p>
										)}
									</div>
									{isMemberAdmin ? (
										<span
											className={cn(
												'inline-flex items-center gap-1 shrink-0',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-[#ff9900]/15 text-[#ff9900]',
											)}
										>
											<ShieldCheck className='w-3 h-3' />
											Admin
										</span>
									) : member.isApproved ? (
										<span
											className={cn(
												'inline-flex items-center gap-1 shrink-0',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-emerald-500/10 text-emerald-400',
											)}
										>
											<Check className='w-3 h-3' />
											Approved
										</span>
									) : (
										<span
											className={cn(
												'inline-flex items-center gap-1 shrink-0',
												'text-[10px] uppercase',
												'tracking-wider font-semibold',
												'px-2 py-0.5 rounded-md',
												'bg-yellow-500/10 text-yellow-400',
											)}
										>
											Pending
										</span>
									)}
								</div>
								<div className='flex items-center gap-4 text-xs mb-3'>
									<span className='text-white/30'>
										Done:{' '}
										<span className='text-emerald-400 font-medium'>
											{member.modulesCompleted}
										</span>
									</span>
									<span className='text-white/30'>
										Active:{' '}
										<span className='text-[#ff9900] font-medium'>
											{member.modulesInProgress}
										</span>
									</span>
									<span className='text-white/30'>
										Joined:{' '}
										<span className='text-white/50'>
											{new Date(
												member.createdAt,
											).toLocaleDateString()}
										</span>
									</span>
								</div>
								{!isMemberAdmin && (
									<div className='flex items-center gap-2 pt-2 border-t border-white/[0.04]'>
										{member.isApproved ? (
											<>
												<button
													type='button'
													onClick={() =>
														setEnrollMemberId(
															member.id,
														)
													}
													className={cn(
														'inline-flex items-center gap-1.5',
														'px-3 py-1.5 rounded-lg',
														'text-[11px] font-semibold',
														'bg-[#ff9900]/10 text-[#ff9900]',
														'hover:bg-[#ff9900]/20',
														'transition-all',
													)}
												>
													<BookOpen className='w-3.5 h-3.5' />
													Enrollments
												</button>
												<button
													type='button'
													disabled={isPending}
													onClick={() =>
														handleApprove(
															member.id,
															false,
														)
													}
													className={cn(
														'inline-flex items-center gap-1.5',
														'px-3 py-1.5 rounded-lg',
														'text-[11px] font-semibold',
														'bg-red-500/10 text-red-400',
														'hover:bg-red-500/20',
														'transition-all',
														'disabled:opacity-40',
													)}
												>
													<XCircle className='w-3.5 h-3.5' />
													Revoke
												</button>
											</>
										) : (
											<button
												type='button'
												disabled={isPending}
												onClick={() =>
													handleApprove(
														member.id,
														true,
													)
												}
												className={cn(
													'inline-flex items-center',
													'gap-1 px-3 py-1.5',
													'rounded-lg',
													'bg-emerald-500/15',
													'text-emerald-400',
													'text-[11px] font-semibold',
													'hover:bg-emerald-500/25',
													'transition-all',
													'disabled:opacity-40',
												)}
											>
												<Check className='w-3 h-3' />
												Approve
											</button>
										)}
									</div>
								)}
							</div>
						)
					})
				)}
			</div>

			{enrollMember && (
				<EnrollmentModal
					memberId={enrollMember.id}
					memberName={
						enrollMember.fullName ??
						enrollMember.email
					}
					allCategories={allCategories}
					initialEnrolledIds={
						enrollmentsByMember[
							enrollMember.id
						] ?? []
					}
					onClose={() =>
						setEnrollMemberId(null)
					}
				/>
			)}
		</div>
	)
}
