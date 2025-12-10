export type ServiceStatus = 'published' | 'in_progress' | 'unpublished'

export interface ServiceMetrics {
  latency: string
  uptime: string
  requests: string
  errors: string
}

export interface ServiceContributor {
  id: string
  name: string
  avatar: string
}

export interface Version {
  id: string
  name: string
  description: string
  developer?: ServiceContributor
  updated_at: string
}

export interface ApiService {
  id: string
  name: string
  description: string
  type: string
  published: boolean
  configured: boolean
  versions: Version[]
  metrics?: {
    latency: number
    uptime: number
    requests: number
    errors: number
  }
}

export interface Service {
  id: string
  name: string
  description: string
  type: string
  status: ServiceStatus
  metrics: ServiceMetrics
  versions: number
  contributors: ServiceContributor[]
  published: boolean
  _raw?: ApiService // Internal: full API response data
}

export interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
}
