import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import DataTable from "../../components/common/DataTable";
import { useFees, usePayFee } from "../../queries/useFees";
import PayFee from "./PayFee";
import Select from "react-select";
import { useEnrollments } from "../../queries/useEnrollments";
import { useBatches } from "../../queries/useBatches";
import { ChatIcon } from "../../icons";
import toast from "react-hot-toast";

export default function FeesPage() {
  const location = useLocation();

  // 🔥 Prevent double execution
  const hasTriggered = useRef(false);

  function getCurrentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }

  const [month, setMonth] = useState(getCurrentMonth());
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [status, setStatus] = useState("pending");

  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    enrollmentId: null,
    batchId: null,
    status: "pending",
  });

  const [selectedFee, setSelectedFee] = useState(null);

  // 🔥 Fetch batches
  const { data: batchesData = [] } = useBatches();

  // 🔥 Fetch enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } =
    useEnrollments();

  // 🔥 Batch options
  const batchOptions = useMemo(
    () =>
      batchesData.map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [batchesData]
  );

  // 🔥 AUTO SELECT BATCH FROM DASHBOARD (FIXED WITH useRef)
  useEffect(() => {
    if (
      !hasTriggered.current &&
      location.state?.batchId &&
      batchOptions.length > 0
    ) {
      hasTriggered.current = true; // ✅ prevent double run

      const batch = batchOptions.find(
        (b) => String(b.value) === String(location.state.batchId)
      );

      if (batch) {
        setSelectedBatch(batch);

        setFilters((prev) => ({
          ...prev,
          batchId: batch.value,
          status: "pending",
        }));

        toast.success(`Showing pending for ${location.state.batchName}`);

        window.scrollTo({ top: 300, behavior: "smooth" });
      }
    }
  }, [location.state, batchOptions]);

  // 🔥 Filter enrollments
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

  useEffect(() => {
    setSelectedEnrollment(null);
  }, [selectedBatch]);

  const { data = [], isLoading } = useFees(filters);
  const payMutation = usePayFee(filters.month);

  const handleSearch = () => {
    setFilters({
      month,
      enrollmentId: selectedEnrollment?.value || null,
      batchId: selectedBatch?.value || null,
      status: status || null,
    });
  };

  const handleReset = () => {
    const currentMonth = getCurrentMonth();

    setMonth(currentMonth);
    setSelectedBatch(null);
    setSelectedEnrollment(null);
    setStatus("pending");

    setFilters({
      month: currentMonth,
      enrollmentId: null,
      batchId: null,
      status: "pending",
    });
  };

  const getBulkMessage = (data) => {
    const pending = data.filter((f) => f.Balance > 0);

    if (pending.length === 0) return "";

    const month = new Date(pending[0].Month).toLocaleDateString("ta-IN", {
      month: "long",
      year: "numeric",
    });

    const studentList = pending
      .map((f, index) => {
        const name = f.Student_Name_Tamil
          ? `${f.Student_Name_Tamil} (${f.Student_Name})`
          : f.Student_Name;

        return `${index + 1}. ${name} - ₹${f.Balance}`;
      })
      .join("\n");

    return `அனைத்து பெற்றோருக்கும் வணக்கம்,

${month} மாதத்திற்கான கட்டணம் கீழ்க்கண்ட மாணவர்களிடம் இன்னும் நிலுவையில் உள்ளது:

${studentList}

தயவுசெய்து விரைவில் கட்டணம் செலுத்தவும்.

நன்றி 🙏`;
  };

  const columns = useMemo(
    () => [
      { accessorKey: "Student_Name", header: "Student" },
      { accessorKey: "Batch_Name", header: "Batch" },
      {
        accessorKey: "Month",
        header: "Month",
        cell: ({ row }) =>
          new Date(row.original.Month).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),
      },
      {
        accessorKey: "Amount_Due",
        header: "Due",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "Amount_Paid",
        header: "Paid",
        cell: ({ getValue }) => (
          <span className="text-green-600 font-medium">
            ₹{getValue()}
          </span>
        ),
      },
      {
        accessorKey: "Balance",
        header: "Balance",
        cell: ({ getValue }) => (
          <span className="text-red-600 font-semibold">
            ₹{getValue()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const f = row.original;

          const handleWhatsApp = () => {
            const phone = f.Parent_Phone;

            if (!phone) {
              toast.error("Phone number not available");
              return;
            }

            const message = `வணக்கம் ${f.Student_Name},

${new Date(f.Month).toLocaleDateString("ta-IN", {
              month: "long",
              year: "numeric",
            })} மாதத்திற்கான கட்டணம் இன்னும் செலுத்தப்படவில்லை.

செலுத்த வேண்டிய தொகை: ₹${f.Balance}

நன்றி 🙏`;

            const url = `https://wa.me/91${phone}?text=${encodeURIComponent(
              message
            )}`;

            window.open(url, "_blank");
          };

          return (
            f.Balance > 0 && (
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedFee(f)}
                  className="text-blue-600 hover:underline"
                >
                  Pay
                </button>

                <div className="mx-3 h-4 w-px bg-gray-300"></div>

                <button
                  onClick={handleWhatsApp}
                  className="text-green-600 hover:underline"
                >
                  <ChatIcon className="fill-gray-500 size-5" />
                </button>
              </div>
            )
          );
        },
      },
    ],
    []
  );

  if (isLoading) return <div className="p-5">Loading fees...</div>;

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Fees</h2>

          <button
            onClick={() => {
              const message = getBulkMessage(data);

              if (!message) {
                toast.error("No pending students");
                return;
              }

              navigator.clipboard.writeText(message);
              toast.success(
                "Message copied! Paste in selected batch WhatsApp group."
              );
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Copy Pending Message
          </button>
        </div>

        {/* Filters */}
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

          {/* Status */}
          <div className="lg:col-span-1">
            <label className="text-xs text-gray-500">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="">All</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-1">
            <button
              onClick={handleReset}
              className="w-full border px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>

        </div>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        pinnedColumns={{
          left: ["Student_Name"],
          right: ["actions"],
        }}
        rowClassName={(row) =>
          row.original.Balance > 0 ? "bg-red-50" : "bg-green-50"
        }
      />

      {/* Modal */}
      {selectedFee && (
        <PayFee
          fee={selectedFee}
          loading={payMutation.isPending}
          onClose={() => setSelectedFee(null)}
          onSubmit={async (payload) => {
            await payMutation.mutateAsync(payload);
            setSelectedFee(null);
          }}
        />
      )}
    </div>
  );
}