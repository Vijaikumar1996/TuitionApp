import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormGrid from "../../components/form/FormGrid";
import SelectField from "../../components/form/form-input/SelectField";
import InputField from "../../components/form/form-input/InputField";
import DateField from "../../components/form/form-input/DateField";

import { useStudents } from "../../queries/useStudent";
import { useCourses } from "../../queries/useCourses";
import { useBatches } from "../../queries/useBatches";
import { useAvailableMachines } from "../../queries/useMachines";

import { formatDate } from "../../utils/commonUtils";
import { useSelector } from "react-redux";

/* ---------------- Schema ---------------- */

const getEnrollmentSchema = (isEditMode, isTypewriting) =>
  z
    .object({
      studentId: z.string().min(1, "Student is required"),
      courseId: z.string().min(1, "Course is required"),
      batchId: z.string().min(1, "Batch is required"),
      startDate: z.string().min(1, "Start date is required"),

      language: isTypewriting
        ? z.string().min(1, "Language required")
        : z.string().optional(),

      grade: isTypewriting
        ? z.string().min(1, "Grade required")
        : z.string().optional(),

      machineId: isTypewriting
        ? z.string().min(1, "Machine required")
        : z.string().optional(),

      endDate: z.string().optional(),
      overrideFeeAmount: z.string().optional(),
      status: z.enum(["Active", "Completed", "Cancelled"]),
    })
    .superRefine((data, ctx) => {
      const isEmpty = !data.endDate || data.endDate.trim() === "";

      if (isEditMode && data.status !== "Active" && isEmpty) {
        ctx.addIssue({
          path: ["endDate"],
          message: "End date is required",
        });
      }

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
  isEditMode = false,
  handleAddStudent,
  newStudentId,
}) {
  const { user } = useSelector((state) => state.auth);
  const isTypewriting = user?.InstituteType === "Typewriting";

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getEnrollmentSchema(isEditMode, isTypewriting)),
    defaultValues: {
      status: "Active",
    },
  });

  /* ---------------- Queries ---------------- */

  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: batches = [], isLoading: batchesLoading } = useBatches();

  const language = watch("language");
  const batchId = watch("batchId");
  const status = watch("status");

  /* 🔥 Machines */
  const {
    data: availableMachines = [],
    isLoading: loadingMachines,
  } = useAvailableMachines(
    isTypewriting ? batchId : null,
    isTypewriting ? language : null
  );

  /* 🔥 FIX: Merge selected machine in edit */
  const mergedMachines = isEditMode
    ? [
      ...availableMachines,
      ...(defaultValues?.machineId &&
        !availableMachines.some(
          (m) => String(m.id) === String(defaultValues.machineId)
        )
        ? [
          {
            id: defaultValues.machineId,
            name:
              defaultValues.machineName ||
              `Machine ${defaultValues.machineId}`,
          },
        ]
        : []),
    ]
    : availableMachines;

  /* ---------------- Reset ---------------- */

  useEffect(() => {
    if (defaultValues) {
      const mapped = {
        ...defaultValues,
        studentId: defaultValues.studentId
          ? String(defaultValues.studentId)
          : "",
        courseId: defaultValues.courseId
          ? String(defaultValues.courseId)
          : "",
        batchId: defaultValues.batchId
          ? String(defaultValues.batchId)
          : "",
        startDate: defaultValues.startDate
          ? formatDate(defaultValues.startDate)
          : "",
        endDate: defaultValues?.endDate
          ? formatDate(defaultValues.endDate)
          : "",
        status: defaultValues.status || "Active",
        overrideFeeAmount: defaultValues.overrideFeeAmount
          ? String(defaultValues.overrideFeeAmount)
          : "",
        language: defaultValues.language || "",
        grade: defaultValues.grade || "",
        machineId: defaultValues.machineId
          ? String(defaultValues.machineId)
          : "",
      };

      reset(mapped);
    }
  }, [defaultValues, reset]);

  /* ---------------- Status Logic ---------------- */

  useEffect(() => {
    if (status === "Active") {
      setValue("endDate", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [status, setValue]);

  /* ---------------- Auto Select New Student ---------------- */

  useEffect(() => {
    if (newStudentId && students.length > 0) {
      setValue("studentId", String(newStudentId), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [newStudentId, students, setValue]);

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGrid cols={2}>

        {/* Student */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Student <span className="text-red-500">*</span>
            </label>

            {/* 🔥 Hide in edit */}
            {!isEditMode && (
              <button
                type="button"
                onClick={handleAddStudent}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add New Student
              </button>
            )}
          </div>

          <SelectField
            name="studentId"
            label=""
            control={control}
            options={students}
            error={errors.studentId}
            required
            disabled={studentsLoading || isEditMode} // 🔥 lock student
          />
        </div>

        {/* Course */}
        <SelectField
          name="courseId"
          label="Course"
          control={control}
          options={courses}
          error={errors.courseId}
          required
          disabled={coursesLoading}
        />

        {/* Batch */}
        <SelectField
          name="batchId"
          label="Batch"
          control={control}
          options={batches}
          error={errors.batchId}
          required
          disabled={batchesLoading}
        />

        {/* Typewriting Fields */}
        {isTypewriting && (
          <>
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

            {/* Machine */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Machine <span className="text-red-500">*</span>
                </label>

                <span className="text-sm text-gray-500">
                  {loadingMachines
                    ? "Loading..."
                    : `Available: ${availableMachines.length}`}
                </span>
              </div>

              <SelectField
                name="machineId"
                label=""
                control={control}
                options={mergedMachines} // ✅ FIXED
                error={errors.machineId}
                required
                disabled={!language || !batchId || loadingMachines}
              />
            </div>

            <SelectField
              name="grade"
              label="Grade"
              control={control}
              options={[
                { id: "higher", name: "Higher" },
                { id: "lower", name: "Lower" },
              ]}
              error={errors.grade}
              required
            />
          </>
        )}

        {/* Dates */}
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