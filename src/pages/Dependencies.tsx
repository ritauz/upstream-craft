import { useState } from 'react';
import { deliverables } from '@/data/deliverables';
import { Deliverable } from '@/types/deliverable';
import { DeliverableDiagram } from '@/components/DeliverableDiagram';
import { DeliverableModal } from '@/components/DeliverableModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dependencies = () => {
  const navigate = useNavigate();
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              一覧に戻る
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            成果物依存関係図
          </h1>
          <p className="text-muted-foreground">
            成果物間の依存関係を可視化し、プロジェクト進行の流れを把握できます
          </p>
        </div>

        <DeliverableDiagram 
          deliverables={deliverables}
          onDeliverableClick={setSelectedDeliverable}
        />

        {selectedDeliverable && (
          <DeliverableModal
            deliverable={selectedDeliverable}
            onClose={() => setSelectedDeliverable(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dependencies;