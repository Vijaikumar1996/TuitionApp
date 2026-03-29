import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import InputField from "../../components/form/form-input/InputField";
import DateField from "../../components/form/form-input/DateField";

import { useStudents } from "../../queries/useStudent";
import { useCourses } from "../../queries/useCourses";
import { useBatchesByCourse } from "../../queries/useBatches";
import { formatDate } from "../../utils/commonUtils";

/* ---------------- Schema ---------------- */

const getEnrollmentSchema = (isEditMode) =>
  z
    .object({
      studentId: z.string().min(1, "Student is required"),
      courseId: z.string().min(1, "Course is required"),
      batchId: z.string().min(1, "Batch is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().optional(),
      overrideFeeAmount: z.string().optional(),
      status: z.enum(["Active", "Completed", "Cancelled"]),
    })
    .superRefine((data, ctx) => {
      const isEmpty = !data.endDate || data.endDate.trim() === "";

      // ✅ Require endDate if not Active
      if (isEditMode && data.status !== "Active" && isEmpty) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
        });
      }

      // ✅ Validate date order
      if (!isEmpty && data.startDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);

        if (end < start) {
          ctx.addIssue({
            path: ["endDate"],
            message: "End date must be after start date",
          });
        }
      }
    });

/* ---------------- Component ---------------- */

export default function EnrollmentForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  showEndDate = false,
  isEditMode = false
}) {


  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getEnrollmentSchema(isEditMode)),
    defaultValues: {
      status: "Active",
    },
  });

  /* ---------------- Queries ---------------- */

  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();

  const courseId = watch("courseId");
  const status = watch("status");

  const { data: batches = [], isLoading: batchesLoading } =
    useBatchesByCourse(courseId);

  /* ---------------- Reset (Edit Mode) ---------------- */

  useEffect(() => {
    if (defaultValues && isEditMode) {
      const mapped = {
        ...defaultValues,
        studentId: String(defaultValues.studentId || ""),
        courseId: String(defaultValues.courseId || ""),
        batchId: "",
        startDate: formatDate(defaultValues.startDate),
        endDate: formatDate(defaultValues?.endDate),
        status: defaultValues.status || "Active",
        overrideFeeAmount: defaultValues.overrideFeeAmount ? String(defaultValues.overrideFeeAmount)
          : "",
      };

      reset(mapped);
      setValue("courseId", mapped.courseId);
    }
  }, [isEditMode]);

  /* ---------------- Set Batch AFTER load ---------------- */

  useEffect(() => {
    if (batches.length > 0 && defaultValues?.batchId) {
      setValue("batchId", String(defaultValues.batchId));
    }
  }, [batches, defaultValues, setValue]);

  /* ---------------- Prevent unwanted reset ---------------- */

  const prevCourseRef = useRef();

  useEffect(() => {
    if (prevCourseRef.current && prevCourseRef.current !== courseId) {
      setValue("batchId", "");
    }
    prevCourseRef.current = courseId;
  }, [courseId, setValue]);

  useEffect(() => {
    if (status === "Active") {
      setValue("endDate", "", {
        shouldValidate: true,   // ✅ re-run validation
        shouldDirty: true,
      });
    }
  }, [status, setValue]);

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={2}>
        <SelectField
          name="studentId"
          label="Student"
          control={control}
          options={students}
          error={errors.studentId}
          required
          disabled={studentsLoading}
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

        <SelectField
          name="batchId"
          label="Batch"
          control={control}
          options={batches}
          error={errors.batchId}
          required
          disabled={!courseId || batchesLoading}
        />

        <DateField
          name="startDate"
          label="Start Date"
          control={control}
          required
        />

        {(showEndDate || (isEditMode && status !== "Active")) && (
          <DateField
            name="endDate"
            label="End Date"
            control={control}
            required={isEditMode && status !== "Active"}
          />
        )}

        {!showEndDate && (
          <InputField
            name="overrideFeeAmount"
            label="Override Fee"
            type="number"
            control={control}
          />
        )}

        {isEditMode && (
          <SelectField
            name="status"
            label="Status"
            control={control}
            error={errors.status}
            required
            options={[
              { id: "Active", name: "Active" },
              { id: "Completed", name: "Completed" },
              { id: "Cancelled", name: "Cancelled" },
            ]}
          />
        )}
      </FormGrid>

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
          {isLoading ? "Saving..." : "Save Enrollment"}
        </button>
      </div>
    </form>
  );
}