import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

/* -------------------- Zod Schema -------------------- */

const courseSchema = z.object({
    name: z.string().min(1, "Course name is required"),
    description: z.string().optional(),
    status: z.enum(["Active", "Inactive"]),
});

/* -------------------- Component -------------------- */

export default function CreateCourse() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            status: "Active",
        },
    });

    const onSubmit = (data) => {
        console.log("Course Data:", data);

        // TODO: Call backend API here

        navigate("/courses");
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
            
            <PageBreadcrumb pageTitle="Add Course" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Course Name */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Course Name
                    </label>
                    <input
                        {...register("name")}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter course name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Description (Optional)
                    </label>
                    <textarea
                        {...register("description")}
                        rows="3"
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter description"
                    />
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Status
                        </label>
                        <select
                            {...register("status")}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/courses")}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Course
                    </button>
                </div>

            </form>

        </div>
    );
}