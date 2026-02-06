'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  toast,
  Spinner,
  Textarea,
  Badge,
} from '@arabiaaislamia/ui';
import {
  listSections,
  updateSection,
  createSection,
  type SiteSectionDto,
} from '@/services/cms.service';

const SECTION_TYPES = ['white', 'faculties', 'statistics', 'news', 'donate'] as const;

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SiteSectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SiteSectionDto | null>(null);
  const [form, setForm] = useState({
    sectionKey: '',
    sectionType: 'white' as string,
    contentJson: '{}',
    sortOrder: 0,
    isVisible: true,
  });
  const [saving, setSaving] = useState(false);
  const [addMode, setAddMode] = useState(false);

  const load = () => {
    setLoading(true);
    listSections('home')
      .then(setSections)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Failed to load sections'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (section: SiteSectionDto) => {
    setEditing(section);
    setAddMode(false);
    setForm({
      sectionKey: section.sectionKey,
      sectionType: section.sectionType,
      contentJson:
        typeof section.content === 'object' && section.content !== null
          ? JSON.stringify(section.content, null, 2)
          : '{}',
      sortOrder: section.sortOrder ?? 0,
      isVisible: section.isVisible ?? true,
    });
    setOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setAddMode(true);
    setForm({
      sectionKey: '',
      sectionType: 'white',
      contentJson: '{}',
      sortOrder: sections.length,
      isVisible: true,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(form.contentJson) as Record<string, unknown>;
    } catch {
      toast.error('Invalid JSON in content');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateSection(editing.id, {
          sectionKey: form.sectionKey,
          sectionType: form.sectionType,
          content,
          sortOrder: form.sortOrder,
          isVisible: form.isVisible,
        });
        toast.success('Section updated');
      } else {
        await createSection({
          page: 'home',
          sectionKey: form.sectionKey,
          sectionType: form.sectionType,
          content,
          sortOrder: form.sortOrder,
          isVisible: form.isVisible,
        });
        toast.success('Section created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setEditing(null);
          setAddMode(true);
          setForm({
            sectionKey: '',
            sectionType: 'white',
            contentJson: '{}',
            sortOrder: sections.length,
            isVisible: true,
          });
        }
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-950">Sections</h1>
            <p className="mt-1 text-sm text-amber-700">Edit home page sections (white, faculties, stats, news, donate)</p>
          </div>
          <DialogTrigger asChild>
            <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add section
            </Button>
          </DialogTrigger>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : sections.length === 0 ? (
          <Card className="border border-amber-200/80 bg-white/80 shadow-sm">
            <CardContent className="py-12 text-center text-amber-700">
              No sections for home page. Add sections to control content from CMS.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id} className="border border-amber-200/80 bg-white/80 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg text-amber-950">
                    {section.sectionKey}
                    <Badge variant="secondary" className="ml-2 border-amber-200 text-amber-800">
                      {section.sectionType}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {!section.isVisible && (
                      <Badge variant="outline" className="border-amber-400 text-amber-700">
                        Hidden
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-200 text-amber-900 hover:bg-amber-100"
                      onClick={() => openEdit(section)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-24 overflow-auto rounded bg-amber-50 p-2 text-xs text-amber-800">
                    {JSON.stringify(section.content ?? {}, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogContent className="max-h-[90vh] overflow-y-auto border-amber-200/80 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-amber-950">{editing ? 'Edit section' : 'Add section'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-amber-900">Section key (e.g. home_white, home_faculties)</Label>
              <Input
                value={form.sectionKey}
                onChange={(e) => setForm((f) => ({ ...f, sectionKey: e.target.value }))}
                placeholder="home_white"
                className="mt-1 border-amber-200 bg-white text-amber-950"
                required
                disabled={!!editing}
              />
            </div>
            <div>
              <Label className="text-amber-900">Section type</Label>
              <select
                value={form.sectionType}
                onChange={(e) => setForm((f) => ({ ...f, sectionType: e.target.value }))}
                className="mt-1 w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-amber-950"
              >
                {SECTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-amber-900">Content (JSON)</Label>
              <Textarea
                value={form.contentJson}
                onChange={(e) => setForm((f) => ({ ...f, contentJson: e.target.value }))}
                placeholder='{"heading": "...", "body": "..."}'
                rows={12}
                className="mt-1 font-mono text-sm border-amber-200 bg-white text-amber-950"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-amber-900">Sort order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                  className="mt-1 border-amber-200 bg-white text-amber-950"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-amber-900">
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
                    className="rounded border-amber-200"
                  />
                  Visible on home page
                </label>
              </div>
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
      </div>
    </Dialog>
  );
}
