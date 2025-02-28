# @sbkl/medias

A Next.js media utilities package for handling file uploads with progress tracking.

## Installation

```bash
pnpm add @sbkl/medias
```

## Usage

```typescript
import { uploadFile } from "@sbkl/medias/action";
import { useUploadFile } from "@sbkl/medias/client";

function UploadComponent() {
  const { upload, progress, isUploading, error } = useUploadFile({
    onSuccess: (storageId) => {
      console.log('Upload complete:', storageId);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  });

  return (
    <div>
      <div>Progress: {progress}%</div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
    </div>
  );
}
```

## Features

- Server actions for file uploads
- Progress tracking with simulated progress
- TypeScript support
- Next.js App Router ready
- ESM only

## License

MIT
