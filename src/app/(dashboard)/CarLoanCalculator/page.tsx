'use client'
import React, { useState } from 'react'

import { Calculator, Car, CreditCard, Calendar } from 'lucide-react'

import Card from '@mui/material/Card'

import type { LoanResults, PaymentSchedule } from '@/types/pages/widgetTypes'

const CarLoanCalculator: React.FC = () => {
  const [carPrice, setCarPrice] = useState(240000000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [loanPeriodMonths, setLoanPeriodMonths] = useState(18)

  // Determine the interest rate based on the time period
  const getInterestRate = (months: number): number => {
    if (months <= 12) return 12
    if (months > 12 && months <= 24) return 14

    return 16.5
  }

  const interestRate: number = getInterestRate(loanPeriodMonths)

  const calculateLoan = (): LoanResults => {
    const downPayment = (carPrice * downPaymentPercent) / 100
    const loanAmount = carPrice - downPayment
    const totalMonths = loanPeriodMonths

    // Formula: monthly installment = (principal debt + (principal debt * interest)) / term
    const totalInterest = loanAmount * (interestRate / 100)
    const totalPayment = loanAmount + totalInterest
    const monthlyPayment = totalPayment / totalMonths

    return {
      downPayment,
      loanAmount,
      monthlyPayment,
      totalMonths,
      totalPayment,
      totalInterest
    }
  }

  const results = calculateLoan()

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const generatePaymentSchedule = (): PaymentSchedule[] => {
    const schedule: PaymentSchedule[] = []
    const startDate = new Date()

    for (let i = 1; i <= results.totalMonths; i++) {
      const dueDate = new Date(startDate)

      dueDate.setMonth(startDate.getMonth() + i)

      schedule.push({
        installmentNo: i,
        amount: results.monthlyPayment,
        dueDate: dueDate.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      })
    }

    return schedule
  }

  const paymentSchedule = generatePaymentSchedule()

  return (
    <div className='min-h-screen bg-gradient-to-br'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2 flex items-center justify-center gap-3'>
            <Car className='text-blue-600' />
            Kalkulator Kredit Mobil IMS Finance
          </h1>
          <p>Hitung angsuran bulanan untuk pembelian mobil Avanza</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Input Form */}
          <Card className='rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
              <Calculator className='text-blue-600' />
              Data Kredit
            </h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Harga Mobil (OTR)</label>
                <input
                  type='number'
                  value={carPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCarPrice(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='240000000'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Down Payment (%)</label>
                <input
                  type='number'
                  value={downPaymentPercent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDownPaymentPercent(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='20'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Jangka Waktu</label>
                <select
                  value={loanPeriodMonths}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLoanPeriodMonths(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan</option>
                  <option value={18}>18 Bulan</option>
                  <option value={24}>24 Bulan</option>
                  <option value={36}>36 Bulan</option>
                  <option value={48}>48 Bulan</option>
                  <option value={60}>60 Bulan</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Suku Bunga (% per tahun)</label>
                <input
                  type='number'
                  value={interestRate}
                  disabled
                  className='w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  {loanPeriodMonths <= 12 && '<12 bulan = 12%'}
                  {loanPeriodMonths > 12 && loanPeriodMonths <= 24 && '>12-24 bulan = 14%'}
                  {loanPeriodMonths > 24 && '>24 bulan = 16.5%'}
                </p>
              </div>
            </div>
          </Card>

          {/* Results */}
          <Card className='rounded-2xl shadow-xl p-8 flex flex-col'>
            <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
              <CreditCard className='text-green-600' />
              Hasil Perhitungan
            </h2>

            <div className='space-y-4'>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <p className='text-sm text-black'>Down Payment</p>
                <p className='text-2xl font-bold text-blue-600'>{formatCurrency(results.downPayment)}</p>
              </div>

              <div className='bg-green-50 p-4 rounded-lg'>
                <p className='text-sm text-black'>Jumlah Pinjaman</p>
                <p className='text-2xl font-bold text-green-600'>{formatCurrency(results.loanAmount)}</p>
              </div>

              <div className='bg-red-50 p-4 rounded-lg'>
                <p className='text-sm text-black'>Angsuran per Bulan</p>
                <p className='text-3xl font-bold text-red-600'>{formatCurrency(results.monthlyPayment)}</p>
              </div>
            </div>

            {/* Ini bagian yang akan nempel di bawah */}
            <div className='grid grid-cols-2 gap-4 mt-auto pt-6'>
              <div className='p-4 rounded-lg'>
                <p className='text-sm'>Total Bulan</p>
                <p className='text-xl font-semibold'>{results.totalMonths} bulan</p>
              </div>
              <div className='p-4 rounded-lg'>
                <p className='text-sm'>Total Bunga</p>
                <p className='text-xl font-semibold'>{formatCurrency(results.totalInterest)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Schedule */}
        <Card className='mt-8 rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
            <Calendar className='text-purple-600' />
            Jadwal Angsuran
          </h2>

          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-blue-500'>
                  <th className='border px-4 py-3 text-left'>Kontrak No</th>
                  <th className='border px-4 py-3 text-left'>Angsuran Ke</th>
                  <th className='border px-4 py-3 text-left'>Angsuran per Bulan</th>
                  <th className='border px-4 py-3 text-left'>Tanggal Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment: PaymentSchedule, index: number) => (
                  <tr key={index} className='hover:bg-gray-50 hover:text-black'>
                    <td className='border px-4 py-3'>AGR00001</td>
                    <td className='border px-4 py-3'>{payment.installmentNo}</td>
                    <td className='border px-4 py-3 font-medium'>{formatCurrency(payment.amount)}</td>
                    <td className='border px-4 py-3'>{payment.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 p-4 bg-yellow-50 rounded-lg'>
            <p className='text-sm text-yellow-800'>
              <strong>Catatan:</strong> Rumus perhitungan: (Pokok Utang + (Pokok Utang × Bunga)) ÷ Jangka Waktu
              <br />
              {`Suku bunga otomatis: <12 bulan = 12%, >12-24 bulan = 14%, >24 bulan = 16.5%`}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CarLoanCalculator
