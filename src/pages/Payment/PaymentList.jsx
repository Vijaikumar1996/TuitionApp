import { useState, useMemo } from "react";
import { useNavigate } from "react-router";

export default function PaymentsList() {
  const navigate = useNavigate();

  // ✅ Dummy Payment Data
  const paymentsData = [
    {
      id: 1,
      student: "Arun",
      batch: "8th Morning 2026",
      amount: 500,
      date: "2026-01-10",
      mode: "Cash",
    },
    {
      id: 2,
      student: "Divya",
      batch: "9th Evening 2026",
      amount: 2000,
      date: "2026-01-12",
      mode: "UPI",
    },
    {
      id: 3,
      student: "Arun",
      batch: "8th Morning 2026",
      amount: 500,
      date: "2026-02-05",
      mode: "Bank Transfer",
    },
  ];

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Filter Logic
  const filteredPayments = useMemo(() => {
    return paymentsData.filter((payment) => {
      const matchesSearch = payment.student
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFromDate = fromDate
        ? payment.date >= fromDate
        : true;

      const matchesToDate = toDate
        ? payment.date <= toDate
        : true;

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [search, fromDate, toDate]);

  // ✅ Total Calculation
  const totalCollection = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Payments</h2>

        <button
          onClick={() => navigate("/payment/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Payment
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

      </div>

      {/* Total Summary */}
      <div className="mb-4 text-right">
        <span className="text-sm text-gray-600">
          Total Collection:
        </span>
        <span className="ml-2 font-semibold text-green-600">
          ₹ {totalCollection}
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
                Amount
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Mode
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-3">
                    {payment.student}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {payment.batch}
                  </td>

                  <td className="px-4 py-3 font-medium text-green-600">
                    ₹ {payment.amount}
                  </td>

                  <td className="px-4 py-3">
                    {payment.date}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {payment.mode}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}