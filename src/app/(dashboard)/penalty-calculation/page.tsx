/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'

import { AlertTriangle, Calculator, FileText, CreditCard } from 'lucide-react'
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

interface PenaltyResult {
  kontrakNo: string
  clientName: string
  installmentNo: number
  angsuranPerBulan: number
  tanggalJatuhTempo: string
  hariKeterlambatan: number
  totalDenda: number
}

const PenaltyCalculationPage: React.FC = () => {
  const [checkDate, setCheckDate] = useState<string>('2024-08-14')
  const [clientName, setClientName] = useState<string>('SUGUS')
  const [penaltyRate, setPenaltyRate] = useState<number>(0.1)
  const [lastPaidInstallment, setLastPaidInstallment] = useState<number>(5)
  const [results, setResults] = useState<PenaltyResult[]>([])

  // Data dummy sesuai dengan soal
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

  const calculateDaysDifference = (date1: string, date2: string): number => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = d2.getTime() - d1.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  const calculatePenalty = (): void => {
    const checkDateObj = new Date(checkDate)

    // Filter kontrak berdasarkan nama client
    const filteredContracts = contracts.filter(
      contract => contract.clientName.toUpperCase() === clientName.toUpperCase()
    )

    const calculatedResults: PenaltyResult[] = []

    filteredContracts.forEach(contract => {
      // Filter jadwal angsuran yang belum dibayar dan sudah jatuh tempo
      const unpaidOverdueSchedules = installmentSchedules.filter(
        schedule =>
          schedule.kontrakNo === contract.kontrakNo &&
          schedule.angsuranKe > lastPaidInstallment && // Belum dibayar
          new Date(schedule.tanggalJatuhTempo) <= checkDateObj // Sudah jatuh tempo
      )

      unpaidOverdueSchedules.forEach(schedule => {
        const daysLate = calculateDaysDifference(schedule.tanggalJatuhTempo, checkDate)
        const penalty = Math.round(schedule.angsuranPerBulan * (penaltyRate / 100) * daysLate)

        if (daysLate > 0) {
          calculatedResults.push({
            kontrakNo: contract.kontrakNo,
            clientName: contract.clientName,
            installmentNo: schedule.angsuranKe,
            angsuranPerBulan: schedule.angsuranPerBulan,
            tanggalJatuhTempo: schedule.tanggalJatuhTempo,
            hariKeterlambatan: daysLate,
            totalDenda: penalty
          })
        }
      })
    })

    setResults(calculatedResults)
  }

  useEffect(() => {
    calculatePenalty()
  }, [checkDate, clientName, penaltyRate, lastPaidInstallment])

  const totalPenalty = results.reduce((sum, result) => sum + result.totalDenda, 0)
  const totalDaysLate = results.reduce((sum, result) => sum + result.hariKeterlambatan, 0)

  const sqlQuery = `
  SELECT 
      k.KONTRAK_NO,
      k.CLIENT_NAME,
      ja.ANGSURAN_KE as "INSTALLMENT NO",
      CASE 
          WHEN ja.TANGGAL_JATUH_TEMPO <= '${checkDate}' AND ja.ANGSURAN_KE > ${lastPaidInstallment} 
          THEN DATEDIFF('${checkDate}', ja.TANGGAL_JATUH_TEMPO)
          ELSE 0 
      END as "HARI KETERLAMBATAN",
      CASE 
          WHEN ja.TANGGAL_JATUH_TEMPO <= '${checkDate}' AND ja.ANGSURAN_KE > ${lastPaidInstallment} 
          THEN ROUND(ja.ANGSURAN_PER_BULAN * 0.001 * DATEDIFF('${checkDate}', ja.TANGGAL_JATUH_TEMPO), 0)
          ELSE 0 
      END as "TOTAL DENDA"
  FROM KONTRAK k
  JOIN JADWAL_ANGSURAN ja ON k.KONTRAK_NO = ja.KONTRAK_NO
  WHERE k.CLIENT_NAME = '${clientName}' 
      AND ja.ANGSURAN_KE > ${lastPaidInstallment} 
      AND ja.TANGGAL_JATUH_TEMPO <= '${checkDate}'
  ORDER BY ja.ANGSURAN_KE;
  `.trim()

  return (
    <div className='min-h-screen bg-gradient-to-br'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-2 flex items-center justify-center gap-3'>
            <AlertTriangle className='text-red-600' />
            Perhitungan Denda Keterlambatan
          </h1>
          <p>Menghitung denda untuk angsuran yang terlambat dibayar</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 mb-8'>
          {/* Parameter Input */}
          <Card className='rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
              <Calculator className='text-red-600' />
              Parameter Perhitungan
            </h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Nama Client</label>
                <input
                  type='text'
                  value={clientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                  placeholder='SUGUS'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Tanggal Pengecekan</label>
                <input
                  type='date'
                  value={checkDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckDate(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Angsuran Terakhir yang Dibayar</label>
                <input
                  type='number'
                  value={lastPaidInstallment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastPaidInstallment(Number(e.target.value))}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                  placeholder='5'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Pak Sugus sudah bayar sampai angsuran ke-{lastPaidInstallment} (Mei 2024)
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Denda per Hari (%)</label>
                <input
                  type='number'
                  step='0.01'
                  value={penaltyRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPenaltyRate(Number(e.target.value))}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                  placeholder='0.1'
                />
                <p className='text-sm text-gray-500 mt-1'>Default: 0.1% per hari dari angsuran yang belum dibayar</p>
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

        {/* Summary */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <Card className='rounded-xl shadow-lg p-6'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='text-red-500' size={24} />
              <div>
                <p className='text-sm'>Total Denda</p>
                <p className='text-2xl font-bold text-red-600'>{formatCurrency(totalPenalty)}</p>
              </div>
            </div>
          </Card>

          <Card className='rounded-xl shadow-lg p-6'>
            <div className='flex items-center gap-3'>
              <Calculator className='text-orange-500' size={24} />
              <div>
                <p className='text-sm'>Total Hari Terlambat</p>
                <p className='text-2xl font-bold text-orange-600'>{totalDaysLate} hari</p>
              </div>
            </div>
          </Card>

          <Card className='rounded-xl shadow-lg p-6'>
            <div className='flex items-center gap-3'>
              <CreditCard className='text-purple-500' size={24} />
              <div>
                <p className='text-sm'>Angsuran Tertunggak</p>
                <p className='text-2xl font-bold text-purple-600'>{results.length} angsuran</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Table */}
        <Card className='rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
            <AlertTriangle className='text-red-600' />
            Detail Denda Keterlambatan
          </h2>

          {results.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-blue-500'>
                    <th className='border px-4 py-3 text-left'>Kontrak No</th>
                    <th className='border px-4 py-3 text-left'>Client</th>
                    <th className='border px-4 py-3 text-left'>Angsuran Ke</th>
                    <th className='border px-4 py-3 text-left'>Angsuran/Bulan</th>
                    <th className='border px-4 py-3 text-left'>Jatuh Tempo</th>
                    <th className='border px-4 py-3 text-left'>Hari Terlambat</th>
                    <th className='border px-4 py-3 text-left'>Total Denda</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr
                      key={`${result.kontrakNo}-${result.installmentNo}`}
                      className='hover:bg-gray-50 hover:text-black'
                    >
                      <td className='border px-4 py-3'>{result.kontrakNo}</td>
                      <td className='border px-4 py-3'>{result.clientName}</td>
                      <td className='border px-4 py-3 text-center'>{result.installmentNo}</td>
                      <td className='border px-4 py-3'>{formatCurrency(result.angsuranPerBulan)}</td>
                      <td className='border px-4 py-3'>{result.tanggalJatuhTempo}</td>
                      <td className='border px-4 py-3 text-red-700 text-center'>{result.hariKeterlambatan} hari</td>
                      <td className='border px-4 py-3 text-red-700 text-center'>{formatCurrency(result.totalDenda)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className=''>
                    <td colSpan={5} className='px-4 py-4 text-right text-sm font-bold'>
                      Total:
                    </td>
                    <td className='px-4 py-4 text-center text-sm font-bold text-orange-700'>{totalDaysLate} hari</td>
                    <td className='px-4 py-4 text-sm font-bold text-red-700 text-center'>
                      {formatCurrency(totalPenalty)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className='text-center py-12'>
              <AlertTriangle className='mx-auto text-gray-400 mb-4' size={48} />
              <h3 className='text-lg font-semibold text-gray-600 mb-2'>Tidak ada denda keterlambatan</h3>
              <p className='text-gray-500'>Tidak ada angsuran yang terlambat untuk parameter yang dipilih.</p>
            </div>
          )}
        </Card>

        {/* Additional Information */}
        <div className='mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-yellow-800 mb-3'>Informasi Perhitungan</h3>
          <div className='text-sm text-yellow-700 space-y-2'>
            <p>
              <strong>Formula Denda:</strong> Angsuran per Bulan × {penaltyRate}% × Jumlah Hari Keterlambatan
            </p>
            <p>
              <strong>Kriteria Denda:</strong> Hanya angsuran yang sudah jatuh tempo dan belum dibayar
            </p>
            <p>
              <strong>Status Pembayaran:</strong> Angsuran ke-1 sampai ke-{lastPaidInstallment} sudah lunas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PenaltyCalculationPage
