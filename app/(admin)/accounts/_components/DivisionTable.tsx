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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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


export type DivisonOffice = {
  id: string,
  account: {
    fullname: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    sex: string;
    affiliation: string;
    position: string;
    classification: string;
    years_in_service: string;
    school: String
    undergraduate_course: String;
    date_graduated: String
    doctorate_degree: String
    master_degree: String
  }
}

export const columns: ColumnDef<DivisonOffice>[] = [
  {
    accessorKey: 'Name',
    header: 'Full Name',
    cell: ({ row }) => {
      let fullName = row.original?.account.first_name + " " + row.original?.account.middle_name + " " + row.original?.account.last_name || ""
      return (
        <div className="capitalize">{fullName || ""}</div>
      )
    }
  },
  {
    accessorKey: 'Sex',
    header: 'Sex',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.sex || ""}</div>

      )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: 'Position',
    header: 'Position',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.position || ""}</div>

      )
    }
  },
  {
    accessorKey: 'classification',
    header: 'Classification',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.classification || ""}</div>

      )
    }
  },
  {
    accessorKey: 'Years in Service',
    header: 'Years in Service',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.years_in_service || ""}</div>

      )
    }
  },
  {
    accessorKey: 'Undergraudate Course',
    header: 'Undergraduate Course',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.undergraduate_course || ""}</div>

      )
    }
  },
  {
    accessorKey: 'date graduated',
    header: 'Date Graduated',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.date_graduated || ""}</div>

      )
    }
  },
  {
    accessorKey: 'doctorate degree',
    header: 'Doctorate',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.doctorate_degree || ""}</div>

      )
    }
  },
  {
    accessorKey: 'master degree',
    header: 'Master Degree',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.account.master_degree || ""}</div>

      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {


      const id = row.original.id

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
            <DropdownMenuItem
            asChild
            >
              <Link href={`editUser/${id}`}>
                Edit
              </Link>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DivisionTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})


  const divisionOfficeData = useQuery({
    queryKey: ['divisionOfficeData'],
    queryFn: () => fetch('/api/do_table').then((res) => res.json())
  })


  const table = useReactTable({
    data: divisionOfficeData.data || [],
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

  if (divisionOfficeData.isPending) return 'Loading...'

  if (divisionOfficeData.error) return 'An error has occurred: ' + divisionOfficeData.error.message

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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

    // <></>
  )
}
