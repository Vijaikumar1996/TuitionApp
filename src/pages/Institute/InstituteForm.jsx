import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormGrid from "../../components/form/FormGrid";
import InputField from "../../components/form/form-input/InputField";
import SelectField from "../../components/form/form-input/SelectField";

/* ---------------- Schema ---------------- */

const instituteSchema = z.object({
    institute_name: z.string().min(1, "Institute name is required"),
    username: z.string().min(1, "Username is required"),
    mobile_no: z
        .string()
        .min(10, "Mobile number must be at least 10 digits")
        .regex(/^[0-9]+$/, "Mobile number must contain only digits"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    address: z.string().optional(),
    institute_type: z.string().min(1, "Institute type is required"),
});

/* ---------------- Component ---------------- */

export default function InstituteForm({
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
        resolver: zodResolver(instituteSchema),
        defaultValues,
    });

    /* -------- Custom Submit -------- */
    const handleFormSubmit = (data) => {
        const payload = {
            InstituteName: data.institute_name,
            AdminName: data.username,
            Email: data.email,
            MobileNo: data.mobile_no,
            Password: `${data.username}@123`,
            InstituteType: data.institute_type,
            Address: data.address,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

            {/* ALL FIELDS IN 2 COLUMNS */}
            <FormGrid>

                <InputField
                    name="institute_name"
                    label="Institute Name"
                    control={control}
                    error={errors.institute_name}
                    required
                    placeholder="Enter institute name"
                />

                <InputField
                    name="username"
                    label="Username"
                    control={control}
                    error={errors.username}
                    required
                    placeholder="Enter username"
                />

                <InputField
                    name="mobile_no"
                    label="Mobile Number"
                    control={control}
                    error={errors.mobile_no}
                    required
                    placeholder="Enter mobile number"
                />

                <InputField
                    name="email"
                    label="Email"
                    control={control}
                    error={errors.email}
                    required
                    placeholder="Enter email"
                />

                <InputField
                    name="address"
                    label="Address"
                    control={control}
                    error={errors.address}
                    placeholder="Enter address"
                />

                <SelectField
                    name="institute_type"
                    label="Institute Type"
                    control={control}
                    error={errors.institute_type}
                    required
                    options={[
                        { id: "Tuition", name: "Tuition" },
                        { id: "Typewriting", name: "Typewriting" },
                    ]}
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