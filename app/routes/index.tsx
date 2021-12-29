import { ActionFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import {
  useField,
  useIsSubmitting,
  ValidatedForm,
  validationError,
  withZod,
} from "remix-validated-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

// Using yup in this example, but you can use anything
const validator = withZod(FormSchema);

export const action: ActionFunction = async ({ request }) => {
  const fieldValues = validator.validate(await request.formData());
  if (fieldValues.error) return validationError(fieldValues.error);
  const { firstName, lastName, email } = fieldValues.data;

  // Do something with correctly typed values;
  console.log(firstName, lastName, email);

  return redirect("/");
};

export const loader: LoaderFunction = () => {
  return {
    defaultValues: {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
    },
  };
};

export default function MyForm() {
  const { defaultValues } = useLoaderData();
  return (
    <ValidatedForm
      validator={validator}
      method="post"
      defaultValues={defaultValues}
    >
      <MyInput name="firstName" label="First Name" />
      <MyInput name="lastName" label="Last Name" />
      <MyInput name="email" label="Email" />
      <MySubmitButton />
    </ValidatedForm>
  );
}

type InputProps = {
  name: string;
  label: string;
};

const MyInput = ({ name, label }: InputProps) => {
  const { validate, clearError, defaultValue, error } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        onBlur={validate}
        onChange={clearError}
        defaultValue={defaultValue}
      />
      {error && <span className="my-error-class">{error}</span>}
    </div>
  );
};

const MySubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
