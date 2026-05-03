import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useInstitutes } from "../../queries/useInstitutes";
import EditInstitute from "./EditInstitute";
import DataTable from "../../components/common/DataTable";

export default function InstituteList() {
    const navigate = useNavigate();

    const { data: institutesData = [], isLoading } = useInstitutes();

    console.log("Institutes Data:", institutesData);

    const [search, setSearch] = useState("");
    const [editInstitute, setEditInstitute] = useState(null);

    const filteredInstitutes = useMemo(() => {
        return institutesData.filter((inst) =>
            inst.Institute_Name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, institutesData]);

    const columns = useMemo(() => [
        {
            accessorKey: "Institute_Name",
            header: "Institute Name"
        },
        {
            accessorKey: "Mobile_No",
            header: "Mobile"
        },
        {
            accessorKey: "Email",
            header: "Email"
        },
        {
            accessorKey: "Institute_Type",
            header: "Type"
        },
        // {
        //     accessorKey: "status",
        //     header: "Status",
        //     cell: ({ row }) => {
        //         const status = row.original.status;

        //         return (
        //             <span
        //                 className={`px-2 py-1 text-xs rounded-full ${status === "Active"
        //                     ? "bg-green-100 text-green-700"
        //                     : "bg-gray-100 text-gray-600"
        //                     }`}
        //             >
        //                 {status}
        //             </span>
        //         );
        //     }
        // },
        // {
        //     id: "actions",
        //     header: "Actions",
        //     cell: ({ row }) => (
        //         <button
        //             onClick={() => setEditInstitute(row.original)}
        //             className="text-blue-600 hover:underline"
        //         >
        //             Edit
        //         </button>
        //     )
        // }
    ], []);

    const pinnedColumns = useMemo(() => ({
        left: ["Institute_Name"],
    }), []);

    return (
        <div className="bg-white p-5 rounded-xl shadow">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Institutes</h2>

                <button
                    onClick={() => navigate("/institute/create")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Add Institute
                </button>
            </div>

            {/* Optional Search */}
            {/* 
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search institutes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div> 
      */}

            {/* Table */}
            <DataTable
                data={filteredInstitutes}
                columns={columns}
                pageSize={10}
                pinnedColumns={pinnedColumns}
                emptyMessage="No institutes found"
            />

            {editInstitute && (
                <EditInstitute
                    institute={editInstitute}
                    onClose={() => setEditInstitute(null)}
                />
            )}

        </div>
    );
}