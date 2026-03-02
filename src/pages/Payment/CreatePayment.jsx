import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

/* ---------------- Dummy Students ---------------- */

const students = [
  {
    id: 1,
    name: "Arun",
    batch: "8th Morning 2026",
    balance: 1000,
  },
  {
    id: 2,
    name: "Divya",
    batch: "9th Evening 2026",
    balance: 0,
  },
];

/* ---------------- Zod Schema ---------------- */

const paymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z
    .string()
    .min(1, "Amount is required"),
  paymentMode: z.enum(["Cash", "UPI", "Bank Transfer"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  notes: z.string().optional(),
});

/* ---------------- Component ---------------- */

export default function CreatePayment() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
  });

  const studentId = watch("studentId");

  // Auto update selected student
  const handleStudentChange = (e) => {
    const id = e.target.value;
    const student = students.find((s) => s.id.toString() === id);
    setSelectedStudent(student);
  };

  const onSubmit = (data) => {
    console.log("Payment Data:", data);

    // TODO: API call here

    navigate("/payments");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <PageBreadcrumb pageTitle="Add Payment" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Student */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Student
            </label>
            <select
              {...register("studentId")}
              onChange={handleStudentChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Date
            </label>
            <input
              type="date"
              {...register("paymentDate")}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.paymentDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

        </div>

        {/* Show Student Info */}
        {selectedStudent && (
          <div className="bg-gray-50 p-4 rounded border">
            <p><strong>Batch:</strong> {selectedStudent.batch}</p>
            <p>
              <strong>Outstanding:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedStudent.balance > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                ₹ {selectedStudent.balance}
              </span>
            </p>
          </div>
        )}

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Amount */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Amount
            </label>
            <input
              type="number"
              {...register("amount")}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Payment Mode
            </label>
            <select
              {...register("paymentMode")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {errors.paymentMode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Notes (Optional)
          </label>
          <textarea
            {...register("notes")}
            rows="3"
            className="w-full border px-3 py-2 rounded"
            placeholder="Any remarks..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Payment
          </button>
        </div>

      </form>
    </div>
  );
}