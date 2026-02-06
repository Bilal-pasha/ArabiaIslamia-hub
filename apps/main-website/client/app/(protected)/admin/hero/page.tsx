'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  toast,
  Spinner,
} from '@arabiaaislamia/ui';
import {
  listHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  type HeroSlideDto,
} from '@/services/cms.service';
import { uploadFile } from '@/services/upload.service';

const defaultSlide = {
  desktopImageUrl: '',
  mobileImageUrl: '',
  title: '',
  subtitle: '',
  sortOrder: 0,
  isActive: true,
};

type ImageField = 'desktopImageUrl' | 'mobileImageUrl';

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlideDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlideDto | null>(null);
  const [form, setForm] = useState(defaultSlide);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    listHeroSlides()
      .then(setSlides)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load slides'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultSlide);
    setOpen(true);
  };

  const openEdit = (slide: HeroSlideDto) => {
    setEditing(slide);
    setForm({
      desktopImageUrl: slide.desktopImageUrl,
      mobileImageUrl: slide.mobileImageUrl,
      title: slide.title ?? '',
      subtitle: slide.subtitle ?? '',
      sortOrder: slide.sortOrder ?? 0,
      isActive: slide.isActive ?? true,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateHeroSlide(editing.id, form);
        toast.success('Slide updated');
      } else {
        await createHeroSlide(form);
        toast.success('Slide added');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteHeroSlide(deleteId);
      toast.success('Slide deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = async (field: ImageField, file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
      if (file) toast.error('Please select an image file (e.g. JPG, PNG)');
      setUploadingField(null);
      return;
    }
    setUploadingField(field);
    try {
      const url = await uploadFile(`hero-${field}`, file);
      setForm((f) => ({ ...f, [field]: url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-950">Hero carousel</h1>
            <p className="mt-1 text-sm text-amber-700">Manage hero slides on the home page</p>
          </div>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              setEditing(null);
              setForm(defaultSlide);
              setOpen(true);
            }}
          >
            Add slide
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : slides.length === 0 ? (
          <Card className="border border-amber-200/80 bg-white/80 shadow-sm">
            <CardContent className="py-12 text-center text-amber-700">
              No hero slides yet. Add one to show on the home page.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slides.map((slide) => (
              <Card key={slide.id} className="overflow-hidden border border-amber-200/80 bg-white/80 shadow-sm">
                <div className="relative aspect-video w-full bg-amber-100">
                  <Image
                    src={slide.desktopImageUrl || '/images/Logo.png'}
                    alt={slide.title || 'Slide'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="truncate text-base text-amber-950">
                    {slide.title || 'Untitled'}
                  </CardTitle>
                  <p className="truncate text-sm text-amber-700">{slide.subtitle}</p>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-200 text-amber-900 hover:bg-amber-100"
                    onClick={() => openEdit(slide)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteId(slide.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogContent className="border-amber-200/80 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-amber-950">{editing ? 'Edit slide' : 'Add slide'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={desktopInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleFileSelect('desktopImageUrl', file ?? null);
                e.target.value = '';
              }}
            />
            <input
              ref={mobileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleFileSelect('mobileImageUrl', file ?? null);
                e.target.value = '';
              }}
            />
            <div>
              <Label className="text-amber-900">Desktop image</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={form.desktopImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, desktopImageUrl: e.target.value }))}
                  placeholder="URL or upload below"
                  className="flex-1 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-amber-200 text-amber-900 hover:bg-amber-50"
                  disabled={uploadingField === 'desktopImageUrl'}
                  onClick={() => desktopInputRef.current?.click()}
                >
                  {uploadingField === 'desktopImageUrl' ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1 text-xs text-amber-600">Upload or paste URL</p>
            </div>
            <div>
              <Label className="text-amber-900">Mobile image</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={form.mobileImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, mobileImageUrl: e.target.value }))}
                  placeholder="URL or upload below"
                  className="flex-1 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-amber-200 text-amber-900 hover:bg-amber-50"
                  disabled={uploadingField === 'mobileImageUrl'}
                  onClick={() => mobileInputRef.current?.click()}
                >
                  {uploadingField === 'mobileImageUrl' ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1 text-xs text-amber-600">Upload or paste URL</p>
            </div>
            <div>
              <Label className="text-amber-900">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. جامعہ عربیہ اسلامیہ"
                className="mt-1 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
              />
            </div>
            <div>
              <Label className="text-amber-900">Subtitle</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. اسکاؤٹ کالونی"
                className="mt-1 border-amber-200 bg-white text-amber-950 placeholder:text-amber-500"
              />
            </div>
            <div>
              <Label className="text-amber-900">Sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                className="mt-1 border-amber-200 bg-white text-amber-950"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="border-amber-200 text-amber-900 hover:bg-amber-50" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>

        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent className="border-amber-200/80 bg-white shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-amber-950">Delete slide?</AlertDialogTitle>
              <AlertDialogDescription className="text-amber-700">
                This slide will be removed from the hero carousel. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-amber-200 text-amber-900 hover:bg-amber-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Dialog>
  );
}
