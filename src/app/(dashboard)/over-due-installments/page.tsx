/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useState, useEffect } from 'react'

import { Calendar, CreditCard, Search, FileText } from 'lucide-react'
import { Card } from '@mui/material'

interface Contract {
  kontrakNo: string
  clientName: string
  otr: number
}

interface InstallmentSchedule {
  kontrakNo: string
  angsuranKe: number
  angsuranPerBulan: number
  tanggalJatuhTempo: string
}

interface OverdueResult {
  kontrakNo: string
  clientName: string
  totalAngsuranJatuhTempo: number
  jumlahAngsuranJatuhTempo: number
}

const OverdueInstallmentsPage: React.FC = () => {
  const [checkDate, setCheckDate] = useState<string>('2024-08-14')
  const [clientName, setClientName] = useState<string>('SUGUS')
  const [results, setResults] = useState<OverdueResult[]>([])
  const [detailSchedule, setDetailSchedule] = useState<InstallmentSchedule[]>([])

  const contracts: Contract[] = [{ kontrakNo: 'AGR00001', clientName: 'SUGUS', otr: 240000000 }]

  const installmentSchedules: InstallmentSchedule[] = [
    { kontrakNo: 'AGR00001', angsuranKe: 1, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-01-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 2, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-02-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 3, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-03-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 4, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-04-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 5, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-05-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 6, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-06-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 7, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-07-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 8, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-08-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 9, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-09-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 10, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-10-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 11, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-11-25' },
    { kontrakNo: 'AGR00001', angsuranKe: 12, angsuranPerBulan: 12907000, tanggalJatuhTempo: '2024-12-25' }
  ]

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateOverdueInstallments = (): void => {
    const checkDateObj = new Date(checkDate)

    // Filter kontrak berdasarkan nama client
    const filteredContracts = contracts.filter(
      contract => contract.clientName.toUpperCase() === clientName.toUpperCase()
    )

    const calculatedResults: OverdueResult[] = []

    filteredContracts.forEach(contract => {
      // Filter jadwal angsuran yang sudah jatuh tempo
      const overdueSchedules = installmentSchedules.filter(
        schedule => schedule.kontrakNo === contract.kontrakNo && new Date(schedule.tanggalJatuhTempo) <= checkDateObj
      )

      if (overdueSchedules.length > 0) {
        const totalAmount = overdueSchedules.reduce((sum, schedule) => sum + schedule.angsuranPerBulan, 0)

        calculatedResults.push({
          kontrakNo: contract.kontrakNo,
          clientName: contract.clientName,
          totalAngsuranJatuhTempo: totalAmount,
          jumlahAngsuranJatuhTempo: overdueSchedules.length
        })
      }
    })

    setResults(calculatedResults)

    // Set detail schedule untuk ditampilkan
    const overdueDetail = installmentSchedules.filter(schedule => {
      const matchingContract = filteredContracts.find(c => c.kontrakNo === schedule.kontrakNo)

      return matchingContract && new Date(schedule.tanggalJatuhTempo) <= checkDateObj
    })

    setDetailSchedule(overdueDetail)
  }

  useEffect(() => {
    calculateOverdueInstallments()
  }, [checkDate, clientName])

  const sqlQuery = `
    SELECT 
      k.KONTRAK_NO,
      k.CLIENT_NAME,
      SUM(ja.ANGSURAN_PER_BULAN) as "TOTAL ANGSURAN JATUH TEMPO"
  FROM KONTRAK k
  JOIN JADWAL_ANGSURAN ja ON k.KONTRAK_NO = ja.KONTRAK_NO
  WHERE k.CLIENT_NAME = 'SUGUS' 
      AND ja.TANGGAL_JATUH_TEMPO <= '2024-08-14'
  GROUP BY k.KONTRAK_NO, k.CLIENT_NAME;
  `.trim()

  return (
    <div className='min-h-screen bg-gradient-to-br'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2 flex items-center justify-center gap-3'>
            <Calendar className='text-purple-600' />
            Total Angsuran Jatuh Tempo
          </h1>
          <p>Menampilkan total angsuran yang sudah jatuh tempo per tanggal tertentu</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 mb-8'>
          {/* Filter Section */}
          <Card className='rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
              <Search className='text-purple-600' />
              Filter Pencarian
            </h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Nama Client</label>
                <input
                  type='text'
                  value={clientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
                  className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='SUGUS'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Tanggal Pengecekan</label>
                <input
                  type='date'
                  value={checkDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckDate(e.target.value)}
                  className='w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>
            </div>
          </Card>

          {/* SQL Query Display */}
          <Card className='rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
              <FileText className='text-blue-600' />
              SQL Query
            </h2>
            <div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto'>
              <pre>{sqlQuery}</pre>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <Card className='rounded-2xl shadow-xl p-8 mb-8'>
          <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
            <CreditCard className='text-green-600' />
            Hasil Pencarian
          </h2>

          {results.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-blue-500'>
                    <th className='border px-6 py-4 text-left font-semibold'>KONTRAK NO</th>
                    <th className='border px-6 py-4 text-left font-semibold'>CLIENT NAME</th>
                    <th className='border px-6 py-4 text-left font-semibold'>TOTAL ANGSURAN JATUH TEMPO</th>
                    <th className='border px-6 py-4 text-left font-semibold'>JUMLAH ANGSURAN</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className='hover:bg-gray-50 hover:text-black'>
                      <td className='border px-6 py-4 font-medium'>{result.kontrakNo}</td>
                      <td className='border px-6 py-4'>{result.clientName}</td>
                      <td className='border px-6 py-4 font-bold text-red-600'>
                        {formatCurrency(result.totalAngsuranJatuhTempo)}
                      </td>
                      <td className='border px-6 py-4 text-center'>{result.jumlahAngsuranJatuhTempo} angsuran</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='text-center py-8'>Tidak ada data yang ditemukan</div>
          )}
        </Card>

        {/* Detail Schedule */}
        {detailSchedule.length > 0 && (
          <Card className='rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6'>Detail Angsuran yang Sudah Jatuh Tempo</h2>

            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-blue-500'>
                    <th className='border px-4 py-3 text-left'>Kontrak No</th>
                    <th className='border px-4 py-3 text-left'>Angsuran Ke</th>
                    <th className='border px-4 py-3 text-left'>Angsuran per Bulan</th>
                    <th className='border px-4 py-3 text-left'>Tanggal Jatuh Tempo</th>
                    <th className='border px-4 py-3 text-left'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSchedule.map((schedule, index) => {
                    const isOverdue = new Date(schedule.tanggalJatuhTempo) <= new Date(checkDate)

                    return (
                      <tr key={index} className={'hover:bg-gray-50 hover:text-black'}>
                        <td className='border px-4 py-3'>{schedule.kontrakNo}</td>
                        <td className='border px-4 py-3 text-center'>{schedule.angsuranKe}</td>
                        <td className='border px-4 py-3 font-medium'>{formatCurrency(schedule.angsuranPerBulan)}</td>
                        <td className='border px-4 py-3'>
                          {new Date(schedule.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                        </td>
                        <td className='border px-4 py-3'>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isOverdue ? 'Jatuh Tempo' : 'Belum Jatuh Tempo'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className='mt-6 p-4 bg-yellow-50 rounded-lg'>
              <p className='text-sm text-yellow-800'>
                <strong>Catatan:</strong> Data menampilkan semua angsuran yang sudah jatuh tempo sampai dengan tanggal{' '}
                {new Date(checkDate).toLocaleDateString('id-ID')}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default OverdueInstallmentsPage
