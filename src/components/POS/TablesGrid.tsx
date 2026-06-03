import { Table as TableType } from '../../lib/supabase';
import { Users, X } from 'lucide-react';

interface TablesGridProps {
  tables: TableType[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  onClearSelection: () => void;
}

export default function TablesGrid({ tables, selectedTableId, onSelectTable, onClearSelection }: TablesGridProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide block mb-3">
          Seleccionar Mesa
        </label>
        {selectedTableId && (
          <button
            onClick={onClearSelection}
            className="mb-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 text-sm font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            Limpiar selección
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelectTable(table.id)}
            className={`p-4 rounded-xl font-semibold transition-all flex flex-col items-center justify-center gap-2 ${
              selectedTableId === table.id
                ? 'bg-brand-500 text-white shadow-brand'
                : table.is_occupied
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-brand-400'
            }`}
            disabled={table.is_occupied && selectedTableId !== table.id}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm">Mesa {table.table_number}</span>
            <span className="text-xs opacity-75">{table.capacity} pers</span>
          </button>
        ))}
      </div>
    </div>
  );
}
