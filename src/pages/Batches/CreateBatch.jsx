import { useNavigate } from "react-router";
import BatchForm from "./BatchForm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useCreateBatch } from "../../queries/useBatches";
import toast from "react-hot-toast";

/* Dummy Courses */

const courses = [
    { id: 1, name: "8th Standard" },
    { id: 2, name: "9th Standard" },
    { id: 3, name: "Typewriting Lower" },
];

export default function CreateBatch() {
    const navigate = useNavigate();
    const createBatch = useCreateBatch();

    const handleCreate = (data) => {
        console.log("Batch Data:", data);
        createBatch.mutate(data, {
            onSuccess: (res) => {
                toast.success(res);
                navigate("/batches");
            },
            onError: (error) => {
                const message =
                    error.response?.data || "Failed to create batch";

                toast.error(message);
            }
        });

       // navigate("/batches");
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

            {/* <PageBreadcrumb pageTitle="Add Batch" /> */}

             <h2 className="text-xl font-semibold mb-6">
                Create Batch
            </h2>

            <BatchForm
                //  courses={courses}
                defaultValues={{
                    name: "",
                    courseId: "",
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    status: "Active",
                }}
                onSubmit={handleCreate}
                onCancel={() => navigate("/batches")}
            />

        </div>
    );
}