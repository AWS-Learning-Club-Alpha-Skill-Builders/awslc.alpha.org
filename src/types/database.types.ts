export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string
					email: string
					full_name: string | null
					role: 'member' | 'admin' | 'super-admin'
					is_approved: boolean
					avatar_url: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id: string
					email: string
					full_name?: string | null
					role?: 'member' | 'admin' | 'super-admin'
					is_approved?: boolean
					avatar_url?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					email?: string
					full_name?: string | null
					role?: 'member' | 'admin' | 'super-admin'
					is_approved?: boolean
					avatar_url?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			invites: {
				Row: {
					id: string
					email: string
					invited_by: string
					status: 'pending' | 'accepted' | 'revoked' | 'expired'
					expires_at: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					email: string
					invited_by: string
					status?: 'pending' | 'accepted' | 'revoked' | 'expired'
					expires_at?: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					email?: string
					invited_by?: string
					status?: 'pending' | 'accepted' | 'revoked' | 'expired'
					expires_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			skill_categories: {
				Row: {
					id: string
					slug: string
					name: string
					emoji: string | null
					theme_key: string | null
					short_description: string | null
					long_description: string | null
					display_order: number
					is_active: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					slug: string
					name: string
					emoji?: string | null
					theme_key?: string | null
					short_description?: string | null
					long_description?: string | null
					display_order?: number
					is_active?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					slug?: string
					name?: string
					emoji?: string | null
					theme_key?: string | null
					short_description?: string | null
					long_description?: string | null
					display_order?: number
					is_active?: boolean
					updated_at?: string
				}
				Relationships: []
			}
			skill_modules: {
				Row: {
					id: string
					category_id: string
					slug: string
					title: string
					nextwork_url: string
					description: string | null
					display_order: number
					is_active: boolean
					verification_hints: Json
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					category_id: string
					slug: string
					title: string
					nextwork_url: string
					description?: string | null
					display_order?: number
					is_active?: boolean
					verification_hints?: Json
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					category_id?: string
					slug?: string
					title?: string
					nextwork_url?: string
					description?: string | null
					display_order?: number
					is_active?: boolean
					verification_hints?: Json
					updated_at?: string
				}
				Relationships: []
			}
			module_progress: {
				Row: {
					id: string
					user_id: string
					module_id: string
					status: 'todo' | 'in-progress' | 'done'
					started_at: string | null
					completed_at: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					module_id: string
					status?: 'todo' | 'in-progress' | 'done'
					started_at?: string | null
					completed_at?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					status?: 'todo' | 'in-progress' | 'done'
					started_at?: string | null
					completed_at?: string | null
					updated_at?: string
				}
				Relationships: []
			}
			member_enrollments: {
				Row: {
					id: string
					user_id: string
					category_id: string
					enrolled_by: string
					enrolled_at: string
				}
				Insert: {
					id?: string
					user_id: string
					category_id: string
					enrolled_by: string
					enrolled_at?: string
				}
				Update: {
					user_id?: string
					category_id?: string
					enrolled_by?: string
					enrolled_at?: string
				}
				Relationships: []
			}
			module_submissions: {
				Row: {
					id: string
					user_id: string
					module_id: string
					documentation_url: string
					verification_status: 'pending' | 'verified' | 'failed'
					verification_reason: string | null
					verified_at: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					user_id: string
					module_id: string
					documentation_url: string
					verification_status?: 'pending' | 'verified' | 'failed'
					verification_reason?: string | null
					verified_at?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					documentation_url?: string
					verification_status?: 'pending' | 'verified' | 'failed'
					verification_reason?: string | null
					verified_at?: string | null
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: Record<string, never>
		Functions: Record<string, never>
		Enums: Record<string, never>
		CompositeTypes: Record<string, never>
	}
}
