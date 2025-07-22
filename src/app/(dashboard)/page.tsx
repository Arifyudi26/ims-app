'use client'

import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController
} from 'chart.js'
import { Chart, Bar, Pie, Doughnut } from 'react-chartjs-2'
import { Car, TrendingUp, Users, CreditCard, DollarSign, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card } from '@mui/material'

import type { KPICardProps, StatsCardProps } from '@/types/pages/widgetTypes'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  DoughnutController
)

const DashboardAnalytics: React.FC = () => {
  // Sample data for charts
  const monthlyPerformance = [
    { month: 'Jan', loans: 45, revenue: 2.8, target: 3.0 },
    { month: 'Feb', loans: 52, revenue: 3.2, target: 3.0 },
    { month: 'Mar', loans: 38, revenue: 2.4, target: 3.0 },
    { month: 'Apr', loans: 61, revenue: 3.8, target: 3.0 },
    { month: 'May', loans: 55, revenue: 3.4, target: 3.0 },
    { month: 'Jun', loans: 67, revenue: 4.2, target: 3.0 },
    { month: 'Jul', loans: 59, revenue: 3.7, target: 3.0 }
  ]

  const carTypeDistribution = [
    { name: 'Avanza', value: 35, count: 142 },
    { name: 'Xenia', value: 28, count: 113 },
    { name: 'Innova', value: 20, count: 81 },
    { name: 'Rush', value: 12, count: 49 },
    { name: 'Others', value: 5, count: 20 }
  ]

  const loanPeriodAnalysis = [
    { period: '6 Bulan', count: 25 },
    { period: '12 Bulan', count: 89 },
    { period: '18 Bulan', count: 76 },
    { period: '24 Bulan', count: 45 },
    { period: '36+ Bulan', count: 12 }
  ]

  const paymentStatus = [
    { status: 'Lancar', value: 78, color: '#10B981' },
    { status: 'Terlambat 1-30 hari', value: 15, color: '#F59E0B' },
    { status: 'Terlambat >30 hari', value: 5, color: '#EF4444' },
    { status: 'Lunas', value: 2, color: '#6B7280' }
  ]

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value * 1000000000)
  }

  // Chart configurations
  const monthlyPerformanceConfig = {
    data: {
      labels: monthlyPerformance.map(d => d.month),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Revenue (Miliar)',
          data: monthlyPerformance.map(d => d.revenue),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          type: 'line' as const,
          label: 'Target (Miliar)',
          data: monthlyPerformance.map(d => d.target),
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          yAxisID: 'y'
        },
        {
          type: 'bar' as const,
          label: 'Jumlah Kontrak',
          data: monthlyPerformance.map(d => d.loans),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false
      },
      scales: {
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Revenue (Miliar IDR)'
          }
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Jumlah Kontrak'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'top' as const
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || ''

              if (label.includes('Revenue') || label.includes('Target')) {
                return `${label}: ${formatCurrency(context.parsed.y / 1000000000)}`
              }

              return `${label}: ${context.parsed.y} kontrak`
            }
          }
        }
      }
    }
  }

  const carTypeConfig = {
    data: {
      labels: carTypeDistribution.map(d => d.name),
      datasets: [
        {
          data: carTypeDistribution.map(d => d.value),
          backgroundColor: [
            'hsl(0, 70%, 50%)',
            'hsl(72, 70%, 50%)',
            'hsl(144, 70%, 50%)',
            'hsl(216, 70%, 50%)',
            'hsl(288, 70%, 50%)'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const dataIndex = context.dataIndex
              const item = carTypeDistribution[dataIndex]

              return `${item.name}: ${item.value}% (${item.count} unit)`
            }
          }
        }
      }
    }
  }

  const loanPeriodConfig = {
    data: {
      labels: loanPeriodAnalysis.map(d => d.period),
      datasets: [
        {
          label: 'Jumlah Kontrak',
          data: loanPeriodAnalysis.map(d => d.count),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Jumlah Kontrak'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.parsed.y} kontrak`
            }
          }
        }
      }
    }
  }

  const paymentStatusConfig = {
    data: {
      labels: paymentStatus.map(d => d.status),
      datasets: [
        {
          data: paymentStatus.map(d => d.value),
          backgroundColor: paymentStatus.map(d => d.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    }
  }

  const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon, subtitle }) => {
    const getChangeColor = () => {
      switch (changeType) {
        case 'positive':
          return 'text-green-600'
        case 'negative':
          return 'text-red-600'
        default:
          return 'text-blue-600'
      }
    }

    const getChangeIcon = () => {
      switch (changeType) {
        case 'positive':
          return <TrendingUp className='w-4 h-4 mr-1' />
        case 'negative':
          return <TrendingUp className='w-4 h-4 mr-1 rotate-180' />
        default:
          return <CheckCircle className='w-4 h-4 mr-1' />
      }
    }

    return (
      <Card className='rounded-xl shadow-sm p-6 border '>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium'>{title}</p>
            <p className='text-2xl font-bold'>{value}</p>
            <p className={`text-sm flex items-center mt-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              {subtitle || change}
            </p>
          </div>
          {icon}
        </div>
      </Card>
    )
  }

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, bgGradient }) => (
    <div className={`${bgGradient} rounded-xl shadow-sm p-6 text-white`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-white/80'>{title}</p>
          <p className='text-3xl font-bold'>{value}</p>
          <p className='text-sm text-white/80'>{subtitle}</p>
        </div>
        {icon}
      </div>
    </div>
  )

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* KPI Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <KPICard
            title='Total Kontrak Aktif'
            value='1,247'
            change='+12.5% vs bulan lalu'
            changeType='positive'
            icon={<Users className='w-8 h-8 text-blue-600' />}
          />
          <KPICard
            title='Revenue Bulan Ini'
            value='Rp 3.7M'
            change='+8.3% vs target'
            changeType='positive'
            icon={<DollarSign className='w-8 h-8 text-green-600' />}
          />
          <KPICard
            title='Tingkat Kolektibilitas'
            value='94.2%'
            change='Excellent'
            changeType='neutral'
            icon={<Target className='w-8 h-8 text-purple-600' />}
          />
          <KPICard
            title='Rata-rata Angsuran'
            value='Rp 8.9jt'
            change='22 bulan rata-rata'
            changeType='neutral'
            subtitle='22 bulan rata-rata'
            icon={<CreditCard className='w-8 h-8 text-orange-600' />}
          />
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Monthly Performance */}
          <Card className='rounded-xl shadow-sm p-6 border'>
            <h3 className='text-lg font-semibold mb-4'>Performa Bulanan 2025</h3>
            <div className='h-80'>
              <Chart type='bar' data={monthlyPerformanceConfig.data} options={monthlyPerformanceConfig.options} />
            </div>
          </Card>

          {/* Car Type Distribution */}
          <Card className='rounded-xl shadow-sm p-6 border'>
            <h3 className='text-lg font-semibold mb-4'>Distribusi Jenis Mobil</h3>
            <div className='h-80'>
              <Pie data={carTypeConfig.data} options={carTypeConfig.options} />
            </div>
          </Card>

          {/* Loan Period Analysis */}
          <div className='rounded-xl shadow-sm p-6 border'>
            <h3 className='text-lg font-semibold mb-4'>Analisis Jangka Waktu Kredit</h3>
            <div className='h-80'>
              <Bar data={loanPeriodConfig.data} options={loanPeriodConfig.options} />
            </div>
          </div>

          {/* Payment Status */}
          <div className='rounded-xl shadow-sm p-6 border'>
            <h3 className='text-lg font-semibent mb-4'>Status Pembayaran</h3>
            <div className='h-80'>
              <Doughnut data={paymentStatusConfig.data} options={paymentStatusConfig.options} />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatsCard
            title='Kontrak Baru Bulan Ini'
            value='59'
            subtitle='Total nilai: Rp 14.2 Miliar'
            icon={<Car className='w-10 h-10 text-blue-200' />}
            bgGradient='bg-gradient-to-r from-blue-500 to-blue-600'
          />
          <StatsCard
            title='Pembayaran Tepat Waktu'
            value='1,176'
            subtitle='94.3% dari total kontrak'
            icon={<CheckCircle className='w-10 h-10 text-green-200' />}
            bgGradient='bg-gradient-to-r from-green-500 to-green-600'
          />
          <StatsCard
            title='Perlu Follow Up'
            value='71'
            subtitle='Terlambat pembayaran'
            icon={<AlertTriangle className='w-10 h-10 text-orange-200' />}
            bgGradient='bg-gradient-to-r from-orange-500 to-orange-600'
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics
