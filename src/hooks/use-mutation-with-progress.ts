import {
  useMutation,
  UseMutationOptions,
  UseMutationResult
} from "@tanstack/react-query";
import { useCallback, useState } from "react";

export interface MutationWithProgressOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  onProgress?: (progress: number) => void;
}

export function useMutationWithProgress<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: MutationWithProgressOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> & {
  progress: number;
  resetProgress: () => void;
} {
  const [progress, setProgress] = useState(0);
  const { onProgress, ...mutationOptions } = options;

  const handleProgress = useCallback(
    (newProgress: number) => {
      setProgress(newProgress);
      onProgress?.(newProgress);
    },
    [onProgress]
  );

  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  // Wrap the original callbacks
  const wrappedOnMutate = mutationOptions.onMutate;
  const wrappedOnSuccess = mutationOptions.onSuccess;
  const wrappedOnError = mutationOptions.onError;
  const wrappedOnSettled = mutationOptions.onSettled;

  const mutation = useMutation({
    ...mutationOptions,
    onMutate: (variables) => {
      handleProgress(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (wrappedOnMutate as any)?.(variables);
    },
    onSuccess: (data, variables, context) => {
      handleProgress(100);
      setTimeout(() => resetProgress(), 300);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (wrappedOnSuccess) (wrappedOnSuccess as any)(data, variables, context);
    },
    onError: (error, variables, context) => {
      resetProgress();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (wrappedOnError) (wrappedOnError as any)(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (wrappedOnSettled) (wrappedOnSettled as any)(data, error, variables, context);
    },
  });

  return {
    ...mutation,
    progress,
    resetProgress,
  } as UseMutationResult<TData, TError, TVariables, TContext> & {
    progress: number;
    resetProgress: () => void;
  };
}