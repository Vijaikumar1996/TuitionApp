import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import InputField from "../../components/form/form-input/InputField";

/* ---------------- Schema ---------------- */

const machineSchema = z.object({
  machine_name: z.string().min(1, "Machine name is required"),
  language: z.string().min(1, "Language is required"),
  status: z.enum(["active", "inactive"]),
});

/* ---------------- Component ---------------- */

export default function MachineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(machineSchema),
    defaultValues,
  });

  /* Reset form when editing */

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        status: defaultValues.status || "active",
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Machine Name + Language */}

      <FormGrid>

        <InputField
          name="machine_name"
          label="Machine Name"
          control={control}
          error={errors.machine_name}
          placeholder="Enter machine name"
          required
        />

        <SelectField
          name="language"
          label="Language"
          control={control}
          options={[
            { id: "English", name: "English" },
            { id: "Tamil", name: "Tamil" },
          ]}
          error={errors.language}
          required
        />

      </FormGrid>


      {/* Status */}

      <FormGrid>

        <SelectField
          name="status"
          label="Status"
          control={control}
          options={[
            { id: "active", name: "Active" },
            { id: "inactive", name: "Inactive" },
          ]}
        />

      </FormGrid>


      {/* Buttons */}

      <div className="flex justify-end gap-3 pt-6">

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          {isLoading ? "Saving..." : "Save Machine"}
        </button>

      </div>

    </form>
  );
}