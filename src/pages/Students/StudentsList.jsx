import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

import {
  PlusIcon
} from "../../icons";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function StudentsTable() {
  // ✅ Dummy Data
  const data = useMemo(
    () => [
      {
        id: 1,
        name: "Arun",
        phone: "9876543210",
        batch: "Morning",
        feeType: "Monthly",
        balance: 1000,
        status: "Active",
      },
      {
        id: 2,
        name: "Divya",
        phone: "9876500000",
        batch: "Evening",
        feeType: "Yearly",
        balance: 0,
        status: "Completed",
      },
      {
        id: 3,
        name: "Kumar",
        phone: "9876511111",
        batch: "Morning",
        feeType: "Monthly",
        balance: 500,
        status: "Inactive",
      },
      {
        id: 4,
        name: "Priya",
        phone: "9876522222",
        batch: "Evening",
        feeType: "One-Time",
        balance: 0,
        status: "Active",
      },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ Custom filtering
  const filteredData = useMemo(() => {
    return data.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        student.phone.includes(globalFilter);

      const matchesBatch = batchFilter
        ? student.batch === batchFilter
        : true;

      const matchesStatus = statusFilter
        ? student.status === statusFilter
        : true;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [data, globalFilter, batchFilter, statusFilter]);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "Batch",
        accessorKey: "batch",
      },
      {
        header: "Fee Type",
        accessorKey: "feeType",
      },
      {
        header: "Balance",
        accessorKey: "balance",
        cell: ({ row }) => {
          const value = row.original.balance;
          return (
            <span
              className={`font-medium ${value > 0 ? "text-red-600" : "text-green-600"
                }`}
            >
              ₹ {value}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;

          const badgeStyle =
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700";

          return (
            <span className={`px-2 py-1 text-xs rounded-full ${badgeStyle}`}>
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const navigate = useNavigate();

  return (
    <>
      {/* <PageBreadcrumb pageTitle="Students List" /> */}
      <div className="bg-white p-5 rounded-xl shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Students</h2>

          <button
            onClick={() => navigate("/student/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Student
          </button>
        </div>
        {/* <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Students
          </h3>

          <button onClick={() => navigate('/student/create')} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <PlusIcon />
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </div> */}
        <div className="max-w-full overflow-x-auto">


          {/* 🔍 Controls */}
          <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="border px-3 py-2 rounded w-64"
            />

            <div className="flex gap-4">

              {/* Batch Filter */}
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">All Batches</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>
          </div>

          {/* 📋 Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-4 py-3 text-left cursor-pointer"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell ??
                          cell.column.columnDef.accessorKey,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </>
  );
}