"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, DeleteIcon, Edit2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { deleteCertificate, getCertificateTable } from "@/hooks/react-query-hooks"




export type CertificateTableType = {
  id: string;
  accountId: string;
  training_title: String,
  training_year: String,
  training_from: string,
  training_to: String,
  training_number_of_hours: string
  training_sponsored_by: string
  training_category: string
  training_international: string
  training_certificate: string
  training_certificate_url: string
  training_certificate_path: string
}

export const columns: ColumnDef<CertificateTableType>[] = [
  {
    accessorKey: 'training_title',
    header: 'Training Title',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_title}
        </div>
      )
    }
  },
  {
    accessorKey: 'Year',
    header: 'Year',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_year}
        </div>
      )
    }
  },
  {
    accessorKey: 'Date of Attendance',
    header: 'Date of Attendance (mm/dd/yyyy)',
    cell: ({ row }) => {
      return (
        <div>
          {format(new Date(row.original.training_from), 'MM/dd/yyyy')} - {format(new Date(row.original.training_to as string), 'MM/dd/yyyy')}
        </div>
      )
    }
  },
  {
    accessorKey: 'No of Hours',
    header: 'No. of Hours',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_number_of_hours}
        </div>
      )
    }
  },
  {
    accessorKey: 'Conducted / Sponsors',
    header: 'Conducted / Sponsors',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_sponsored_by}
        </div>
      )
    }
  },
  {
    accessorKey: 'Service Provider',
    header: 'Service Provider',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_sponsored_by}
        </div>
      )
    }
  },
  {
    accessorKey: 'Category',
    header: 'Category',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_category.split('_')[0] + " " + row.original.training_category.split('_')[1]}
        </div>
      )
    }
  },
  {
    accessorKey: 'International / Local',
    header: 'International / Local',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.training_international}
        </div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {


      const id = row.original.id

      const deleteCertificateMutation = deleteCertificate();

      const handleDelete = (id: string) => {
        deleteCertificateMutation.mutate(id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit2 className="h-4 w-4 text-blue-400/90" />
              <Link href={`/certificates/updateCertificate/${id}`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon className="h-4 w-4 text-red-400/90" />  Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function CertificateTable({ id }: { id: string | string[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const certificateTable = getCertificateTable(id)



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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })



  if (certificateTable.isLoading) {
    return (
      <div>Loading...</div>
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
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("training_title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("training_title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
