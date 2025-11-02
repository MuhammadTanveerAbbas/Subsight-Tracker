export function logError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    console.error('[Production Error]', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
    // TODO: Integrate with Sentry or similar service
  } else {
    console.error('[Dev Error]', error, context);
  }
}
