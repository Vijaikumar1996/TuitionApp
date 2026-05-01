import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import EnrollmentForm from "./EnrollmentForm";
import { useCreateEnrollment } from "../../queries/useEnrollments";
import toast from "react-hot-toast";
import CreateStudent from "../Students/CreateStudent";
import { useStudents } from "../../queries/useStudent";
import { useSelector } from "react-redux";

export default function CreateEnrollment() {
    const navigate = useNavigate();
    const createEnrollment = useCreateEnrollment();

    const { user } = useSelector((state) => state.auth);
    const isTypewriting = user?.InstituteType === "Typewriting";

    // 🔥 Query Params
    const [searchParams] = useSearchParams();
    const batchId = searchParams.get("batchId");
    const language = searchParams.get("language");

    // 🔥 Default Values (Auto-fill from query)
    const defaultValues = {
        startDate: new Date().toISOString().split("T")[0],
        batchId: batchId || "",
        language: language || "",
    };

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

            // Machine (optional)
            machineId: data.machineId ? parseInt(data.machineId, 10) : null,

            // Typewriting fields
            language: isTypewriting ? data.language : null,
            grade: isTypewriting ? data.grade : null,

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
                defaultValues={defaultValues}   // 🔥 Prefilled here
                isEditMode={false}
                onCancel={() => navigate("/enrollments")}
                handleAddStudent={handleAddStudent}
                newStudentId={newStudentId}
            />

            {/* ✅ Modal */}
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
                                // ✅ Auto select new student
                                //    setNewStudentId(newStudent.id);

                                // ✅ Refresh dropdown
                                //    await refetchStudents();

                                // ✅ Close modal
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