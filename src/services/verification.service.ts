import 'server-only'

interface VerificationInput {
	moduleTitle: string
	moduleSlug: string
	moduleUrl: string
	verificationHints: string[]
	documentationUrl: string
}

interface VerificationResult {
	isVerified: boolean
	reason: string
}

const ALLOWED_DOCUMENTATION_HOSTS = new Set([
	'nextwork.org',
	'docs.google.com',
])

function normalizeText(input: string) {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function slugTokensFromUrl(url: string) {
	const tokens = url
		.toLowerCase()
		.split('/')
		.flatMap((part) => part.split('-'))
		.map((token) => token.trim())
		.filter(Boolean)
	return new Set(tokens)
}

function stripHtmlToText(html: string) {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
}

function isAllowedDocumentationHost(hostname: string) {
	return Array.from(ALLOWED_DOCUMENTATION_HOSTS).some(
		(allowedHost) =>
			hostname === allowedHost ||
			hostname.endsWith(`.${allowedHost}`),
	)
}

function resolveFetchUrl(documentationUrl: URL) {
	if (documentationUrl.hostname === 'docs.google.com') {
		const match = documentationUrl.pathname.match(
			/^\/document\/(?:u\/\d+\/)?d\/([^/]+)/,
		)
		if (match) {
			const exportUrl = new URL(
				`https://docs.google.com/document/d/${match[1]}/export`,
			)
			exportUrl.searchParams.set('format', 'html')
			return exportUrl
		}
	}

	return documentationUrl
}

export async function verifyNextworkDocumentation(
	input: VerificationInput,
): Promise<VerificationResult> {
	let parsedUrl: URL
	try {
		parsedUrl = new URL(input.documentationUrl)
	} catch {
		return {
			isVerified: false,
			reason: 'Invalid documentation URL format.',
		}
	}

	if (!isAllowedDocumentationHost(parsedUrl.hostname)) {
		return {
			isVerified: false,
			reason: 'URL must be a public Google Docs or Nextwork link.',
		}
	}

	const fetchUrl = resolveFetchUrl(parsedUrl)

	let response: Response
	try {
		response = await fetch(fetchUrl.toString(), {
			method: 'GET',
			cache: 'no-store',
		})
	} catch {
		return {
			isVerified: false,
			reason: 'Unable to access the documentation URL.',
		}
	}

	if (!response.ok) {
		return {
			isVerified: false,
			reason: 'Documentation URL is not publicly accessible.',
		}
	}

	const html = await response.text()
	const pageText = normalizeText(stripHtmlToText(html))

	const moduleTitleTokens = normalizeText(input.moduleTitle)
		.split(' ')
		.filter((token) => token.length >= 4)
	const moduleUrlTokens = Array.from(slugTokensFromUrl(input.moduleUrl)).filter(
		(token) => token.length >= 4,
	)
	const extraHintTokens = input.verificationHints
		.map((hint) => normalizeText(hint))
		.filter(Boolean)

	const hasTitleMatch = moduleTitleTokens.some((token) => pageText.includes(token))
	const hasUrlTokenMatch = moduleUrlTokens.some((token) => pageText.includes(token))
	const hasHintMatch = extraHintTokens.some((token) => pageText.includes(token))
	const hasSlugMatch = pageText.includes(normalizeText(input.moduleSlug))

	const score = [hasTitleMatch, hasUrlTokenMatch, hasHintMatch, hasSlugMatch].filter(
		Boolean,
	).length

	if (score >= 1) {
		return {
			isVerified: true,
			reason: 'Documentation link matched module verification signals.',
		}
	}

	return {
		isVerified: false,
		reason: 'Could not verify this link for the selected module. Please resubmit.',
	}
}
