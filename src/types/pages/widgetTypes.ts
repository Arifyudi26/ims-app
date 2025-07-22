import type { ThemeColor } from '@core/types'
import type { OptionsMenuType } from '@core/components/option-menu/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'

export type CardStatsVerticalProps = {
  title: string
  stats: string
  avatarIcon: string
  subtitle: string
  avatarColor?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
  avatarSkin?: CustomAvatarProps['skin']
  avatarSize?: number
  moreOptions?: OptionsMenuType
}

export type LoanResults = {
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  totalMonths: number
  totalPayment: number
  totalInterest: number
}

export type PaymentSchedule = {
  installmentNo: number
  amount: number
  dueDate: string
}

export type KPICardProps = {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  subtitle?: string
}

export type StatsCardProps = {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  bgGradient: string
}
