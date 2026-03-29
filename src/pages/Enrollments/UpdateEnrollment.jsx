import EnrollmentForm from "./EnrollmentForm";
import { useUpdateEnrollment } from "../../queries/useEnrollments";
import toast from "react-hot-toast";

export default function UpdateEnrollment({ enrollment, onClose }) {
    const updateEnrollment = useUpdateEnrollment();

    const handleSubmit = (data) => {

        const payload = {
            ...data,
            studentId: parseInt(data.studentId, 10),
            courseId: parseInt(data.courseId, 10),
            batchId: parseInt(data.batchId, 10),
            overrideFeeAmount: data.overrideFeeAmount
                ? parseFloat(data.overrideFeeAmount)
                : null,
            endDate: data.endDate || null,
        };

        updateEnrollment.mutate(
            { id: enrollment.id, data : payload },
            {
                onSuccess: () => {
                    toast.success("Enrollment updated");
                    onClose();
                },
                onError: (error) => {
                    console.log(error);
                    const message =
                        error?.response?.message || "Failed to update enrollment";

                    toast.error(message);
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="text-lg font-semibold mb-4">
                    Edit Enrollment
                </h2>

                <EnrollmentForm
                    defaultValues={enrollment}
                    onSubmit={handleSubmit}
                    showEndDate={true}
                    onCancel={onClose}
                    isLoading={updateEnrollment.isPending}
                    isEditMode={true}
                />
            </div>
        </div>
    );
}