"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  softwareFocusFilters,
  workCategories,
  type Project,
  type ProjectImage,
  type SoftwareFocus,
  type WorkCategoryId,
} from "@/lib/content";
import { cn } from "@/lib/cn";

type ProjectFormProps = {
  mode: "create" | "edit";
  initial?: Project;
};

type FormState = {
  name: string;
  slug: string;
  year: string;
  role: string;
  summary: string;
  intro: string;
  overview: string;
  contribution: string;
  featuresText: string;
  technologiesText: string;
  categories: WorkCategoryId[];
  softwareFocus: SoftwareFocus[];
  cover: ProjectImage | null;
  screenshots: ProjectImage[];
  liveUrl: string;
  githubUrl: string;
  presentation: "modal" | "page";
  featured: boolean;
  draft: boolean;
  sortOrder: number;
};

function toState(project?: Project): FormState {
  return {
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    year: project?.year ?? "",
    role: project?.role ?? "",
    summary: project?.summary ?? "",
    intro: project?.intro ?? "",
    overview: project?.overview ?? "",
    contribution: project?.contribution ?? "",
    featuresText: (project?.features ?? []).join("\n"),
    technologiesText: (project?.technologies ?? []).join(", "),
    categories: project?.categories?.length
      ? project.categories
      : (["software"] as WorkCategoryId[]),
    softwareFocus: project?.softwareFocus ?? [],
    cover: project?.cover ?? null,
    screenshots: project?.screenshots ?? [],
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    presentation: project?.presentation ?? "modal",
    featured: project?.featured ?? false,
    draft: project?.draft ?? false,
    sortOrder: 0,
  };
}

