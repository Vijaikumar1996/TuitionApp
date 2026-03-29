import EnrollmentForm from "./EnrollmentForm";
import { useCreateEnrollment } from "../../queries/useEnrollments";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function CreateEnrollment() {

    const navigate = useNavigate();

    const createEnrollment = useCreateEnrollment();

    const handleSubmit = (data) => {

        const payload = {
            ...data,
            studentId: parseInt(data.studentId, 10),
            courseId: parseInt(data.courseId, 10),
            batchId: parseInt(data.batchId, 10),
            overrideFeeAmount: data.overrideFeeAmount
                ? parseFloat(data.overrideFeeAmount)
                : null,
        };

        createEnrollment.mutate(payload, {
            onSuccess: (res) => {
                toast.success(res?.message || "Enrollment created successfully");
                navigate("/enrollments");
            },
            onError: (error) => {
                console.log(error);
                const message =
                    error?.response?.message || "Failed to create enrollment";

                toast.error(message);
            }
        });

    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

            <PageBreadcrumb pageTitle="Add Enrollment" />

            <EnrollmentForm
                title="Enroll Student"
                onSubmit={handleSubmit}
                showEndDate={false}
                defaultValues={{
                    startDate: new Date().toISOString().split("T")[0],
                }}
                isEditMode={false}
            />

        </div>
    );
}