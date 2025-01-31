"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, DeleteIcon, Edit2, MoreHorizontal } from "lucide-react"
import Filter from "@/components/ui/react-table/Filter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { format, isAfter, isBefore, parseISO } from "date-fns"
import { deleteCertificate, getAccountsCertificatesTable, getCertificateTable } from "@/hooks/react-query-hooks"
import { useParams } from 'next/navigation'
import Loading from "@/app/loading"
import { useEffect, useMemo, useState } from "react"


interface Props {
  from: Date;
  to: Date;
}

export type CertificateTableType = {
  id: string;
  accountId: string;
  training_title: string,
  training_year: string,
  training_from: string,
  training_to: string,
  training_number_of_hours: string
  training_sponsored_by: string
  training_name_of_provider: string
  training_category: string
  training_international: string
  training_certificate: string
  training_certificate_url: string
  training_certificate_path: string
}




function AccountsCertificateTable({ from, to }: Props) {
  const params = useParams()
  const certificateTable = getAccountsCertificatesTable(params.id, from, to)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'training_title', // Correct: Matches the property name
        header: 'Training Title',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_year',  // Correct: Matches the property name
        header: 'Year',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_from',
        header: 'From',
        cell: ({ row }) => format(parseISO(row.original.training_from), 'MMM dd, yyyy'), // Parse and format in cell
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true; // Show all rows if filter is empty

          const rowDate = parseISO(row.original.training_from);
          const filterDate = parseISO(filterValue);

          return rowDate >= filterDate; // Example: filter for dates greater than or equal to the input
        },
      },
      {
        accessorKey: 'training_to',
        header: 'End',
        cell: ({ row }) => format(parseISO(row.original.training_to), 'MMM dd, yyyy'), // Parse and format
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true; // Show all rows if filter is empty

          const rowDate = parseISO(row.original.training_to);
          const filterDate = parseISO(filterValue);

          return rowDate <= filterDate; // Example: filter for dates less than or equal to the input
        },
      },

      {
        accessorKey: 'training_number_of_hours', // Correct: Matches the property name
        header: 'No. of Hours',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_sponsored_by',  // Correct: Matches the property name
        header: 'Conducted / Sponsors',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_name_of_provider', // Correct: Matches the property name
        header: 'Service Provider',
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_category',  // Correct: Matches the property name
        header: 'Category',
        cell: ({ row }) => row.original.training_category?.split('_')[0], // Safe split
        enableColumnFilter: true,
      },
      {
        accessorKey: 'training_international', // Correct: Matches the property name
        header: 'International / Local',
        enableColumnFilter: true,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => { /* ... your actions code ... */ },
      },
    ], []
  );


  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})



  const table = useReactTable({
    data: certificateTable.data || [],
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })



  if (certificateTable.isLoading) {
    return (
      <Loading />
    )
  }

  if (certificateTable.error) {
    return (
      <div>Error.</div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filters <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-secondary p-1"
                      key={header.id}

                    >
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div className="grid place-content-center">
                          <Filter
                            column={header.column}

                          />
                        </div>
                      ) : null}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>


  )
}

export default AccountsCertificateTable
