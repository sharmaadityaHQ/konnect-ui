import type { ApiService, Service, ServiceStatus } from '@/types/service'

/**
 * Transform API response to our Service type
 * @param apiService - Raw API response
 * @param attachRaw - Whether to attach raw API data (default: false)
 */
export function transformService(apiService: ApiService, attachRaw = false): Service {
  // Determine status
  let status: ServiceStatus = 'unpublished'
  if (apiService.published) {
    status = 'published'
  } else if (apiService.configured) {
    status = 'in_progress'
  }

  // Extract unique contributors from versions
  const contributorsMap = new Map()
  apiService.versions.forEach(version => {
    if (version.developer) {
      contributorsMap.set(version.developer.id, version.developer)
    }
  })
  const contributors = Array.from(contributorsMap.values())

  // Format metrics
  const metrics = apiService.metrics ? {
    latency: `${apiService.metrics.latency.toFixed(2)}ms`,
    uptime: `${(apiService.metrics.uptime * 100).toFixed(2)}%`,
    requests: apiService.metrics.requests > 1000
      ? `${Math.floor(apiService.metrics.requests / 1000)}k`
      : apiService.metrics.requests.toString(),
    errors: `${(apiService.metrics.errors * 100).toFixed(2)}%`,
  } : {
    latency: '0ms',
    uptime: '0%',
    requests: '0',
    errors: '0%',
  }

  const service: Service = {
    id: apiService.id,
    name: apiService.name,
    description: apiService.description,
    type: apiService.type,
    status,
    metrics,
    versions: apiService.versions.length,
    contributors,
    published: apiService.published,
  }

  // Attach raw API data if requested (for navigation purposes)
  if (attachRaw) {
    service._raw = apiService
  }

  return service
}
