import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

/* -------------------- Zod Schema -------------------- */

const studentSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        phone: z
            .string()
            .min(10, "Phone must be 10 digits")
            .max(10, "Phone must be 10 digits"),
        batch: z.string().min(1, "Batch is required"),
        feeType: z.enum(["Monthly", "Yearly", "One-Time"]),
        monthlyFee: z.string().optional(),
        totalFee: z.string().optional(),
        admissionDate: z.string().min(1, "Admission date is required"),
    })
    .refine(
        (data) => {
            if (data.feeType === "Monthly") {
                return !!data.monthlyFee;
            }
            return true;
        },
        {
            message: "Monthly fee is required",
            path: ["monthlyFee"],
        }
    )
    .refine(
        (data) => {
            if (data.feeType === "Yearly" || data.feeType === "One-Time") {
                return !!data.totalFee;
            }
            return true;
        },
        {
            message: "Total fee is required",
            path: ["totalFee"],
        }
    );

/* -------------------- Component -------------------- */

export default function CreateStudent() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
    });

    const feeType = watch("feeType");

    const onSubmit = (data) => {
        console.log("Student Data:", data);

        // TODO: API call here

        navigate("/students");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

            {/* <h2 className="text-2xl font-semibold mb-8">Add Student</h2> */}
             <PageBreadcrumb pageTitle="Add Student" /> 

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* ---------------- Student Info ---------------- */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Phone
                        </label>
                        <input
                            {...register("phone")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Batch */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Batch
                        </label>
                        <select
                            {...register("batch")}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="">Select Batch</option>
                            <option value="Morning">Morning</option>
                            <option value="Evening">Evening</option>
                        </select>
                        {errors.batch && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.batch.message}
                            </p>
                        )}
                    </div>

                    {/* Admission Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Admission Date
                        </label>
                        <input
                            type="date"
                            {...register("admissionDate")}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.admissionDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.admissionDate.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* ---------------- Fee Section ---------------- */}

                <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4">
                        Fee Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Fee Type */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Fee Type
                            </label>
                            <select
                                {...register("feeType")}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="">Select Fee Type</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="One-Time">One-Time</option>
                            </select>
                            {errors.feeType && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.feeType.message}
                                </p>
                            )}
                        </div>

                        {/* Monthly Fee */}
                        {feeType === "Monthly" && (
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Monthly Fee
                                </label>
                                <input
                                    type="number"
                                    {...register("monthlyFee")}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.monthlyFee && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.monthlyFee.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Total Fee */}
                        {(feeType === "Yearly" || feeType === "One-Time") && (
                            <div>
                                <label className="block mb-1 text-sm font-medium">
                                    Total Fee
                                </label>
                                <input
                                    type="number"
                                    {...register("totalFee")}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                {errors.totalFee && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.totalFee.message}
                                    </p>
                                )}
                            </div>
                        )}



                    </div>
                </div>

                {/* ---------------- Buttons ---------------- */}

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/students")}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Student
                    </button>
                </div>

            </form>
        </div>
    );
}