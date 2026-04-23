import { useState } from "react";
import EnrollmentForm from "./EnrollmentForm";
import { useCreateEnrollment } from "../../queries/useEnrollments";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CreateStudent from "../Students/CreateStudent";
import { useStudents } from "../../queries/useStudent";


export default function CreateEnrollment() {
    const navigate = useNavigate();
    const createEnrollment = useCreateEnrollment();

    // ✅ Modal state
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [newStudentId, setNewStudentId] = useState(null);

    const { refetch: refetchStudents } = useStudents();

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
            },
        });
    };

    // ✅ Open modal
    const handleAddStudent = () => {
        setShowStudentModal(true);
    };

    // ✅ Close modal
    const handleCloseModal = () => {
        setShowStudentModal(false);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-6">
                Create Enrollment
            </h2>

            <EnrollmentForm
                title="Enroll Student"
                onSubmit={handleSubmit}
                showEndDate={false}
                defaultValues={{
                    startDate: new Date().toISOString().split("T")[0],
                }}
                isEditMode={false}
                onCancel={() => navigate("/enrollments")}
                handleAddStudent={handleAddStudent} // ✅ pass handler
                newStudentId={newStudentId}
            />

            {/* ✅ Modal (only show when clicked) */}
            {showStudentModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl w-[500px] p-4 relative">

                        {/* Close button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-8 text-gray-500 hover:text-black text-lg"
                        >
                            ✕
                        </button>

                        <CreateStudent
                            isModal={true}
                            onSuccess={async (newStudent) => {

                                // ✅ store new student id
                                // setNewStudentId(newStudent.id);

                                // // ✅ refetch students
                                // await refetchStudents();

                                // ✅ close modal
                                setShowStudentModal(false);

                            }}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}