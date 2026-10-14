"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type PhotoSlot = "front" | "back" | "left" | "right";

interface UploadedPhotos {
  front: File | null;
  back: File | null;
  left: File | null;
  right: File | null;
}

const PHOTO_LABELS: Record<PhotoSlot, string> = {
  front: "Front View",
  back: "Back View",
  left: "Left Side",
  right: "Right Side",
};

const PHOTO_INSTRUCTIONS: Record<PhotoSlot, string> = {
  front: "Face the camera directly, arms at your sides",
  back: "Turn around, arms at your sides",
  left: "Turn to your left side, arms at your sides",
  right: "Turn to your right side, arms at your sides",
};

export default function CreateAvatarPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [photos, setPhotos] = useState<UploadedPhotos>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [previews, setPreviews] = useState<Record<PhotoSlot, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push("/login?callbackUrl=/create-avatar");
    return null;
  }

  const handleFileChange = (slot: PhotoSlot, file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    // Update photo
    setPhotos((prev) => ({ ...prev, [slot]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [slot]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (slot: PhotoSlot) => {
    setPhotos((prev) => ({ ...prev, [slot]: null }));
    setPreviews((prev) => ({ ...prev, [slot]: null }));
  };

  const allPhotosUploaded = Object.values(photos).every((photo) => photo !== null);

  const handleSubmit = async () => {
    if (!allPhotosUploaded) {
      alert("Please upload all 4 photos");
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // TODO: Actually upload photos to your backend/storage
    // const formData = new FormData();
    // Object.entries(photos).forEach(([slot, file]) => {
    //   if (file) formData.append(slot, file);
    // });
    // await fetch('/api/upload-avatar-photos', { method: 'POST', body: formData });

    setUploading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-ink rounded-full mx-auto flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-bg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-ink mb-3">
              Photos uploaded successfully!
            </h1>
            <p className="text-mute">
              Your digital twin is being created. This may take a few moments.
            </p>
          </div>

          <div className="bg-card border border-line rounded-2xl p-8">
            <h2 className="text-lg font-serif text-ink mb-4">Next Steps</h2>
            <div className="space-y-3 text-left text-sm text-mute">
              <div className="flex gap-3">
                <span className="text-ink font-mono">1.</span>
                <span>We'll process your photos to create your 3D avatar</span>
              </div>
              <div className="flex gap-3">
                <span className="text-ink font-mono">2.</span>
                <span>You'll receive an email when your avatar is ready</span>
              </div>
              <div className="flex gap-3">
                <span className="text-ink font-mono">3.</span>
                <span>Start trying on garments with accurate fit predictions</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="btn btn-primary w-full flex justify-center items-center"
            >
              <span className="lbl" data-t="Go to Dashboard">
                <span>Go to Dashboard</span>
              </span>
            </Link>
            <Link href="/" className="block text-sm text-mute hover:text-ink transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-mute hover:text-ink transition-colors mb-8"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-serif text-ink mb-3">Create Your Avatar</h1>
          <p className="text-mute">
            Upload 4 photos to create your digital twin. Make sure you're wearing fitted
            clothing and standing in good lighting.
          </p>
        </div>

        {/* Photo Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(["front", "back", "left", "right"] as PhotoSlot[]).map((slot) => (
            <div
              key={slot}
              className="bg-card border border-line rounded-2xl p-6 transition-all hover:border-ink"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-serif text-ink mb-1">
                    {PHOTO_LABELS[slot]}
                  </h3>
                  <p className="text-xs text-mute">{PHOTO_INSTRUCTIONS[slot]}</p>
                </div>
                {photos[slot] && (
                  <button
                    onClick={() => handleRemovePhoto(slot)}
                    className="text-mute hover:text-ink transition-colors"
                    aria-label="Remove photo"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Preview or Upload Area */}
              <div className="relative">
                {previews[slot] ? (
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-bg">
                    <img
                      src={previews[slot]!}
                      alt={`${PHOTO_LABELS[slot]} preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-line bg-bg flex flex-col items-center justify-center cursor-pointer hover:border-ink transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(slot, file);
                      }}
                    />
                    <svg
                      className="w-12 h-12 text-mute mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-ink font-medium">Click to upload</span>
                    <span className="text-xs text-mute mt-1">PNG, JPG up to 10MB</span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-card border border-line rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-serif text-ink mb-4">Tips for best results</h3>
          <ul className="space-y-2 text-sm text-mute">
            <li className="flex gap-2">
              <span className="text-ink">•</span>
              <span>Wear fitted clothing that shows your body shape clearly</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ink">•</span>
              <span>Stand in a well-lit area with a plain background</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ink">•</span>
              <span>Keep your arms slightly away from your body</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ink">•</span>
              <span>Make sure your full body is visible from head to toe</span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!allPhotosUploaded || uploading}
            className={`btn btn-primary ${
              !allPhotosUploaded || uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <span className="lbl" data-t="Processing...">
                <span>Processing...</span>
              </span>
            ) : (
              <span className="lbl" data-t="Create My Avatar">
                <span>Create My Avatar</span>
              </span>
            )}
            {!uploading && (
              <span className="arrow" aria-hidden="true">
                →
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
