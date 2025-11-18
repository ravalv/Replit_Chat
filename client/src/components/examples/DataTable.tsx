import DataTable from '../DataTable';

export default function DataTableExample() {
  const columns = [
    { key: 'tradeId', header: 'Trade ID', sortable: true },
    { key: 'counterparty', header: 'Counterparty', sortable: true },
    { key: 'amount', header: 'Amount', sortable: true },
    { key: 'status', header: 'Status', sortable: false },
  ];

  const data = [
    { tradeId: 'TRD-001', counterparty: 'Goldman Sachs', amount: '$1,250,000', status: '🔴 Failed' },
    { tradeId: 'TRD-002', counterparty: 'Morgan Stanley', amount: '$850,000', status: '🟡 Pending' },
    { tradeId: 'TRD-003', counterparty: 'JP Morgan', amount: '$2,100,000', status: '🟢 Settled' },
  ];

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={data}
        onExport={() => console.log('Export clicked')}
      />
    </div>
  );
}
