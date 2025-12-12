import { useEffect, useMemo, useState } from 'react';
import { fetchTemplateSet, saveTemplateSetVersion } from '@/infrastructure/api/template-set-client';
import { TemplateDoc } from '@/domain/templates/template-set';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';
import { Loader2, Save, Undo2, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/presentation/hooks/use-toast';

const cloneTemplates = (templates: TemplateDoc[]): TemplateDoc[] => JSON.parse(JSON.stringify(templates));
const toMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

const formatTimestamp = (iso?: string) => iso ? new Date(iso).toLocaleString() : '-';

const AdminTemplateVersionEditor = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<{
    standardMajor: number;
    standardVersion: string;
    generatedAt: string;
  } | null>(null);
  const [baselineTemplates, setBaselineTemplates] = useState<TemplateDoc[]>([]);
  const [templates, setTemplates] = useState<TemplateDoc[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nextVersion, setNextVersion] = useState('');

  const selectedTemplate = useMemo(
    () => templates.find(t => t.id === selectedId) ?? null,
    [templates, selectedId],
  );

  const dirty = useMemo(() => {
    if (!currentVersion) return false;
    const baseline = JSON.stringify({
      version: currentVersion.standardVersion,
      templates: baselineTemplates,
    });
    const current = JSON.stringify({ version: nextVersion, templates });
    return baseline !== current;
  }, [currentVersion, baselineTemplates, nextVersion, templates]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTemplateSet();
      setCurrentVersion({
        standardMajor: data.standardMajor,
        standardVersion: data.standardVersion,
        generatedAt: data.generatedAt,
      });
      const cloned = cloneTemplates(data.templates);
      setTemplates(cloned);
      setBaselineTemplates(cloned);
      setSelectedId(data.templates[0]?.id ?? null);
      setNextVersion(data.standardVersion);
    } catch (e: unknown) {
      setError(toMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateFrontMatter = (id: string, key: string, value: unknown) => {
    setTemplates(prev => prev.map(t => (t.id === id ? { ...t, frontMatter: { ...t.frontMatter, [key]: value } } : t)));
  };

  const updateBody = (id: string, value: string) => {
    setTemplates(prev => prev.map(t => (t.id === id ? { ...t, body: value } : t)));
  };

  const handleSave = async () => {
    if (!currentVersion) return;
    setSaving(true);
    try {
      const payload = {
        targetMajor: currentVersion.standardMajor,
        nextVersion,
        templates,
      };
      const saved = await saveTemplateSetVersion(payload);
      toast({ title: '保存しました', description: `v${saved.standardMajor}.${saved.standardVersion} を反映しました。` });
      setCurrentVersion({
        standardMajor: saved.standardMajor,
        standardVersion: saved.standardVersion,
        generatedAt: saved.generatedAt,
      });
      const cloned = cloneTemplates(saved.templates);
      setTemplates(cloned);
      setBaselineTemplates(cloned);
      setSelectedId(saved.templates[0]?.id ?? null);
      setNextVersion(saved.standardVersion);
    } catch (e: unknown) {
      toast({ title: '保存に失敗しました', description: toMessage(e), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>テンプレセットの取得に失敗しました</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={load} variant="outline">再試行</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">テンプレセット バージョン編集</h1>
          {currentVersion && (
            <p className="text-sm text-muted-foreground">
              現行: v{currentVersion.standardMajor}.{currentVersion.standardVersion} / 最終更新 {formatTimestamp(currentVersion.generatedAt)}
            </p>
          )}
        </div>
        {dirty && (
          <Badge variant="secondary">未保存の変更あり</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>バージョン設定</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="text-sm text-muted-foreground">次の標準バージョン</label>
              <Input value={nextVersion} onChange={e => setNextVersion(e.target.value)} className="w-40" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">対象メジャー</label>
              <Input value={currentVersion?.standardMajor ?? ''} readOnly className="w-32 bg-muted" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">manifest 生成日時</label>
              <Input value={formatTimestamp(currentVersion?.generatedAt)} readOnly className="w-64 bg-muted" />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
              新しいバージョンとして保存
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={saving}>
              <Undo2 className="mr-2 h-4 w-4" />
              変更を破棄
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>テンプレ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {templates.map(t => (
                <Button
                  key={t.id}
                  variant={t.id === selectedId ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setSelectedId(t.id)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t.frontMatter.title || t.id}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>テンプレ編集</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">テンプレID</label>
                    <Input value={selectedTemplate.id} readOnly className="bg-muted" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">タイトル</label>
                    <Input
                      value={selectedTemplate.frontMatter.title ?? ''}
                      onChange={e => updateFrontMatter(selectedTemplate.id, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">カテゴリ</label>
                    <Input
                      value={selectedTemplate.frontMatter.category ?? ''}
                      onChange={e => updateFrontMatter(selectedTemplate.id, 'category', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">タグ（カンマ区切り）</label>
                    <Input
                      value={(selectedTemplate.frontMatter.tags || []).join(', ')}
                      onChange={e => updateFrontMatter(
                        selectedTemplate.id,
                        'tags',
                        e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">説明</label>
                  <Textarea
                    value={selectedTemplate.frontMatter.description ?? ''}
                    onChange={e => updateFrontMatter(selectedTemplate.id, 'description', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-muted-foreground">本文（Markdown）</label>
                    <Badge variant="outline">最終更新 {formatTimestamp(selectedTemplate.updatedAt)}</Badge>
                  </div>
                  <Textarea
                    className="min-h-[320px] font-mono"
                    value={selectedTemplate.body}
                    onChange={e => updateBody(selectedTemplate.id, e.target.value)}
                  />
                </div>

                <Separator />
                <p className="text-xs text-muted-foreground">
                  テンプレ単体での保存はできません。上部の「新しいバージョンとして保存」からセット単位で反映されます。
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">テンプレートを選択してください。</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTemplateVersionEditor;
