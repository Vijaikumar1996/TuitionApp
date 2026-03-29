
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import InputField from "../../components/form/form-input/InputField";

/* ---------------- Schema ---------------- */

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),

  fee_type: z.string().min(1, "Fee type is required"),

  fee_amount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ required_error: "Fee amount is required" })
      .min(1, "Fee amount must be greater than 0")
  ),

  status: z.string().min(1, "Status is required"),
});

/* ---------------- Component ---------------- */

export default function CourseForm({
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
    resolver: zodResolver(courseSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Course Name */}

      <FormGrid cols={1}>
        <InputField
          name="name"
          label="Course Name"
          control={control}
          error={errors.name}
          required
          placeholder="Enter course name"
        />
      </FormGrid>


      {/* Fee Type + Fee Amount */}

      <FormGrid>

        <SelectField
          name="fee_type"
          label="Fee Type"
          control={control}
          error={errors.fee_type}
          required
          options={[
            { id: "Monthly", name: "Monthly" },
            { id: "One-Time", name: "One-Time" },
          ]}
        />

        <InputField
          name="fee_amount"
          label="Fee Amount"
          control={control}
          error={errors.fee_amount}
          required
          type="number"
          placeholder="Enter fee amount"
        />

      </FormGrid>


      {/* Status */}

      <FormGrid>

        <SelectField
          name="status"
          label="Status"
          control={control}
          error={errors.status}
          required
          options={[
            { id: "Active", name: "Active" },
            { id: "Inactive", name: "Inactive" },
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

