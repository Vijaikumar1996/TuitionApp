import StudentForm from "./StudentForm";
import { useUpdateStudent } from "../../queries/useStudent";
import toast from "react-hot-toast";

export default function EditStudent({ student, onClose }) {

  const updateStudent = useUpdateStudent();

  const handleUpdate = (data) => {

    updateStudent.mutate(
      { id: student.id, data: data },
      {
        onSuccess: (res) => {
          console.log("Update Response:", res);

          toast.success(res?.message || "Student updated successfully");

          onClose();
        },
        onError: (error) => {
          const message =
            error.response?.data || "Failed to update student";

          toast.error(message);
        }
      }
    );

  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-xl w-[500px]">

        <h2 className="text-lg font-semibold mb-4">
          Edit Student
        </h2>

        <StudentForm
          defaultValues={student}
          onSubmit={handleUpdate}
          onCancel={onClose}
        />

      </div>

    </div>
  );
}