import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useBatches } from "../../queries/useBatches";
import EditBatch from "./EditBatch";
import DataTable from "../../components/common/DataTable";
import { useSelector } from "react-redux";

export default function BatchList() {
  const navigate = useNavigate();

  const { data: batchesData = [], isLoading } = useBatches();
  const { user } = useSelector((state) => state.auth);
  const isTypewriting = user?.InstituteType === "Typewriting";

  const [editBatch, setEditBatch] = useState(null);
  const [search, setSearch] = useState("");

  const filteredBatches = useMemo(() => {
    return batchesData.filter((batch) =>
      batch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, batchesData]);

  const pinnedColumns = useMemo(() => ({
    left: ["name"],
  }), []);

  const machineColumn = {
    id: "availability",
    header: "Available Machines",
    cell: ({ row }) => {
      const eng = row.original.english_available ?? 0;
      const tam = row.original.tamil_available ?? 0;
      const batchId = row.original.id;

      const getStyle = (count) =>
        count > 0
          ? "bg-green-100 text-green-700 cursor-pointer"
          : "bg-red-100 text-red-600 cursor-not-allowed";

      const handleClick = (language, count) => {
        if (count === 0) return; // ❌ prevent click if full

        navigate(
          `/enrollment/create?batchId=${batchId}&language=${language}`
        );
      };

      return (
        <div className="flex gap-2 text-xs">
          <span
            onClick={() => handleClick("English", eng)}
            className={`px-2 py-1 rounded ${getStyle(eng)}`}
          >
            Eng: <span className="font-bold">{eng}</span>
          </span>

          <span
            onClick={() => handleClick("Tamil", tam)}
            className={`px-2 py-1 rounded ${getStyle(tam)}`}
          >
            Tam: <span className="font-bold">{tam}</span>
          </span>
        </div>
      );
    },
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "name",
        header: "Batch Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue()}</span>
        )
      },
      // 👇 Inject here conditionally
      ...(isTypewriting ? [machineColumn] : []),
      {
        id: "timing",
        header: "Timing",
        cell: ({ row }) => {
          const start = row.original.start_time?.slice(0, 5);
          const end = row.original.end_time?.slice(0, 5);

          return (
            <span className="text-gray-600">
              {start} - {end}
            </span>
          );
        }
      },



      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          return (
            <span
              className={`px-2 py-1 text-xs rounded-full ${status === "Active"
                ? "bg-green-100 text-green-700"
                : status === "Completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {status}
            </span>
          );
        }
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => setEditBatch(row.original)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        )
      }
    ];

    return baseColumns;
  }, [isTypewriting]);

  if (isLoading) {
    return <div className="p-5">Loading batches...</div>;
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Batches</h2>

        <button
          onClick={() => navigate("/batch/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Batch
        </button>
      </div>

      {/* Search */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div> */}

      {/* Table */}
      <DataTable
        data={filteredBatches}
        columns={columns}
        pageSize={10}
        pinnedColumns={pinnedColumns}
        emptyMessage="No batches found"
      />

      {/* Edit Modal */}
      {editBatch && (
        <EditBatch
          batch={editBatch}
          courses={[]}
          onClose={() => setEditBatch(null)}
        />
      )}

    </div>
  );
}