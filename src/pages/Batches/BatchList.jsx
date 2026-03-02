import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

export default function BatchList() {
  const navigate = useNavigate();

  // ✅ Dummy Data
  const batchesData = [
    {
      id: 1,
      name: "8th Morning 2026",
      course: "8th Standard",
      startDate: "01-06-2026",
      endDate: "31-03-2027",
      timing: "7:00 AM - 8:00 AM",
      status: "Active",
    },
    {
      id: 2,
      name: "9th Evening 2026",
      course: "9th Standard",
      startDate: "01-06-2026",
      endDate: "31-03-2027",
      timing: "5:00 PM - 6:00 PM",
      status: "Active",
    },
    {
      id: 3,
      name: "Typewriting Jan 2026",
      course: "Typewriting Lower",
      startDate: "01-01-2026",
      endDate: "31-03-2026",
      timing: "6:00 AM - 7:00 AM",
      status: "Completed",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredBatches = useMemo(() => {
    return batchesData.filter((batch) =>
      batch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Batch Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Course
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Timing
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Start Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                End Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <tr key={batch.id} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-3 font-medium">
                    {batch.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {batch.course}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {batch.timing}
                  </td>

                  <td className="px-4 py-3">
                    {batch.startDate}
                  </td>

                  <td className="px-4 py-3">
                    {batch.endDate}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        batch.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : batch.status === "Completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex gap-3 text-sm">
                    <button
                      onClick={() => navigate(`/batches/edit/${batch.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline">
                      Disable
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  No batches found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}