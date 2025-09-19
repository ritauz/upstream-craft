import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PriorityType, DeliverableType } from '@/types/deliverable';
import { Search, Filter, X } from 'lucide-react';
import { categories } from '@/data/deliverables';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedPriority: PriorityType | 'all';
  onPriorityChange: (priority: PriorityType | 'all') => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: DeliverableType | 'all';
  onTypeChange: (type: DeliverableType | 'all') => void;
  showOptedInOnly: boolean;
  onOptedInToggle: () => void;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  showOptedInOnly,
  onOptedInToggle
}: FilterBarProps) => {
  const hasActiveFilters =
    searchTerm ||
    selectedPriority !== 'all' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    showOptedInOnly;

  const clearFilters = () => {
    onSearchChange('');
    onPriorityChange('all');
    onCategoryChange('all');
    onTypeChange('all');
    if (showOptedInOnly) onOptedInToggle();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="成果物を検索..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="優先度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての優先度</SelectItem>
              <SelectItem value="Must">Must</SelectItem>
              <SelectItem value="Should">Should</SelectItem>
              <SelectItem value="Could">Could</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="タイプ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのタイプ</SelectItem>
              <SelectItem value="application">アプリケーション</SelectItem>
              <SelectItem value="infrastructure">インフラ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showOptedInOnly ? "default" : "outline"}
            size="sm"
            onClick={onOptedInToggle}
            className="whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-1" />
            選択中のみ
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">フィルター:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              検索: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange('')} />
            </Badge>
          )}
          {selectedPriority !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {selectedPriority}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onPriorityChange('all')} />
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {selectedCategory}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onCategoryChange('all')} />
            </Badge>
          )}
          {selectedType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {selectedType === 'application' ? 'アプリケーション' : 'インフラ'}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onTypeChange('all')} />
            </Badge>
          )}
          {showOptedInOnly && (
            <Badge variant="secondary" className="gap-1">
              選択中のみ
              <X className="h-3 w-3 cursor-pointer" onClick={onOptedInToggle} />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs ml-auto"
          >
            フィルターをクリア
          </Button>
        </div>
      )}
    </div>
  );
};