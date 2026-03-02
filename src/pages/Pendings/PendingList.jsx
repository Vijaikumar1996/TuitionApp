import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

export default function PendingList() {
  const navigate = useNavigate();

  // ✅ Dummy Data (Simulated Enrollment Summary)
  const outstandingData = [
    {
      id: 1,
      student: "Arun",
      batch: "8th Morning 2026",
      expected: 3000,
      paid: 2000,
      status: "Active",
    },
    {
      id: 2,
      student: "Divya",
      batch: "9th Evening 2026",
      expected: 5000,
      paid: 5000,
      status: "Active",
    },
    {
      id: 3,
      student: "Kumar",
      batch: "8th Morning 2026",
      expected: 3000,
      paid: 1000,
      status: "Inactive",
    },
  ];

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const filteredData = useMemo(() => {
    return outstandingData.filter((item) => {
      const matchesSearch = item.student
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesBatch = batchFilter
        ? item.batch === batchFilter
        : true;

      return matchesSearch && matchesBatch;
    });
  }, [search, batchFilter]);

  const totalOutstanding = filteredData.reduce(
    (sum, item) => sum + (item.expected - item.paid),
    0
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Outstanding</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {/* Batch Filter */}
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Batches</option>
          <option value="8th Morning 2026">8th Morning 2026</option>
          <option value="9th Evening 2026">9th Evening 2026</option>
        </select>

      </div>

      {/* Total Summary */}
      <div className="mb-4 text-right">
        <span className="text-sm text-gray-600">
          Total Outstanding:
        </span>
        <span className="ml-2 font-semibold text-red-600">
          ₹ {totalOutstanding}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Student
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Batch
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Expected
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Paid
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Balance
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const balance = item.expected - item.paid;

                return (
                  <tr key={item.id} className="border-t hover:bg-gray-50">

                    <td className="px-4 py-3">
                      {item.student}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.batch}
                    </td>

                    <td className="px-4 py-3">
                      ₹ {item.expected}
                    </td>

                    <td className="px-4 py-3 text-green-600">
                      ₹ {item.paid}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      <span
                        className={
                          balance > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        ₹ {balance}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {balance > 0 && (
                        <button
                          onClick={() =>
                            navigate("/payment/create")
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No outstanding records
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}