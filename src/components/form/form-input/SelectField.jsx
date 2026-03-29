import { Controller } from "react-hook-form";

export default function SelectField({
    name,
    control,
    label,
    options = [],
    error,
    placeholder = "Select",
    disabled = false,
    required = false,
}) {
    return (
        <div>
            {label && (
                <label className="block mb-1 text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <select
                        {...field}
                        disabled={disabled}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">{placeholder}</option>

                        {options.map((item) => (
                            <option key={item.id} value={(item.id)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                )}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </div>
    );
}