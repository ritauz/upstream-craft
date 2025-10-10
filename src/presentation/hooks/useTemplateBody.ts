import { useEffect, useState } from 'react';
import { loadTemplateBody } from '@/infrastructure/content/template-loader';

export const useTemplateBody = (templateId: string) => {
  const [body, setBody] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    loadTemplateBody(templateId)
      .then(t => { if (alive) { setBody(t); setErr(null); } })
      .catch(e => { if (alive) setErr(String(e)); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [templateId]);

  return { body, loading, err };
};