function linesToList(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProjectForm({ mode, initial }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const title = useMemo(
    () => (mode === "create" ? "New project" : `Edit ${initial?.name ?? ""}`),
    [mode, initial?.name],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleCategory(id: WorkCategoryId) {
    setForm((current) => {
      const exists = current.categories.includes(id);
      const next = exists
        ? current.categories.filter((item) => item !== id)
        : [...current.categories, id];
      return {
        ...current,
        categories: next.length ? next : current.categories,
      };
    });
  }

  function toggleFocus(id: SoftwareFocus) {
    setForm((current) => {
      const exists = current.softwareFocus.includes(id);
      return {
        ...current,
        softwareFocus: exists
          ? current.softwareFocus.filter((item) => item !== id)
          : [...current.softwareFocus, id],
      };
    });
  }

  async function uploadImage(file: File): Promise<ProjectImage> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Upload failed");
    return { src: data.src, alt: data.alt || file.name };
  }

  async function onCoverChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const image = await uploadImage(file);
      update("cover", image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onScreenshotsChange(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: ProjectImage[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImage(file));
      }
      setForm((current) => ({
        ...current,
        screenshots: [...current.screenshots, ...uploaded],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: initial?.id,
      name: form.name,
      slug: form.slug,
      year: form.year,
      role: form.role,
      summary: form.summary,
      intro: form.intro,
      overview: form.overview,
      contribution: form.contribution,
      features: form.featuresText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      technologies: linesToList(form.technologiesText),
      categories: form.categories,
      softwareFocus: form.softwareFocus,
      cover: form.cover ?? undefined,
      screenshots: form.screenshots,
      images: [],
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
      presentation: form.presentation,
      featured: form.featured,
      draft: form.draft,
      sortOrder: form.sortOrder,
    };

    try {
      const response = await fetch(
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initial!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!window.confirm(`Delete “${initial.name}”? This cannot be undone.`)) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/projects/${initial.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-label text-muted">Admin</p>
          <h1 className="text-title mt-3 text-3xl">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-line"
            onClick={() => router.push("/admin")}
          >
            Back
          </button>
          {mode === "edit" ? (
            <button
              type="button"
              className="btn btn-line"
              onClick={onDelete}
              disabled={saving}
            >
              Delete
            </button>
          ) : null}
          <button type="submit" className="btn btn-solid" disabled={saving || uploading}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      {error ? (
        <p className="border border-line bg-bg-elevated px-4 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-label text-muted">Name</span>
          <input
            required
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Slug</span>
          <input
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.slug}
            onChange={(event) => update("slug", event.target.value)}
            placeholder="auto from name"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Year</span>
          <input
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.year}
            onChange={(event) => update("year", event.target.value)}
          />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-label text-muted">Role</span>
          <input
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.role}
            onChange={(event) => update("role", event.target.value)}
          />
        </label>
      </section>

      <section className="space-y-3">
        <p className="text-label text-muted">Categories</p>
        <div className="flex flex-wrap gap-2">
          {workCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={cn(
                "btn border px-3 py-2",
                form.categories.includes(category.id)
                  ? "btn-solid border-transparent"
                  : "border-line bg-transparent text-muted",
              )}
              onClick={() => toggleCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {form.categories.includes("software") ? (
        <section className="space-y-3">
          <p className="text-label text-muted">Software focus</p>
          <div className="flex flex-wrap gap-2">
            {softwareFocusFilters
              .filter((item) => item.id !== "all")
              .map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={cn(
                    "btn border px-3 py-2",
                    form.softwareFocus.includes(filter.id as SoftwareFocus)
                      ? "btn-solid border-transparent"
                      : "border-line bg-transparent text-muted",
                  )}
                  onClick={() => toggleFocus(filter.id as SoftwareFocus)}
                >
                  {filter.label}
                </button>
              ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5">
        <label className="block space-y-2">
          <span className="text-label text-muted">Summary</span>
          <textarea
            rows={3}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Intro</span>
          <textarea
            rows={3}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.intro}
            onChange={(event) => update("intro", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Overview</span>
          <textarea
            rows={5}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.overview}
            onChange={(event) => update("overview", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Contribution</span>
          <textarea
            rows={4}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.contribution}
            onChange={(event) => update("contribution", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">Features (one per line)</span>
          <textarea
            rows={4}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.featuresText}
            onChange={(event) => update("featuresText", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">
            Technologies (comma or line separated)
          </span>
          <textarea
            rows={2}
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.technologiesText}
            onChange={(event) => update("technologiesText", event.target.value)}
          />
        </label>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-label text-muted">Live / Preview URL</span>
          <input
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.liveUrl}
            onChange={(event) => update("liveUrl", event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-label text-muted">GitHub URL</span>
          <input
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.githubUrl}
            onChange={(event) => update("githubUrl", event.target.value)}
            placeholder="https://github.com/..."
          />
        </label>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-label text-muted">Cover image</p>
          {form.cover?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.cover.src}
              alt={form.cover.alt}
              className="mt-3 max-h-48 border border-line object-contain"
            />
          ) : null}
          <label className="mt-3 block space-y-2">
            <span className="text-label text-muted">Cover URL</span>
            <input
              className="w-full border border-line bg-bg px-3 py-2"
              value={form.cover?.src ?? ""}
              onChange={(event) =>
                update(
                  "cover",
                  event.target.value.trim()
                    ? {
                        src: event.target.value.trim(),
                        alt: form.cover?.alt || form.name || "Cover",
                      }
                    : null,
                )
              }
              placeholder="/images/projects/... or https://..."
            />
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-3 block w-full text-sm"
            disabled={uploading}
            onChange={(event) =>
              onCoverChange(event.target.files?.[0] ?? null)
            }
          />
        </div>
        <div>
          <p className="text-label text-muted">Screenshots</p>
          {form.screenshots.length > 0 ? (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.screenshots.map((image) => (
                <li key={image.src} className="relative border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 bg-bg px-2 py-1 text-[10px] uppercase tracking-wide"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        screenshots: current.screenshots.filter(
                          (item) => item.src !== image.src,
                        ),
                      }))
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <input
            type="file"
            accept="image/*"
            multiple
            className="mt-3 block w-full text-sm"
            disabled={uploading}
            onChange={(event) => onScreenshotsChange(event.target.files)}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-label text-muted">Presentation</span>
          <select
            className="w-full border border-line bg-bg px-3 py-2"
            value={form.presentation}
            onChange={(event) =>
              update(
                "presentation",
                event.target.value as FormState["presentation"],
              )
            }
          >
            <option value="modal">Modal</option>
            <option value="page">Page</option>
          </select>
        </label>
        <label className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
          />
          <span className="text-label">Featured</span>
        </label>
        <label className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            checked={form.draft}
            onChange={(event) => update("draft", event.target.checked)}
          />
          <span className="text-label">Draft (hidden)</span>
        </label>
      </section>
    </form>
  );
}
