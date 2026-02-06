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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero carousel</h1>
          <p className="mt-1 text-sm text-slate-400">Manage hero slides on the home page</p>
        </div>
        <Button onClick={openAdd} className="bg-amber-500 hover:bg-amber-600">
          Add slide
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-8 text-amber-400" />
        </div>
      ) : slides.length === 0 ? (
        <Card className="border border-white/10 bg-white/5">
          <CardContent className="py-12 text-center text-slate-400">
            No hero slides yet. Add one to show on the home page.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden border border-white/10 bg-white/5">
              <div className="relative aspect-video w-full bg-slate-800">
                <Image
                  src={slide.desktopImageUrl || '/images/Logo.png'}
                  alt={slide.title || 'Slide'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="truncate text-base text-white">
                  {slide.title || 'Untitled'}
                </CardTitle>
                <p className="truncate text-sm text-slate-400">{slide.subtitle}</p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => openEdit(slide)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-400/50 text-red-300 hover:bg-red-500/20"
                  onClick={() => setDeleteId(slide.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit slide' : 'Add slide'}</DialogTitle>
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
              <Label className="text-slate-200">Desktop image</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={form.desktopImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, desktopImageUrl: e.target.value }))}
                  placeholder="URL or upload below"
                  className="flex-1 border-white/20 bg-white/5 text-white"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-white/20 text-white hover:bg-white/10"
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
              <p className="mt-1 text-xs text-slate-500">Upload or paste URL</p>
            </div>
            <div>
              <Label className="text-slate-200">Mobile image</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={form.mobileImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, mobileImageUrl: e.target.value }))}
                  placeholder="URL or upload below"
                  className="flex-1 border-white/20 bg-white/5 text-white"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 border-white/20 text-white hover:bg-white/10"
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
              <p className="mt-1 text-xs text-slate-500">Upload or paste URL</p>
            </div>
            <div>
              <Label className="text-slate-200">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. جامعہ عربیہ اسلامیہ"
                className="mt-1 border-white/20 bg-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-200">Subtitle</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="e.g. اسکاؤٹ کالونی"
                className="mt-1 border-white/20 bg-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-200">Sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                className="mt-1 border-white/20 bg-white/5 text-white"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-600">
                {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="border-white/10 bg-slate-900 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete slide?</AlertDialogTitle>
            <AlertDialogDescription>
              This slide will be removed from the hero carousel. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
