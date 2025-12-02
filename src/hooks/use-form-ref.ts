/* eslint-disable @typescript-eslint/no-explicit-any */
import { useImperativeHandle } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormRef<T extends FieldValues = any> {
  submit: () => Promise<void>;
  validate: () => Promise<boolean>;
  getValues: () => T;
  setValues: (values: T) => void;
  getErrors: () => any;
  isDirty: () => boolean;
  reset: () => void;
}

interface UseFormRefOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T, reset: () => void) => Promise<void>;
  defaultValues?: Partial<T>;
}

export function useFormRef<T extends FieldValues>(
  ref: React.ForwardedRef<FormRef<T>>,
  options: UseFormRefOptions<T>,
) {
  const { form, onSubmit, defaultValues } = options;

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await form.handleSubmit((values) => {
        onSubmit(values, () => form.reset(defaultValues as any));
      })();
    },
    validate: async () => {
      const isValid = await form.trigger();
      return isValid;
    },
    getValues: () => {
      return form.getValues();
    },
    setValues: (values: T) => {
      form.reset(values);
    },
    getErrors: () => {
      return form.formState.errors;
    },
    isDirty: () => {
      return form.formState.isDirty;
    },
    reset: () => {
      form.reset(defaultValues as any);
    },
  }));
}
