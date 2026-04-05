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

  const [month, setMonth] = useState(getCurrentMonth());
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [mode, setMode] = useState("");

  const { data: batchesData = [] } = useBatches();

  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    batchId: null,
    enrollmentId: null,
    mode: null,
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } =
    useEnrollments();

  const batchOptions = useMemo(
    () =>
      batchesData.map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [batchesData]
  );

  const filteredEnrollments = useMemo(() => {
    if (!selectedBatch) return enrollments;
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

  const { data = [], isLoading } = usePayments(filters);

  const handleSearch = () => {
    setFilters({
      month,
      batchId: selectedBatch?.value || null,
      enrollmentId: selectedEnrollment?.value || null,
      mode: mode || null,
    });
  };

  const handleReset = () => {
    const currentMonth = getCurrentMonth();

    setMonth(currentMonth);
    setSelectedEnrollment(null);
    setSelectedBatch(null);
    setMode("");

    setFilters({
      month: currentMonth,
      batchId: null,
      enrollmentId: null,
      mode: null,
    });
  };

  const columns = useMemo(
    () => [
      { accessorKey: "Student_Name", header: "Student" },
      { accessorKey: "Course_Name", header: "Course" },
      { accessorKey: "Batch_Name", header: "Batch" },
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
      { accessorKey: "Payment_Mode", header: "Mode" },
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
    <div className="bg-white p-5 rounded-xl shadow w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Payments</h2>

        {/* ✅ FINAL GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3 items-end">

          {/* Month */}
          <div className="lg:col-span-1">
            <label className="text-xs text-gray-500">Month</label>
            <input
              type="month"
              value={month.slice(0, 7)}
              onChange={(e) => setMonth(e.target.value + "-01")}
              className="border pl-1 py-2 rounded w-full"
            />
          </div>

          {/* Batch */}
          <div className="lg:col-span-2">
            <label className="text-xs text-gray-500">Batch</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: "100%" }) }}
              options={batchOptions}
              value={selectedBatch}
              onChange={setSelectedBatch}
              isClearable
              placeholder="All Batches"
            />
          </div>

          {/* Student */}
          <div className="lg:col-span-2">
            <label className="text-xs text-gray-500">Student / Course</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: "100%" }) }}
              options={enrollmentOptions}
              value={selectedEnrollment}
              onChange={setSelectedEnrollment}
              isClearable
              isLoading={enrollmentsLoading}
              placeholder="All"
            />
          </div>

          {/* Mode */}
          <div className="lg:col-span-1">
            <label className="text-xs text-gray-500">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">All</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 mt-2 lg:mt-0">

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full border px-4 py-2 rounded"
            >
              Reset
            </button>

          </div>

        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        rowClassName={() => "hover:bg-gray-50"}
      />
    </div>
  );
}