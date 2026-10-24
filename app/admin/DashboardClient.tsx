
"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  saveDashboardData,
  logout,
  changeAdminPassword,
} from "../actions";

import { upload } from "@vercel/blob/client";

const fileInputClass =
  "block w-full min-w-0 text-sm text-gray-700 " +
  "file:mr-3 file:rounded-md file:border-0 " +
  "file:bg-ocean-800 file:px-4 file:py-2 " +
  "file:font-semibold file:text-white " +
  "file:cursor-pointer hover:file:bg-ocean-700 " +
  "focus:outline-none disabled:opacity-60";

export default function AdminDashboardClient({
  initialConfig,
  initialRooms,
  initialActivities,
}: any) {
  const [config, setConfig] = useState(initialConfig);
  const [rooms, setRooms] = useState(initialRooms);
  const [activities, setActivities] = useState(initialActivities);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<any>(null);
  const [roomToDelete, setRoomToDelete] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (!saveMessage) return;

    const timeout = window.setTimeout(() => {
      setSaveMessage("");
      setSaveError(false);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    setSaveError(false);

    try {
      const result = await saveDashboardData(config, rooms, activities);

      if (result.success) {
        setSaveMessage("All changes saved successfully!");
      } else {
        setSaveError(true);
        setSaveMessage("Failed to save changes. Please try again.");
      }
    } catch {
      setSaveError(true);
      setSaveMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  
  const handleImageUpload = async (
    id: string,
    file: File,
    callback: (url: string) => void,
  ) => {
    setUploadingId(id);

    try {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("❌ Unsupported image format.");
        return;
      }

      if (file.size === 0 || file.size > 8 * 1024 * 1024) {
        alert("❌ Image must be between 1 byte and 8 MB.");
        return;
      }

      const extensionByType: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/avif": "avif",
      };

      const extension = extensionByType[file.type];

      const blob = await upload(
        `images/${crypto.randomUUID()}.${extension}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        },
      );

      callback(blob.url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("❌ Image upload failed. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const addActivity = () => {
    setActivities((prev: any[]) => [
      ...prev,
      {
        id: `act-${Date.now()}`,
        title: "New Activity",
        description: "",
        image: "",
      },
    ]);
  };
  const addRoom = () => {
    setRooms((prev: any[]) => [
      ...prev,
      {
        id: `room-${Date.now()}`,
        name: "New Room",
        pricePerNight: 0,
        description: "",
        image: "",
      },
    ]);
  };

  const deleteRoom = () => {
    if (!roomToDelete) return;

    setRooms((prev: any[]) =>
      prev.filter((room) => room.id !== roomToDelete.id),
    );

    setRoomToDelete(null);
  };

  const cancelDeleteRoom = () => {
    setRoomToDelete(null);
  };
    const updateRoom = (index: number, changes: any) => {
      setRooms((prev: any[]) =>
        prev.map((room, i) =>
          i === index ? { ...room, ...changes } : room,
        ),
      );
    };

  const updateActivity = (index: number, changes: any) => {
    setActivities((prev: any[]) =>
      prev.map((activity, i) =>
        i === index ? { ...activity, ...changes } : activity,
      ),
    );
  };

  const deleteActivity = () => {
    if (!activityToDelete) return;

    setActivities((prev: any[]) =>
      prev.filter((item) => item.id !== activityToDelete.id),
    );

    setActivityToDelete(null);
  };

  const cancelDeleteActivity = () => {
    setActivityToDelete(null);
  };

  const renderFileInput = (
    id: string,
    onFileSelected: (file: File) => void,
  ) => (
    <div className="w-full space-y-2">
      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-400 bg-white px-4 py-3 text-sm font-semibold text-ocean-800 transition hover:border-turquoise-500 hover:bg-turquoise-50">
        <span>📁 Choose Image</span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploadingId === id}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onFileSelected(file);
            }

            event.target.value = "";
          }}
        />
      </label>

      {uploadingId === id && (
        <p className="flex items-center gap-2 text-sm font-medium text-turquoise-600">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-turquoise-600 border-t-transparent" />
          Uploading image...
        </p>
      )}

      <p className="text-xs text-gray-500">
        Choose an image from your device.
      </p>
    </div>
  );

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsChangingPassword(true);
    setPasswordMessage("");
    setPasswordError(false);

    try {
      const result = await changeAdminPassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );

      if (!result.success) {
        setPasswordError(true);
        setPasswordMessage(result.error ?? "Password change failed.");
        return;
      }

      setPasswordMessage(
        result.message ?? "Password changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      window.location.assign("/admin");
    } catch {
      setPasswordError(true);
      setPasswordMessage(
        "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 px-4 py-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex flex-col items-center justify-between gap-4 bg-ocean-900 p-6 text-white md:flex-row">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "general",
              "about",
              "rooms",
              "activities",
              "security",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-turquoise-500 text-white"
                    : "bg-ocean-800 hover:bg-ocean-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-turquoise-500 px-6 py-2 font-bold text-white transition-colors hover:bg-turquoise-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "💾 Save"}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        {saveMessage && (
          <div
            role="status"
            className={`mx-5 mt-5 flex items-center gap-3 rounded-xl border p-4 md:mx-8 ${
              saveError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-teal-200 bg-teal-50 text-teal-800"
            }`}
          >
            <span className="text-xl" aria-hidden="true">
              {saveError ? "⚠️" : "✓"}
            </span>

            <p className="flex-1 text-sm font-medium">{saveMessage}</p>

            <button
              type="button"
              onClick={() => setSaveMessage("")}
              className="rounded-lg px-3 py-1 font-semibold hover:bg-black/5"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}
        {/* MAIN CONTENT */}
        <div className="p-5 md:p-8">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="border-b pb-2 text-xl font-bold text-ocean-900">
                Website Settings &amp; Homepage Hero
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={config.name ?? ""}
                    onChange={(event) =>
                      setConfig({
                        ...config,
                        name: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                  />
                </div>

                <div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={config.contactEmail ?? ""}
                      onChange={(event) =>
                        setConfig({
                          ...config,
                          contactEmail: event.target.value,
                        })
                      }
                      placeholder="contact@example.com"
                      className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Contact Address
                    </label>
                    <input
                      type="text"
                      value={config.address ?? ""}
                      onChange={(event) =>
                        setConfig({
                          ...config,
                          address: event.target.value,
                        })
                      }
                      placeholder="Taghazout, Morocco"
                      className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                    />
                  </div>

                  <label className="mb-1 block text-sm font-semibold">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={config.whatsappNumber ?? ""}
                    onChange={(event) =>
                      setConfig({
                        ...config,
                        whatsappNumber: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold">
                    Hero Subtitle Text
                  </label>
                  <input
                    type="text"
                    value={config.heroText ?? ""}
                    onChange={(event) =>
                      setConfig({
                        ...config,
                        heroText: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-semibold">
                    Hero Background Image
                  </label>

                  <div className="flex flex-col items-start gap-4 sm:flex-row">
                    {config.heroImage && (
                      <img
                        src={config.heroImage}
                        alt="Hero background preview"
                        className="h-28 w-full rounded-lg border object-cover sm:w-40"
                      />
                    )}

                    <div className="w-full sm:flex-1">
                      {renderFileInput("hero", (file) =>
                        handleImageUpload("hero", file, (url) =>
                          setConfig((prev: any) => ({
                            ...prev,
                            heroImage: url,
                          })),
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="border-b pb-2 text-xl font-bold text-ocean-900">
                About Page Details
              </h2>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  About Title
                </label>
                <input
                  type="text"
                  value={config.aboutTitle ?? ""}
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      aboutTitle: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Paragraph 1
                </label>
                <textarea
                  value={config.aboutText1 ?? ""}
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      aboutText1: event.target.value,
                    })
                  }
                  className="h-24 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Paragraph 2
                </label>
                <textarea
                  value={config.aboutText2 ?? ""}
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      aboutText2: event.target.value,
                    })
                  }
                  className="h-24 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold">
                  About Image
                </label>

                <div className="flex flex-col items-start gap-4 sm:flex-row">
                  {config.aboutImage && (
                    <img
                      src={config.aboutImage}
                      alt="About page preview"
                      className="h-32 w-32 rounded-lg border object-cover"
                    />
                  )}

                  <div className="w-full sm:flex-1">
                    {renderFileInput("about", (file) =>
                      handleImageUpload("about", file, (url) =>
                        setConfig((prev: any) => ({
                          ...prev,
                          aboutImage: url,
                        })),
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROOMS TAB */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              <h2 className="border-b pb-2 text-xl font-bold text-ocean-900">
                Manage Rooms
              </h2>

              {rooms.map((room: any, index: number) => {
                const uploadId = String(room.id);

                return (
                  <div
                    key={room.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-300 bg-sand-50 p-4 md:flex-row"
                  >
                    <div className="w-full md:w-1/4">
                      {room.image && (
                        <img
                          src={room.image}
                          alt={room.name || "Room preview"}
                          className="mb-3 h-32 w-full rounded-lg border object-cover"
                        />
                      )}

                      {renderFileInput(uploadId, (file) =>
                        handleImageUpload(uploadId, file, (url) =>
                          updateRoom(index, { image: url }),
                        ),
                      )}
                    </div>

                    <div className="w-full space-y-2 md:w-3/4">
                      <input
                        type="text"
                        value={room.name ?? ""}
                        onChange={(event) =>
                          updateRoom(index, { name: event.target.value })
                        }
                        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                        placeholder="Room name"
                      />

                      <input
                        type="number"
                        value={room.pricePerNight ?? 0}
                        onChange={(event) =>
                          updateRoom(index, {
                            pricePerNight: Number(event.target.value),
                          })
                        }
                        className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                        placeholder="Price per night"
                      />

                      <textarea
                        value={room.description ?? ""}
                        onChange={(event) =>
                          updateRoom(index, {
                            description: event.target.value,
                          })
                        }
                        className="h-24 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                        placeholder="Room description"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setRoomToDelete(room)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          🗑 Delete Room
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {rooms.length === 0 && (
                <p className="rounded-lg bg-sand-50 p-6 text-center text-gray-500">
                  No rooms available.
                </p>
              )}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={addRoom}
                  className="rounded-lg bg-ocean-800 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700"
                >
                  + Add Room
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === "activities" && (
            <div className="space-y-6">
              <div className="border-b pb-3">
                <h2 className="text-xl font-bold text-ocean-900">
                  Manage Activities
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add, edit, or remove activities from your website.
                </p>
              </div>

              {activities.map((activity: any, index: number) => {
                const uploadId = String(activity.id);

                return (
                  <div
                    key={activity.id}
                    className="flex flex-col gap-4 rounded-xl border border-gray-300 bg-sand-50 p-4 md:flex-row"
                  >
                    <div className="w-full md:w-1/4">
                      {activity.image ? (
                        <img
                          src={activity.image}
                          alt={activity.title || "Activity preview"}
                          className="mb-3 h-32 w-full rounded-lg border object-cover"
                        />
                      ) : (
                        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg border border-dashed border-gray-400 bg-gray-100 text-sm text-gray-500">
                          No image selected
                        </div>
                      )}

                      {renderFileInput(uploadId, (file) =>
                        handleImageUpload(uploadId, file, (url) =>
                          updateActivity(index, { image: url }),
                        ),
                      )}
                    </div>

                    <div className="w-full space-y-3 md:flex-1">
                      <input
                        type="text"
                        value={activity.title ?? ""}
                        onChange={(event) =>
                          updateActivity(index, {
                            title: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border p-3 font-bold outline-none focus:ring-2 focus:ring-turquoise-500"
                        placeholder="Activity title"
                      />

                      <textarea
                        value={activity.description ?? ""}
                        onChange={(event) =>
                          updateActivity(index, {
                            description: event.target.value,
                          })
                        }
                        className="h-24 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                        placeholder="Activity description"
                      />

                      <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActivityToDelete(activity)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
                      >
                        <span aria-hidden="true">🗑</span>
                        Delete Activity
                      </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activities.length === 0 && (
                <p className="rounded-lg bg-sand-50 p-6 text-center text-gray-500">
                  No activities available. Add your first activity below.
                </p>
              )}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={addActivity}
                  className="rounded-lg bg-ocean-800 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700"
                >
                  + Add Activity
                </button>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <h2 className="border-b pb-2 text-xl font-bold text-ocean-900">
                  Change Admin Password
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Enter your current password and choose a new password.
                  You will need to log in again after changing it.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1 block text-sm font-semibold"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    minLength={12}
                    maxLength={72}
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use 12-72 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    minLength={12}
                    maxLength={72}
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
                    required
                  />
                </div>

                {passwordMessage && (
                  <p
                    role="alert"
                    className={`rounded-lg p-3 text-sm ${
                      passwordError
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-lg bg-ocean-800 px-6 py-3 font-bold text-white transition-colors hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isChangingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* DELETE ACTIVITY CONFIRMATION MODAL */}
        {activityToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-900/60 px-4 py-6 backdrop-blur-sm"
            onClick={cancelDeleteActivity}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-activity-title"
              className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-8 w-8 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"
                  />
                </svg>
              </div>

              <h2
                id="delete-activity-title"
                className="text-center text-xl font-bold text-ocean-900"
              >
                Delete Activity?
              </h2>

              <p className="mt-3 text-center text-sm leading-6 text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-ocean-900">
                  &quot;
                  {activityToDelete.title || "Untitled Activity"}
                  &quot;
                </span>
                ?
              </p>

              <p className="mt-2 text-center text-xs leading-5 text-gray-500">
                This activity will be removed from your list.
                Remember to click Save to apply the changes to your website.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={cancelDeleteActivity}
                  className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteActivity}
                  className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:scale-95"
                >
                  🗑 Delete Activity
                </button>
              </div>
            </div>
          </div>
        )}
        {/* DELETE ROOM CONFIRMATION MODAL */}
          {roomToDelete && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-900/60 px-4 py-6 backdrop-blur-sm"
              onClick={cancelDeleteRoom}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-room-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <h2
                  id="delete-room-title"
                  className="text-center text-xl font-bold text-ocean-900"
                >
                  Delete Room?
                </h2>

                <p className="mt-3 text-center text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  <strong>{roomToDelete.name || "Untitled Room"}</strong>?
                </p>

                <p className="mt-2 text-center text-xs text-gray-500">
                  Click Save after confirming to apply the changes.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={cancelDeleteRoom}
                    className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={deleteRoom}
                    className="flex-1 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    🗑 Delete Room
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
