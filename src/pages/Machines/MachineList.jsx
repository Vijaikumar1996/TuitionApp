import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useMachines } from "../../queries/useMachines";
import EditMachine from "./EditMachine";
import DataTable from "../../components/common/DataTable";

export default function MachineList() {
  const navigate = useNavigate();

  const { data: machinesData = [], isLoading } = useMachines();
  console.log("Machines data:", machinesData);
  const [editMachine, setEditMachine] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMachines = useMemo(() => {
    return machinesData.filter((machine) =>
      machine?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, machinesData]);

  const pinnedColumns = useMemo(() => ({
    left: ["name"],
  }), []);

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Machine Name",
      cell: (info) => (
        <span className="font-medium">{info.getValue()}</span>
      )
    },
    {
      accessorKey: "language",
      header: "Language",
      cell: (info) => (
        <span className="text-gray-600">{info.getValue()}</span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${status === "active"
                ? "bg-green-100 text-green-700"
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
          onClick={() => setEditMachine(row.original)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      )
    }
  ], []);

  if (isLoading) {
    return <div className="p-5">Loading machines...</div>;
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Machines</h2>

        <button
          onClick={() => navigate("/machine/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Machine
        </button>
      </div>

      {/* Search (optional) */}
      {/* 
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search machines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div> 
      */}

      {/* Table */}
      <DataTable
        data={filteredMachines}
        columns={columns}
        pageSize={10}
        pinnedColumns={pinnedColumns}
        emptyMessage="No machines found"
      />

      {/* Edit Modal */}
      {editMachine && (
        <EditMachine
          machine={editMachine}
          onClose={() => setEditMachine(null)}
        />
      )}
    </div>
  );
}