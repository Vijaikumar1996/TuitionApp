import StudentForm from "./StudentForm";
import { useCreateStudent } from "../../queries/useStudent";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function CreateStudent({ onCancel, onSuccess, isModal = false }) {

  const createStudent = useCreateStudent();
  const navigate = useNavigate();

  const handleCreate = (data) => {
    createStudent.mutate(data, {
      onSuccess: (res) => {
        toast.success(res?.message || "Student created successfully");

        // ✅ If used in modal
        if (isModal) {
          onSuccess && onSuccess(res?.data);
        } 
        // ✅ If used as standalone page
        else {
          navigate("/students");
        }
      },
      onError: (error) => {
        const message =
          error.response?.data || "Failed to create student";

        toast.error(message);
      }
    });
  };

  return (
    <div className={`${isModal ? "" : "max-w-3xl mx-auto bg-white p-8 rounded-xl shadow"}`}>
      
      <h2 className="text-xl font-semibold mb-6">
        Create Student
      </h2>

      <StudentForm
        defaultValues={{
          name: "",
          phone: "",
          parent_name: "",
          parent_phone: ""
        }}
        onSubmit={handleCreate}
        onCancel={() => {
          if (isModal) {
            onCancel && onCancel(); // close modal
          } else {
            navigate("/students"); // normal page
          }
        }}
      />
    </div>
  );
}