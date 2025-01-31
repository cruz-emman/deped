'use client'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns'
import React, { useState } from 'react'
import AccountsCertificateTable from './_components/TableCertificate'

const Certificate = () => {
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    })
    return (
        <div className='flex flex-col relative mx-4'>
            <DateRangePicker
                initialDateFrom={dateRange.from}
                initialDateTo={dateRange.to}
                showCompare={false}
                onUpdate={(values) => {
                    const { from, to } = values.range;
                    // We update the date range only if both dates are set

                    if (!from || !to) return;

                    setDateRange({ from, to });
                }}
            />

            <AccountsCertificateTable
                from={dateRange.from} to={dateRange.to}
            />
        </div>
    )
}

export default Certificate