export async function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    return
  }

  try {
    const Sentry = await import('@sentry/react')
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    })
  } catch (error) {
    console.warn('Sentry skipped', error)
  }
}
