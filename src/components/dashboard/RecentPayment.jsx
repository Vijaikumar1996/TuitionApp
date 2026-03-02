import { useNavigate } from "react-router";

export default function RecentPayments() {
    const navigate = useNavigate();

    // ✅ Dummy Data (Latest 5 payments)
    const recentPayments = [
        {
            id: 1,
            student: "Arun",
            batch: "8th Morning 2026",
            amount: 500,
            date: "28-02-2026",
            mode: "Cash",
        },
        {
            id: 2,
            student: "Divya",
            batch: "9th Evening 2026",
            amount: 2000,
            date: "27-02-2026",
            mode: "UPI",
        },
        {
            id: 3,
            student: "Kumar",
            batch: "8th Morning 2026",
            amount: 1000,
            date: "26-02-2026",
            mode: "Bank Transfer",
        },
        {
            id: 4,
            student: "Priya",
            batch: "9th Evening 2026",
            amount: 1500,
            date: "25-02-2026",
            mode: "Cash",
        },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Recent Payments
                </h3>

                <button
                    onClick={() => navigate("/payments")}
                    className="text-sm text-blue-600 hover:underline"
                >
                    View All
                </button>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">

                {recentPayments.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex items-center justify-between border-b pb-3"
                    >
                        <div>
                            <p className="font-medium">
                                {payment.student}
                            </p>
                            <p className="text-sm text-gray-500">
                                {payment.batch}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="font-semibold text-green-600">
                                ₹ {payment.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                                {payment.date}
                            </p>
                        </div>

                        <span
                            className={`px-2 py-1 text-xs rounded-full ${payment.mode === "Cash"
                                    ? "bg-green-100 text-green-700"
                                    : payment.mode === "UPI"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                }`}
                        >
                            {payment.mode}
                        </span>
                    </div>
                ))}

            </div>
        </div>
    );
}