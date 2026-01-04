import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts')
const nextConfig: NextConfig = {
  // Remove i18n config - next-intl handles this via middleware
}

export default withNextIntl(nextConfig)
