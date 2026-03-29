import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useCourses } from "../../queries/useCourses";
import EditCourse from "./EditCourse";
import DataTable from "../../components/common/DataTable";

export default function CourseList() {
  const navigate = useNavigate();

  const { data: coursesData = [], isLoading } = useCourses();

  const [search, setSearch] = useState("");
  const [editCourse, setEditCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coursesData]);

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Course Name"
    },
    {
      accessorKey: "fee_type",
      header: "Fee Type"
    },
    {
      accessorKey: "fee_amount",
      header: "Fee Amount",
      cell: (info) => `₹${info.getValue()}`
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
          onClick={() => setEditCourse(row.original)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      )
    }
  ], []);

  const pinnedColumns = useMemo(() => ({
    left: ["name"],
  }), []);

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Courses</h2>

        <button
          onClick={() => navigate("/course/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredCourses}
        columns={columns}
        pageSize={10}
        pinnedColumns={pinnedColumns}
        emptyMessage="No courses found"
      />

      {editCourse && (
        <EditCourse
          course={editCourse}
          onClose={() => setEditCourse(null)}
        />
      )}

    </div>
  );
}