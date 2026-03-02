import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

/* -------------------- Dummy Courses -------------------- */

const courses = [
    { id: 1, name: "8th Standard" },
    { id: 2, name: "9th Standard" },
    { id: 3, name: "Typewriting Lower" },
];

/* -------------------- Zod Schema -------------------- */

const batchSchema = z.object({
    name: z.string().min(1, "Batch name is required"),
    courseId: z.string().min(1, "Course is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(["Active", "Completed", "Inactive"]),
});

/* -------------------- Component -------------------- */

export default function CreateBatch() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            status: "Active",
        },
    });

    const onSubmit = (data) => {
        console.log("Batch Data:", data);

        // TODO: Call backend API here

        navigate("/batches");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

            <PageBreadcrumb pageTitle="Add Batch" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Batch Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Batch Name
                        </label>
                        <input
                            {...register("name")}
                            className="w-full px-3 py-2 rounded"
                            placeholder="Enter batch name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Course
                        </label>
                        <select
                            {...register("courseId")}
                            className="w-full px-3 py-2 rounded"
                        >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        {errors.courseId && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.courseId.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Start Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Start Date
                        </label>
                        <input
                            type="date"
                            {...register("startDate")}
                            className="w-full px-3 py-2 rounded"
                        />
                        {errors.startDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.startDate.message}
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            End Date
                        </label>
                        <input
                            type="date"
                            {...register("endDate")}
                            className="w-full px-3 py-2 rounded"
                        />
                        {errors.endDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.endDate.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Start Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Start Time
                        </label>
                        <input
                            type="time"
                            {...register("startTime")}
                            className="w-full px-3 py-2 rounded"
                        />
                        {errors.startTime && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.startTime.message}
                            </p>
                        )}
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            End Time
                        </label>
                        <input
                            type="time"
                            {...register("endTime")}
                            className="w-full px-3 py-2 rounded"
                        />
                        {errors.endTime && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.endTime.message}
                            </p>
                        )}
                    </div>

                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Status
                        </label>
                        <select
                            {...register("status")}
                            className="w-full px-3 py-2 rounded"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/batches")}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Batch
                    </button>
                </div>

            </form>
        </div>
    );
}