import BatchForm from "./BatchForm";
import { useUpdateBatch } from "../../queries/useBatches";
import toast from "react-hot-toast";

export default function EditBatch({ batch, courses, onClose }) {
    const updateBatchMutation = useUpdateBatch();

    const handleUpdate = (data) => {

        updateBatchMutation.mutate(
            { id: batch.id, data },
            {
                onSuccess: () => {
                    toast.success("Batch updated successfully");
                    onClose();
                },
                onError: (error) => {
                    const message =
                        error.response?.data || "Failed to update batch";

                    toast.error(message);
                },
            }
        );

    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 ">
            <div className="bg-white rounded-xl shadow p-6 w-[600px] max-h-[90vh] overflow-y-auto">

                <h2 className="text-lg font-semibold mb-4">
                    Edit Batch
                </h2>

                <BatchForm
                    //courses={courses}
                    defaultValues={{
                        name: batch.name,
                        courseId: String(batch.course_id),
                        startTime: batch.start_time,
                        endTime: batch.end_time,
                        status: batch.status,
                    }}
                    onSubmit={handleUpdate}
                    onCancel={onClose}
                    isLoading={updateBatchMutation.isPending}
                />

            </div>

        </div>
    );
}