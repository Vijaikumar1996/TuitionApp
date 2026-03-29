
import { useMemo, useState } from "react";
import DataTable from "../../components/common/DataTable";
import Select from "react-select";
import { usePayments } from "../../queries/usePayments";
import { useEnrollments } from "../../queries/useEnrollments";
import { useBatches } from "../../queries/useBatches";

export default function PaymentsPage() {
  function getCurrentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }

  // UI state
  const [month, setMonth] = useState(getCurrentMonth());
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");

  // 🔥 Fetch batches directly
  const { data: batchesData = [] } = useBatches();

  // Applied filters
  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    batchId: null,
    enrollmentId: null,
    mode: null,
    search: null,
  });

  // Enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useEnrollments();

  // 🔥 Batch options (from batches API)
  const batchOptions = useMemo(
    () =>
      batchesData.map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [batchesData]
  );

  // 🔥 Filter enrollments based on batch
  const filteredEnrollments = useMemo(() => {
    if (!selectedBatch) return enrollments;
    console.log("Filtering enrollments for batch:", selectedBatch);
    return enrollments.filter(
      (e) => String(e.batchId) === String(selectedBatch.value)
    );
  }, [enrollments, selectedBatch]);


  const enrollmentOptions = useMemo(
    () =>
      filteredEnrollments.map((e) => ({
        value: e.id,
        label: `${e.student_name} - ${e.course_name} (${e.batch_name})`,
      })),
    [filteredEnrollments]
  );

  // Payments API
  const { data = [], isLoading } = usePayments(filters);

  // Search handler
  const handleSearch = () => {
    setFilters({
      month,
      batchId: selectedBatch?.value || null,
      enrollmentId: selectedEnrollment?.value || null,
      mode: mode || null,
      search: search || null,
    });
  };

  // Reset handler
  const handleReset = () => {
    const currentMonth = getCurrentMonth();

    setMonth(currentMonth);
    setSelectedEnrollment(null);
    setMode("");
    setSearch("");

    setFilters({
      month: currentMonth,
      batchId: null,
      enrollmentId: null,
      mode: null,
      search: null,
    });
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "Student_Name",
        header: "Student",
      },
      {
        accessorKey: "Course_Name",
        header: "Course",
      },
      {
        accessorKey: "Batch_Name",
        header: "Batch",
      },
      {
        accessorKey: "Amount",
        header: "Amount",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "Payment_Date",
        header: "Date",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleDateString("en-IN"),
      },
      {
        accessorKey: "Payment_Mode",
        header: "Mode",
      },
      {
        accessorKey: "Month",
        header: "Fee Month",
        cell: ({ getValue }) =>
          getValue()
            ? new Date(getValue()).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })
            : "-",
      },
    ],
    []
  );

  if (isLoading) return <div className="p-5">Loading payments...</div>;

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Payments</h2>

        <div className="flex flex-wrap gap-3 items-end">

          {/* Month */}
          <div>
            <label className="text-xs text-gray-500">Month</label>
            <input
              type="month"
              value={month.slice(0, 7)}
              onChange={(e) => setMonth(e.target.value + "-01")}
              className="border px-3 py-2 rounded block"
            />
          </div>

          {/* Batch */}
          <div className="min-w-[200px]">
            <label className="text-xs text-gray-500">Batch</label>
            <Select
              options={batchOptions}
              value={selectedBatch}
              onChange={setSelectedBatch}
              isClearable
              placeholder="All Batches"
            />
          </div>

          {/* Enrollment */}
          <div className="min-w-[250px]">
            <label className="text-xs text-gray-500">Student / Course</label>
            <Select
              options={enrollmentOptions}
              value={selectedEnrollment}
              onChange={setSelectedEnrollment}
              isClearable
              isLoading={enrollmentsLoading}
              placeholder="All"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs text-gray-500">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border px-3 py-2 rounded block"
            >
              <option value="">All</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          {/* Search */}
          {/* <div>
            <label className="text-xs text-gray-500">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Student, course..."
              className="border px-3 py-2 rounded block w-[200px]"
            />
          </div> */}

          {/* Buttons */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>

        </div>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        rowClassName={() => "hover:bg-gray-50"}
      />
    </div>
  );
}
