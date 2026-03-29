
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import InputField from "../../components/form/form-input/InputField";
import TimeField from "../../components/form/form-input/TimeField";

//import TimeField from "../../components/form/TimeField";

import { useCourses } from "../../queries/useCourses";

/* ---------------- Schema ---------------- */

const batchSchema = z
  .object({
    name: z.string().min(1, "Batch name is required"),
    courseId: z.string().min(1, "Course is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(["Active", "Completed", "Inactive"]),
  })
  .refine(
    (data) => {
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

/* ---------------- Component ---------------- */

export default function BatchForm({
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
    resolver: zodResolver(batchSchema),
    defaultValues,
  });

  const { data: courses = [], isLoading: coursesLoading } = useCourses();

  /* Reset form when editing */

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        courseId: defaultValues.courseId
          ? String(defaultValues.courseId)
          : "",
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Batch Name + Course */}

      <FormGrid>

        <InputField
          name="name"
          label="Batch Name"
          control={control}
          error={errors.name}
          placeholder="Enter batch name"
          required
        />

        <SelectField
          name="courseId"
          label="Course"
          control={control}
          options={courses}
          error={errors.courseId}
          required
          disabled={coursesLoading}
        />

      </FormGrid>


      {/* Start Time + End Time */}

      <FormGrid>

        <TimeField
          name="startTime"
          control={control}
          label="Start Time"
          error={errors.startTime}
          required
        />

        <TimeField
          name="endTime"
          control={control}
          label="End Time"
          error={errors.endTime}
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
            { id: "Active", name: "Active" },
            { id: "Completed", name: "Completed" },
            { id: "Inactive", name: "Inactive" },
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
          {isLoading ? "Saving..." : "Save Batch"}
        </button>

      </div>

    </form>
  );
}

