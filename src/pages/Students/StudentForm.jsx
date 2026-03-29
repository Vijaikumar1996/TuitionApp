
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";

/* ---------------- Schema ---------------- */

const studentSchema = z.object({
    name: z.string().min(1, "Student name is required"),
    phone: z.string().optional(),
    parent_name: z.string().optional(),
    parent_phone: z.string().min(10, "Parent phone is required"),
});

/* ---------------- Component ---------------- */

export default function StudentForm({
    defaultValues,
    onSubmit,
    isLoading,
    onCancel,
}) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Student Name + Phone */}

            <FormGrid>

                <InputField
                    name="name"
                    label="Student Name"
                    control={control}
                    error={errors.name}
                    required
                    placeholder="Enter student name"
                />

                <InputField
                    name="phone"
                    label="Phone"
                    control={control}
                    error={errors.phone}
                    placeholder="Student phone number"
                />

            </FormGrid>


            {/* Parent Details */}

            <FormGrid>

                <InputField
                    name="parent_name"
                    label="Parent Name"
                    control={control}
                    error={errors.parent_name}
                    placeholder="Enter parent name"
                />

                <InputField
                    name="parent_phone"
                    label="Parent Phone"
                    control={control}
                    error={errors.parent_phone}
                    required
                    placeholder="Parent phone number"
                />

            </FormGrid>


            {/* Buttons */}

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    className="border px-4 py-2 rounded"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>

            </div>

        </form>
    );
}

