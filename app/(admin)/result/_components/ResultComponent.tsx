'use client'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { toast } from '@/hooks/use-toast'
import { differenceInDays, endOfMonth, startOfMonth } from 'date-fns'
import React, { useState } from 'react'

const ResultComponent = () => {
  const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  })


  return (
    <div className='flex flex-col relative mx-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <DateRangePicker
        onUpdate={(values) => {
          const { from, to } = values.range;
          // We update the date range only if both dates are set

          if (!from || !to) return;
          if (differenceInDays(to, from) > 90) {
            toast({
              title: `The selected date range is too big. Max allowed range is ${90} days!`
            });
            console.log(`The selected date range is too big. Max allowed range is ${90} days!`)
            return;
          }
          setDateRange({ from, to });
        }}
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        align="start"
        locale="en-GB"
        showCompare={false}
      />
      </div>
    </div>
  )
}

export default ResultComponent