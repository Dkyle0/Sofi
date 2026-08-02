import { setupWorker } from 'msw/browser'
import { handlers } from '@/app/mocks/handlers'

export const worker = setupWorker(...handlers)

export async function startMockWorker() {
  await worker.start({
    onUnhandledRequest(request, print) {
      const url = new URL(request.url)
      const isApplicationApi =
        url.pathname.startsWith('/api') || url.pathname.startsWith('/vacancy-parser')
      const isExternalRequest = url.origin !== window.location.origin

      if (isApplicationApi || isExternalRequest) {
        print.error()
      }
    },
  })
}
