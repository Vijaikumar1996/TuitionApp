import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useStudents } from "../../queries/useStudent";
import EditStudent from "./EditStudent";
import DataTable from "../../components/common/DataTable";

export default function StudentsList() {

  const navigate = useNavigate();

  const { data: studentsData = [], isLoading } = useStudents();

  const [search, setSearch] = useState("");
  const [editStudent, setEditStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.phone?.includes(search)
    );
  }, [search, studentsData]);

  const pinnedColumns = useMemo(() => ({
    left: ["name"],
  }), []);

  const studentColumns = [

    {
      accessorKey: "name",
      header: "Student Name"
    },

    {
      accessorKey: "phone",
      header: "Phone"
    },

    {
      accessorKey: "parent_name",
      header: "Parent Name",
      cell: info => info.getValue() || "-"
    },

    {
      accessorKey: "parent_phone",
      header: "Parent Phone",
      cell: info => info.getValue() || "-"
    },

    {
      id: "actions",
      header: "Actions",
      enablePinning: true,
      cell: ({ row }) => (
        <button
          onClick={() => setEditStudent(row.original)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      )
    }
  ];

  // if (isLoading) {
  //   return <div className="p-5">Loading students...</div>;
  // }

  return (
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

      {/* Search */}
      {/* <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div> */}

      {/* Table */}
      <DataTable
        data={filteredStudents}
        columns={studentColumns}
        pageSize={10}
        pinnedColumns={pinnedColumns}
      />


      {editStudent && (
        <EditStudent
          student={editStudent}
          onClose={() => setEditStudent(null)}
        />
      )}

    </div>
  );
}