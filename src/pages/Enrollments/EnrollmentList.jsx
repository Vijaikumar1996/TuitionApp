import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useEnrollments } from "../../queries/useEnrollments";
import DataTable from "../../components/common/DataTable";
import UpdateEnrollment from "./UpdateEnrollment";
import { formatDate } from "../../utils/commonUtils";

export default function EnrollmentList() {

  const navigate = useNavigate();

  const { data = [], isLoading } = useEnrollments();

  const [editEnrollment, setEditEnrollment] = useState(null);

  const columns = useMemo(() => [

    {
      accessorKey: "student_name",
      header: "Student"
    },

    {
      accessorKey: "course_name",
      header: "Course"
    },

    {
      accessorKey: "batch_name",
      header: "Batch"
    },

    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        formatDate(row.original.startDate)
      )
    },

    {
      accessorKey: "status",
      header: "Status"
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setEditEnrollment(row.original)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
      )
    }

  ], []);

  if (isLoading) return <div className="p-5">Loading enrollments...</div>;

  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold">Enrollments</h2>

        <button
          onClick={() => navigate("/enrollment/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Enroll Student
        </button>

      </div>

      <DataTable
        data={data}
        columns={columns}
        pinnedColumns={{
          left: ["student_name"],
          right: ["actions"]
        }}
      />

      {editEnrollment && (
        <UpdateEnrollment
          enrollment={editEnrollment}
          onClose={() => setEditEnrollment(null)}
        />
      )}

    </div>
  );
}