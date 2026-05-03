import InstituteForm from "./InstituteForm";
import { useUpdateInstitute } from "../../queries/useInstitutes";
import toast from "react-hot-toast";

export default function EditInstitute({ institute, onClose }) {

    const updateInstitute = useUpdateInstitute();

    const handleUpdate = (data) => {

        updateInstitute.mutate(
            { id: institute.id, data: data },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || "Institute updated successfully");
                    onClose();
                },
                onError: (error) => {
                    const message =
                        error.response?.data || "Failed to update institute";

                    toast.error(message);
                }
            }
        );

    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">

            <div className="bg-white p-6 rounded-xl w-[500px]">

                <h2 className="text-lg font-semibold mb-4">
                    Edit Institute
                </h2>

                <InstituteForm
                    defaultValues={institute}
                    onSubmit={handleUpdate}
                    onCancel={onClose}
                />

            </div>

        </div>
    );
}