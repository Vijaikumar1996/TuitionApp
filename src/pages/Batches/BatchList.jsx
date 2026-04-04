import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useBatches } from "../../queries/useBatches";
import EditBatch from "./EditBatch";
import DataTable from "../../components/common/DataTable";

export default function BatchList() {
  const navigate = useNavigate();

  const { data: batchesData = [], isLoading } = useBatches();

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

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Batch Name",
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      )
    },
    {
      accessorKey: "course_name",
      header: "Course",
      cell: (info) => (
        <span className="text-gray-600">{info.getValue()}</span>
      )
    },
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
  ], []);

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