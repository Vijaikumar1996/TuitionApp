import CourseForm from "./CourseForm";
import { useCreateCourse } from "../../queries/useCourses";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function CreateCoursePage() {

    const createCourse = useCreateCourse();
    const navigate = useNavigate();

    const handleCreate = (data) => {

        createCourse.mutate(data, {
            onSuccess: (res) => {
                toast.success(res?.message || "Course created successfully");
                navigate("/courses");
            },
            onError: (error) => {              
                const message =
                    error.response?.data || "Failed to create course";

                toast.error(message);
            }
        });

    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

            <h2 className="text-xl font-semibold mb-6">
                Create Course
            </h2>

            <CourseForm
                defaultValues={{
                    name: "",
                    fee_type: "",
                    fee_amount: "",
                    status: "Active"
                }}
                onSubmit={handleCreate}
                onCancel={() => navigate("/courses")}
            />

        </div>
    );
}