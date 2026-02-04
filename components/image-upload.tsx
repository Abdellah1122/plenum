'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

interface ImageUploadProps {
    onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
    const [resource, setResource] = useState<any>();

    return (
        <CldUploadWidget
            uploadPreset="plenum_uploads"
            onSuccess={(result, { widget }) => {
                setResource(result?.info);
                if (typeof result.info === 'object' && 'secure_url' in result.info) {
                    onUpload((result.info as any).secure_url);
                }
            }}
        >
            {({ open }) => {
                return (
                    <button
                        className="bg-secondary text-white px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-secondary/80 transition-all"
                        onClick={() => open()}
                    >
                        Upload Image
                    </button>
                );
            }}
        </CldUploadWidget>
    );
}
