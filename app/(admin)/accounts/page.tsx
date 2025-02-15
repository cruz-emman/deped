'use client'

import React, { useState } from 'react'
import { DivisionTable } from './_components/DivisionTable'
import { SchoolTable } from './_components/SchoolTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCurrentRole } from '@/hooks/user-role'
import { useCurrentAffiliation } from '@/hooks/user-affiliation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'
import { createBulkUser } from '@/app/actions/users'
import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



interface ExcelRow {
  email?: string;
  password?: string;
  role?: string;
  affiliation?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  school_assigned?: string
  
}

interface ProcessedRow {
  email: string | null;
  password: string | null;
  role: string;
  affiliation: string;
  first_name: string | undefined;
  middle_name: string | undefined;
  last_name: string | undefined;
  school_assigned?: string | undefined

}


const Accounts = () => {

  const role = useCurrentRole()
  const affiliation = useCurrentAffiliation()


  const [file, setFile] = useState<File | null>(null)



  const { mutate: importUsers, isPending } = useMutation({
    mutationFn: async (jsonData: ProcessedRow[]) => {
      //@ts-expect-error
      await createBulkUser(jsonData);
    },
    onSuccess: () => {
      toast({
        title: 'Data imported successfully!'
      }),
        window.location.reload();
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'An error occurred while importing data.'
      });
    },
  });

  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: 'Please select a file first.'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const workSheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON and ensure plain objects
        const jsonData: ProcessedRow[] = (XLSX.utils.sheet_to_json(workSheet) as ExcelRow[]).map((row) => ({
          email: row.email || null,
          password: row.password || null,
          role: row.role || 'teacher',
          affiliation: row.affiliation || 'school',
          first_name: row.first_name,
          middle_name: row.middle_name,
          last_name: row.last_name,
          school_assigned: row.school_assigned
        }))

        // Call the server function
        importUsers(jsonData); // Trigger the mutation
      }
    };
    reader.readAsBinaryString(file); // Start reading the file
  };


  return (
    <div className='px-16 space-y-10 '>

      {role !== 'school_admin' && role !== 'teacher' && (
        <Button asChild>
          <Link href={'/newUserByAdmin'}>
            Add new user
          </Link>
        </Button>
      )}

      {role === 'division_office_admin' && (

        <>


          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Import Excel</Label>
            <Input
              id="picture"
              type="file"
              accept='.xlsx,.xls,.csv'
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <Button onClick={handleFileUpload} disabled={isPending}>
            {isPending ? 'Importing...' : 'Import Data'}
          </Button>
        </>

      )}



      {/* <Button onClick={previewData}>
          Preview data
        </Button> */}

      {affiliation === 'division_office' && (
        <Tabs defaultValue="division_office" className="w-full">
          <TabsList>
            <TabsTrigger value="division_office">Division Office</TabsTrigger>
            <TabsTrigger value="school">School</TabsTrigger>
          </TabsList>
          <TabsContent value="division_office">
            <DivisionTable />
          </TabsContent>
          <TabsContent value="school"><SchoolTable /></TabsContent>
        </Tabs>

      )}



      {affiliation === 'school' && (
        <SchoolTable />
      )}
    </div>
  )
}

export default Accounts