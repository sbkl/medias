import * as React from "react";
import { uploadFile } from "../server";
import { useProgress } from "../hooks/use-progress";

interface UseUploadFileOptions {
  onSuccess?: (storageId: string) => void;
  onError?: (error: Error) => void;
}

interface UploadState {
  isUploading: boolean;
  error: Error | null;
  storageId: string | null;
}

export function useUploadFile(options: UseUploadFileOptions = {}) {
  const progress = useProgress();
  const [state, setState] = React.useState<UploadState>({
    isUploading: false,
    error: null,
    storageId: null,
  });

  const [isPending, startTransition] = React.useTransition();

  const upload = React.useCallback(
    async (file: File | Blob) => {
      setState((prev) => ({
        ...prev,
        isUploading: true,
        error: null,
        storageId: null,
      }));

      try {
        // Start the progress animation
        progress.start();

        startTransition(() => {
          uploadFile(file)
            .then((storageId) => {
              // Complete the progress animation
              progress.done();

              setState((prev) => ({
                ...prev,
                isUploading: false,
                storageId,
              }));

              options.onSuccess?.(storageId);
            })
            .catch((error) => {
              const uploadError =
                error instanceof Error ? error : new Error("Upload failed");

              // Reset progress on error
              progress.reset();

              setState((prev) => ({
                ...prev,
                isUploading: false,
                error: uploadError,
              }));
              options.onError?.(uploadError);
            });
        });
      } catch (error) {
        const uploadError =
          error instanceof Error ? error : new Error("Upload failed");

        // Reset progress on error
        progress.reset();

        setState((prev) => ({
          ...prev,
          isUploading: false,
          error: uploadError,
        }));
        options.onError?.(uploadError);
      }
    },
    [options, progress, startTransition]
  );

  const reset = React.useCallback(() => {
    progress.reset();
    setState({
      isUploading: false,
      error: null,
      storageId: null,
    });
  }, [progress]);

  return {
    upload,
    reset,
    isUploading: state.isUploading || isPending,
    progress: progress.value,
    error: state.error,
    storageId: state.storageId,
  };
}
