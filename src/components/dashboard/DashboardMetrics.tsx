import { useNavigate } from "react-router";

export default function DashboardMetrics({ data }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">

      {/* Total Students */}
      <div
        onClick={() => navigate("/students")}
        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition md:p-6"
      >
        <span className="text-sm text-gray-500">Total Students</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
          {data?.TotalStudents || 0}
        </h4>
      </div>

      {/* Active Enrollments */}
      <div
        onClick={() => navigate("/enrollments")}
        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition md:p-6"
      >
        <span className="text-sm text-gray-500">Active Enrollments</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
          {data?.ActiveEnrollments || 0}
        </h4>
      </div>

      {/* Fees Collected */}
      <div
        onClick={() => navigate("/payments")}
        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition md:p-6"
      >
        <span className="text-sm text-gray-500">
          Fees Collected (This Month)
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
          ₹{data?.FeesCollected || 0}
        </h4>
      </div>

      {/* Pending Fees */}
      <div
        onClick={() => navigate("/fees")}
        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition md:p-6"
      >
        <span className="text-sm text-gray-500">Pending Fees (This Month)</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
          ₹{data?.PendingFees || 0}
        </h4>
      </div>

    </div>
  );
}