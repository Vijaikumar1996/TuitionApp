import { useNavigate } from "react-router";
import MachineForm from "./MachineForm";
import { useCreateMachine } from "../../queries/useMachines";
import toast from "react-hot-toast";

export default function CreateMachine() {
  const navigate = useNavigate();
  const createMachine = useCreateMachine();

  const handleCreate = (data) => {
    console.log("Machine Data:", data);

    createMachine.mutate(data, {
      onSuccess: (res) => {
        toast.success(res);
        navigate("/machines");
      },
      onError: (error) => {
        const message =
          error.response?.data || "Failed to create machine";

        toast.error(message);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        Create Machine
      </h2>

      <MachineForm
        defaultValues={{
          machine_name: "",
          language: "",
          status: "active", // default
        }}
        onSubmit={handleCreate}
        onCancel={() => navigate("/machines")}
        isLoading={createMachine.isPending}
      />

    </div>
  );
}