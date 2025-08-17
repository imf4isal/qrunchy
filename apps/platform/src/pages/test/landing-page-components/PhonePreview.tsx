import React from "react";

export const PhonePreview: React.FC<{
  theme: "light" | "dark";
  mode: "photo" | "digital";
  children?: React.ReactNode;
}> = ({ theme, mode, children }) => {
  const dark = theme === "dark";
  return (
    <div
      className={`relative mx-auto h-[520px] w-[260px] rounded-[36px] border p-4 shadow-2xl ${
        dark
          ? "border-neutral-800 bg-neutral-900"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div
        className={`absolute inset-x-12 -top-2 h-6 rounded-full ${
          dark ? "bg-neutral-800" : "bg-neutral-200"
        }`}
      />
      {/* Shell as column; content is clipped (no scrollbar) */}
      <div
        className={`flex h-full flex-col overflow-hidden rounded-2xl border ${
          dark
            ? "border-neutral-800 bg-neutral-950"
            : "border-neutral-200 bg-neutral-50"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            dark ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <div
            className={`h-4 w-20 rounded ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}
          />
          <div
            className={`h-6 w-6 rounded ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}
          />
        </div>
        {/* Content (no scrolling) */}
        <div className="flex-1 min-h-0 overflow-hidden p-4 space-y-3">
          {mode === "photo" && children ? (
            children
          ) : mode === "photo" ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg ${
                    dark ? "bg-neutral-800" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
          ) : (
            children || (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-lg p-3 ${
                      dark ? "bg-neutral-900" : "bg-white"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded ${
                        dark ? "bg-neutral-800" : "bg-neutral-200"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div
                        className={`h-3 w-24 rounded ${
                          dark ? "bg-neutral-800" : "bg-neutral-200"
                        }`}
                      />
                      <div
                        className={`h-2 w-16 rounded ${
                          dark ? "bg-neutral-700" : "bg-neutral-300"
                        }`}
                      />
                    </div>
                    <div
                      className={`h-4 w-12 rounded ${
                        dark ? "bg-neutral-800" : "bg-neutral-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};