import CourseForm from "./CourseForm";
import { useUpdateCourse } from "../../queries/useCourses";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function EditCourse({ course, onClose }) {

    const updateCourse = useUpdateCourse();
    const navigate = useNavigate();

    const handleUpdate = (data) => {
        debugger
        updateCourse.mutate(
            { id: course.id, data: data },
            {
                onSuccess: (res) => {
                    console.log("Update Response:", res);
                    toast.success(res?.message || "Course updated successfully");
                    onClose();
                },
                onError: (error) => {
                    const message =
                        error.response?.data || "Failed to update course";

                    toast.error(message);
                }
            }
        );

    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 ">

            <div className="bg-white p-6 rounded-xl w-[500px]">

                <h2 className="text-lg font-semibold mb-4">
                    Edit Course
                </h2>

                <CourseForm
                    defaultValues={course}
                    onSubmit={handleUpdate}
                    onCancel={onClose}
                />

            </div>

        </div>
    );
}