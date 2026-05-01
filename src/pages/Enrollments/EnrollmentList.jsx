import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useEnrollments } from "../../queries/useEnrollments";
import DataTable from "../../components/common/DataTable";
import UpdateEnrollment from "./UpdateEnrollment";
import { formatDate } from "../../utils/commonUtils";
import { useSelector } from "react-redux";

export default function EnrollmentList() {
  const navigate = useNavigate();

  const { data = [], isLoading } = useEnrollments();

  const [editEnrollment, setEditEnrollment] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isTypewriting = user?.InstituteType === "Typewriting";

  /* 🔥 Typewriting Columns */
  const typewritingColumns = [
    {
      accessorKey: "language",
      header: "Language",
      cell: ({ row }) => (
        <span className="capitalize text-gray-600">
          {row.original.language || "-"}
        </span>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => (
        <span className="capitalize text-gray-600">
          {row.original.grade || "-"}
        </span>
      ),
    },
    {
      accessorKey: "machineName", // or machine_name if you added join
      header: "Machine",
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.original.machineName || row.original.machineId || "-"}
        </span>
      ),
    },
  ];

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "student_name",
        header: "Student",
      },
      {
        accessorKey: "course_name",
        header: "Course",
      },
      {
        accessorKey: "batch_name",
        header: "Batch",
      },


      // 🔥 Inject only for typewriting
      ...(isTypewriting ? typewritingColumns : []),

      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => formatDate(row.original.startDate),
      },

      {
        accessorKey: "status",
        header: "Status",
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
        ),
      },
    ];

    return baseColumns;
  }, [isTypewriting]);

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
          right: ["actions"],
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