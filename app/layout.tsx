import type { Metadata } from 'next'

import './globals.css'


import { ThemeProvider } from '@/components/theme-provider'
import { BudgetProvider } from '@/lib/budget-context'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'Budget Familial',
  description: 'Application de gestion budgétaire familiale - Revenus, dépenses, factures, épargne et transactions',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    colorScheme: 'dark light',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <BudgetProvider>{children}</BudgetProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
