import MachineForm from "./MachineForm";
import { useUpdateMachine } from "../../queries/useMachines";
import toast from "react-hot-toast";

export default function EditMachine({ machine, onClose }) {
  const updateMachineMutation = useUpdateMachine();

  const handleUpdate = (data) => {
    updateMachineMutation.mutate(
      { id: machine.id, data },
      {
        onSuccess: () => {
          toast.success("Machine updated successfully");
          onClose();
        },
        onError: (error) => {
          const message =
            error.response?.data || "Failed to update machine";

          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow p-6 w-[600px] max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">
          Edit Machine
        </h2>

        <MachineForm
          defaultValues={{
            machine_name: machine.name,
            language: machine.language,
            status: machine.status || "active",
          }}
          onSubmit={handleUpdate}
          onCancel={onClose}
          isLoading={updateMachineMutation.isPending}
        />

      </div>
    </div>
  );
}