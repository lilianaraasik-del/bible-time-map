import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2, Upload, ArrowLeft, BookOpen, User as UserIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface BookRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  author: string | null;
  language: string;
  cover_path: string | null;
  file_path: string;
  format: string;
  is_free: boolean;
  sort_order: number;
  published_at: string | null;
}

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export default function AdminEraamatud() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [books, setBooks] = useState<BookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importLog, setImportLog] = useState<string[]>([]);

  const onImportFromApi = async (overwrite = false) => {
    if (importing) return;
    if (!confirm(overwrite
      ? "Impordi kõik API-st üle (asenda olemasolevad)?"
      : "Impordi kõik raamatud api.piibel.ee-st (vahele jätta juba imporditud)?")) return;
    setImporting(true);
    setImportLog([]);
    try {
      let offset: number | null = 0;
      let totalImported = 0, totalSkipped = 0, totalFailed = 0, totalCount = 0;
      while (offset !== null) {
        setImportLog((l) => [...l, `Töötlen alates ${offset}...`]);
        const { data, error } = await supabase.functions.invoke("import-eraamatud", {
          body: { offset, limit: 5, overwrite },
        });
        if (error) throw error;
        const res = data as {
          total: number; nextOffset: number | null;
          imported: number; skipped: number; failed: number;
          items: { title: string; status: string; reason?: string }[];
        };
        totalCount = res.total;
        totalImported += res.imported;
        totalSkipped += res.skipped;
        totalFailed += res.failed;
        setImportLog((l) => [
          ...l,
          ...res.items.map((it) => `  ${it.status === "failed" ? "✗" : "✓"} ${it.title}${it.reason ? ` (${it.reason})` : ""}`),
        ]);
        offset = res.nextOffset;
      }
      toast({
        title: "Import valmis",
        description: `${totalImported} imporditud, ${totalSkipped} vahele jäetud, ${totalFailed} ebaõnnestus (${totalCount} kokku)`,
      });
      void loadBooks();
    } catch (e) {
      toast({ title: "Impordi viga", description: e instanceof Error ? e.message : "Tundmatu viga", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  // form
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("et");
  const [isFree, setIsFree] = useState(false);
  const [publishNow, setPublishNow] = useState(true);
  const [cover, setCover] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading && !session) navigate("/login");
  }, [authLoading, session, navigate]);

  const loadBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Viga", description: error.message, variant: "destructive" });
    setBooks((data as BookRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) void loadBooks();
  }, [isAdmin]);

  const reset = () => {
    setTitle(""); setAuthor(""); setDescription(""); setLanguage("et");
    setIsFree(false); setPublishNow(true); setCover(null); setFile(null);
  };

  const onUpload = async () => {
    if (!title.trim() || !file) {
      toast({ title: "Puudu", description: "Pealkiri ja raamatu fail on kohustuslikud", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const slugBase = slugify(title);
      const slug = `${slugBase}-${Date.now().toString(36)}`;
      const ext = file.name.split(".").pop()?.toLowerCase() || "epub";
      const format = ext === "pdf" ? "pdf" : "epub";
      const filePath = `files/${slug}.${ext}`;

      const { error: fileErr } = await supabase.storage
        .from("eraamatud")
        .upload(filePath, file, { contentType: file.type || (format === "pdf" ? "application/pdf" : "application/epub+zip") });
      if (fileErr) throw fileErr;

      let coverPath: string | null = null;
      if (cover) {
        const coverExt = cover.name.split(".").pop()?.toLowerCase() || "jpg";
        coverPath = `covers/${slug}.${coverExt}`;
        const { error: coverErr } = await supabase.storage
          .from("eraamatud")
          .upload(coverPath, cover, { contentType: cover.type || "image/jpeg" });
        if (coverErr) throw coverErr;
      }

      const { error: insertErr } = await supabase.from("books").insert({
        slug,
        title: title.trim(),
        description: description.trim() || null,
        author: author.trim() || null,
        language,
        cover_path: coverPath,
        file_path: filePath,
        format,
        is_free: isFree,
        published_at: publishNow ? new Date().toISOString() : null,
      });
      if (insertErr) throw insertErr;

      toast({ title: "Üles laetud", description: title });
      reset();
      void loadBooks();
    } catch (e) {
      toast({ title: "Viga", description: e instanceof Error ? e.message : "Üleslaadimine ebaõnnestus", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (book: BookRow) => {
    if (!confirm(`Kustutada "${book.title}"?`)) return;
    try {
      const paths = [book.file_path];
      if (book.cover_path) paths.push(book.cover_path);
      await supabase.storage.from("eraamatud").remove(paths);
      const { error } = await supabase.from("books").delete().eq("id", book.id);
      if (error) throw error;
      toast({ title: "Kustutatud" });
      void loadBooks();
    } catch (e) {
      toast({ title: "Viga", description: e instanceof Error ? e.message : "Kustutamine ebaõnnestus", variant: "destructive" });
    }
  };

  const togglePublished = async (book: BookRow) => {
    const next = book.published_at ? null : new Date().toISOString();
    const { error } = await supabase.from("books").update({ published_at: next }).eq("id", book.id);
    if (error) toast({ title: "Viga", description: error.message, variant: "destructive" });
    else void loadBooks();
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-3">Ligipääs keelatud</h1>
          <p className="text-muted-foreground">Sul ei ole admin õigusi.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl font-bold">Admin: e-raamatute haldus</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/eraamatud">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Tagasi
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/eraamatud">
                <BookOpen className="w-4 h-4 mr-1.5" />
                E-raamatud
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/profiil">
                <UserIcon className="w-4 h-4 mr-1.5" />
                Minu profiil
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold">Laadi üles uus raamat</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Pealkiri *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Autor</Label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  list="author-options"
                  placeholder="Vali olemasolev või kirjuta uus"
                />
                <datalist id="author-options">
                  {Array.from(new Set(books.map((b) => b.author).filter((a): a is string => !!a && a.trim().length > 0)))
                    .sort((a, b) => a.localeCompare(b, "et"))
                    .map((a) => (
                      <option key={a} value={a} />
                    ))}
                </datalist>
              </div>
              <div className="md:col-span-2">
                <Label>Kirjeldus</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <Label>Keel</Label>
                <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="et" />
              </div>
              <div>
                <Label>Raamatu fail * (EPUB või PDF)</Label>
                <Input type="file" accept=".epub,.pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              <div>
                <Label>Kaanepilt</Label>
                <Input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
              </div>
              <div className="flex items-end gap-6">
                <label className="flex items-center gap-2">
                  <Checkbox checked={isFree} onCheckedChange={(v) => setIsFree(v === true)} />
                  <span>Tasuta (kõigile)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={publishNow} onCheckedChange={(v) => setPublishNow(v === true)} />
                  <span>Avalda kohe</span>
                </label>
              </div>
            </div>
            <Button onClick={onUpload} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Laadi üles
            </Button>
          </CardContent>
        </Card>

        <div>
          <h2 className="font-serif text-xl font-semibold mb-3">Olemasolevad raamatud ({books.length})</h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground">Veel pole raamatuid.</p>
          ) : (
            <div className="space-y-2">
              {books.map((b) => (
                <Card key={b.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {b.author || "—"} · {b.format.toUpperCase()} · {b.is_free ? "tasuta" : "tellimus"} ·{" "}
                        {b.published_at ? "avaldatud" : "mustand"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => togglePublished(b)}>
                        {b.published_at ? "Peida" : "Avalda"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(b)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
