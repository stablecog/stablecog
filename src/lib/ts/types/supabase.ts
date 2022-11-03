export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			admin: {
				Row: {
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			generation: {
				Row: {
					prompt: string | null;
					width: number;
					height: number;
					seed: number;
					num_inference_steps: number;
					guidance_scale: number;
					server_url: string;
					id: string;
					created_at: string;
					updated_at: string;
					country_code: string | null;
					device_type: string | null;
					device_os: string | null;
					device_browser: string | null;
					user_agent: string | null;
					duration_ms: number | null;
					negative_prompt: string | null;
					status: Database['public']['Enums']['generation_status_enum'] | null;
				};
				Insert: {
					prompt?: string | null;
					width: number;
					height: number;
					seed: number;
					num_inference_steps: number;
					guidance_scale: number;
					server_url: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
					country_code?: string | null;
					device_type?: string | null;
					device_os?: string | null;
					device_browser?: string | null;
					user_agent?: string | null;
					duration_ms?: number | null;
					negative_prompt?: string | null;
					status?: Database['public']['Enums']['generation_status_enum'] | null;
				};
				Update: {
					prompt?: string | null;
					width?: number;
					height?: number;
					seed?: number;
					num_inference_steps?: number;
					guidance_scale?: number;
					server_url?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
					country_code?: string | null;
					device_type?: string | null;
					device_os?: string | null;
					device_browser?: string | null;
					user_agent?: string | null;
					duration_ms?: number | null;
					negative_prompt?: string | null;
					status?: Database['public']['Enums']['generation_status_enum'] | null;
				};
			};
			generation_g: {
				Row: {
					prompt_id: string;
					negative_prompt_id: string | null;
					model_id: string;
					image_id: string;
					width: number;
					height: number;
					seed: string;
					inference_steps: number | null;
					guidance_scale: number;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					prompt_id: string;
					negative_prompt_id?: string | null;
					model_id: string;
					image_id: string;
					width: number;
					height: number;
					seed: string;
					inference_steps?: number | null;
					guidance_scale: number;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					prompt_id?: string;
					negative_prompt_id?: string | null;
					model_id?: string;
					image_id?: string;
					width?: number;
					height?: number;
					seed?: string;
					inference_steps?: number | null;
					guidance_scale?: number;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			generation_realtime: {
				Row: {
					status: Database['public']['Enums']['generation_status_enum'];
					duration_ms: number | null;
					country_code: string | null;
					id: string;
					created_at: string;
					updated_at: string;
					uses_default_server: boolean;
					width: number | null;
					height: number | null;
					num_inference_steps: number | null;
				};
				Insert: {
					status: Database['public']['Enums']['generation_status_enum'];
					duration_ms?: number | null;
					country_code?: string | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
					uses_default_server: boolean;
					width?: number | null;
					height?: number | null;
					num_inference_steps?: number | null;
				};
				Update: {
					status?: Database['public']['Enums']['generation_status_enum'];
					duration_ms?: number | null;
					country_code?: string | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
					uses_default_server?: boolean;
					width?: number | null;
					height?: number | null;
					num_inference_steps?: number | null;
				};
			};
			model: {
				Row: {
					name: string;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					name: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					name?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			negative_prompt: {
				Row: {
					text: string;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					text: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					text?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			prompt: {
				Row: {
					text: string;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					text: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					text?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			server: {
				Row: {
					url: string;
					healthy: boolean;
					last_health_check_at: string;
					id: string;
					created_at: string;
					updated_at: string;
					enabled: boolean;
				};
				Insert: {
					url: string;
					healthy?: boolean;
					last_health_check_at?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
					enabled?: boolean;
				};
				Update: {
					url?: string;
					healthy?: boolean;
					last_health_check_at?: string;
					id?: string;
					created_at?: string;
					updated_at?: string;
					enabled?: boolean;
				};
			};
			upscale: {
				Row: {
					width: number;
					height: number;
					scale: number;
					status: Database['public']['Enums']['upscale_status_enum'];
					server_url: string;
					duration_ms: number | null;
					version: string | null;
					prompt: string | null;
					negative_prompt: string | null;
					seed: number | null;
					num_inference_steps: number | null;
					guidance_scale: number | null;
					country_code: string | null;
					device_type: string | null;
					device_os: string | null;
					device_browser: string | null;
					user_agent: string | null;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					width: number;
					height: number;
					scale: number;
					status: Database['public']['Enums']['upscale_status_enum'];
					server_url: string;
					duration_ms?: number | null;
					version?: string | null;
					prompt?: string | null;
					negative_prompt?: string | null;
					seed?: number | null;
					num_inference_steps?: number | null;
					guidance_scale?: number | null;
					country_code?: string | null;
					device_type?: string | null;
					device_os?: string | null;
					device_browser?: string | null;
					user_agent?: string | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					width?: number;
					height?: number;
					scale?: number;
					status?: Database['public']['Enums']['upscale_status_enum'];
					server_url?: string;
					duration_ms?: number | null;
					version?: string | null;
					prompt?: string | null;
					negative_prompt?: string | null;
					seed?: number | null;
					num_inference_steps?: number | null;
					guidance_scale?: number | null;
					country_code?: string | null;
					device_type?: string | null;
					device_os?: string | null;
					device_browser?: string | null;
					user_agent?: string | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			upscale_realtime: {
				Row: {
					status: Database['public']['Enums']['upscale_status_enum'];
					duration_ms: number | null;
					country_code: string | null;
					uses_default_server: boolean;
					width: number | null;
					height: number | null;
					scale: number | null;
					id: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					status: Database['public']['Enums']['upscale_status_enum'];
					duration_ms?: number | null;
					country_code?: string | null;
					uses_default_server: boolean;
					width?: number | null;
					height?: number | null;
					scale?: number | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					status?: Database['public']['Enums']['upscale_status_enum'];
					duration_ms?: number | null;
					country_code?: string | null;
					uses_default_server?: boolean;
					width?: number | null;
					height?: number | null;
					scale?: number | null;
					id?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			generation_public: {
				Row: {
					id: string | null;
					duration_ms: number | null;
					status: Database['public']['Enums']['generation_status_enum'] | null;
					country_code: string | null;
					created_at: string | null;
					updated_at: string | null;
				};
				Insert: {
					id?: string | null;
					duration_ms?: number | null;
					status?: Database['public']['Enums']['generation_status_enum'] | null;
					country_code?: string | null;
					created_at?: string | null;
					updated_at?: string | null;
				};
				Update: {
					id?: string | null;
					duration_ms?: number | null;
					status?: Database['public']['Enums']['generation_status_enum'] | null;
					country_code?: string | null;
					created_at?: string | null;
					updated_at?: string | null;
				};
			};
			upscale_public: {
				Row: {
					id: string | null;
					duration_ms: number | null;
					status: Database['public']['Enums']['upscale_status_enum'] | null;
					country_code: string | null;
					created_at: string | null;
					updated_at: string | null;
				};
				Insert: {
					id?: string | null;
					duration_ms?: number | null;
					status?: Database['public']['Enums']['upscale_status_enum'] | null;
					country_code?: string | null;
					created_at?: string | null;
					updated_at?: string | null;
				};
				Update: {
					id?: string | null;
					duration_ms?: number | null;
					status?: Database['public']['Enums']['upscale_status_enum'] | null;
					country_code?: string | null;
					created_at?: string | null;
					updated_at?: string | null;
				};
			};
		};
		Functions: {
			generation_count: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_count_with_null_duration_ms: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_duration_ms_total_estimate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_duration_ms_total_estimate_with_constant: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_total_duration: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_with_non_null_duration_ms_average: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			generation_with_non_null_duration_ms_total: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_count: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_count_with_null_duration_ms: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_duration_ms_total_estimate: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_duration_ms_total_estimate_with_constant: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_with_non_null_duration_ms_average: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			upscale_with_non_null_duration_ms_total: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
		};
		Enums: {
			generation_status_enum: 'started' | 'succeeded' | 'failed' | 'rejected';
			upscale_status_enum: 'started' | 'succeeded' | 'failed';
		};
	};
}
