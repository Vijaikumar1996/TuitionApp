import InstituteForm from "./InstituteForm";
import { useCreateInstitute } from "../../queries/useInstitutes";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function CreateInstitute() {

  const createInstitute = useCreateInstitute();
  const navigate = useNavigate();

  const handleCreate = (data) => {

    createInstitute.mutate(data, {
      onSuccess: (res) => {
        toast.success(res?.message || "Institute created successfully");
        navigate("/institutes");
      },
      onError: (error) => {
        const message =
          error.response?.data?.message || "Failed to create institute";

        toast.error(message);
      }
    });

  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        Create Institute
      </h2>

      <InstituteForm
        defaultValues={{
          institute_name: "",
          mobile_no: "",
          email: "",
          address: "",
          institute_type: "",
          status: "Active"
        }}
        onSubmit={handleCreate}
        onCancel={() => navigate("/institutes")}
      />

    </div>
  );
}