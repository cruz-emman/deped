"use client"

import { useState } from 'react';
import * as XLSX from 'xlsx';
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
import { getDivisionTable, suspendDivisionUser } from "@/hooks/react-query-hooks"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableFacetedFilter } from '@/components/ui/react-table/data-table-faceted-filter';


interface User {
  id: string;
  // Add other user properties as needed
}

// Define the row type
interface Row {
  original: User;
}

// Define props type for the component
interface ActionCellProps {
  row: Row;
}

// Define the status options type

export type DivisonOffice = {
  id: string,
  status: string,
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
    school: string
    undergraduate_course: string;
    date_graduated: string
    doctorate_degree: string
    master_degree: string
  }
}

interface Account {
  id: number | string;
  first_name: string;
  middle_name: string;
  last_name: string;
  sex: string;
  email: string;
  position: string;
  classification: string;
  years_in_service: number;
  undergraduate_course: string;
  date_graduated: string;
  doctorate_degree: string;
  master_degree: string;
}

interface DivisionOfficeItem {
  account: Account;
  status: string;
}



export const ActionCell = ({ row }: ActionCellProps) => {
  const id = row.original.id;
  const [suspendReason, setSuspendReason] = useState('suspend');
  const suspendUser = suspendDivisionUser(id);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    setSuspendReason(value);
  };

  const onSubmit = () => {
    suspendUser.mutate(suspendReason);
    setIsOpen(false);
  };




  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`editUser/${id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild >
              <Link href={`accounts/certificates/${id}`}>
                View Certificates
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsOpen(true)}>
              <DialogTrigger>Status</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Make changes to your user&apos;s here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={handleChange} defaultValue={suspendReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Reasons</SelectLabel>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspend">Suspend</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="transfered">Transfer to other municipality</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={onSubmit}
              type="submit"
              disabled={suspendUser.isPending}
            >
              {suspendUser.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<DivisonOffice>[] = [
  {
    accessorKey: 'Name',
    header: 'Full Name',
    cell: ({ row }) => {
      const fullName = row.original?.account.first_name + " " + row.original?.account.middle_name + " " + row.original?.account.last_name || ""
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
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original.status}</div>

      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell  // Now we're using a proper component
  }
]


export function DivisionTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})


  const divisionOfficeData = getDivisionTable()

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

  const handleExportToExcel = () => {
    // Prepare data for export
    const exportData = divisionOfficeData.data?.map((item: DivisionOfficeItem) => ({
      'id': item.account.id,
      'Full Name': `${item.account.first_name} ${item.account.middle_name} ${item.account.last_name}`,
      'Sex': item.account.sex,
      'Email': item.account.email,
      'Position': item.account.position,
      'Classification': item.account.classification,
      'Years in Service': item.account.years_in_service,
      'Undergraduate Course': item.account.undergraduate_course,
      'Date Graduated': item.account.date_graduated,
      'Doctorate Degree': item.account.doctorate_degree,
      'Master Degree': item.account.master_degree,
      'Status': item.status
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData || []);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Division Office Users');

    // Export to Excel file
    XLSX.writeFile(workbook, `division_office_users_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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


        <Button
          variant="outline"
          className="ml-2"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown />
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
