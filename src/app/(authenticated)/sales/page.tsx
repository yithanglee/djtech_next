import DataTable from "@/components/data/table"

export default function SellersPage() {

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
      </div>
      <DataTable canDelete={true}
        showNew={true}
        model={'Sale'} 
        preloads={['outlet', 'device']}
        search_queries={['a.id|b.name']}
        join_statements={[{device: 'device'}]}
        customCols={[
          {
            title: 'General',
            list: [
              { label: 'id', alt_class: 'hidden' },
              {
                label: 'status',
                selection: ['processing', 'sent', 'pending_delivery', 'complete', 'cancelled']
              },
              'remarks'
            ]
          },
          {
            title: 'Details',
            list: [
              { label: 'id', alt_class: 'hidden' },
              { label: 'notes', editor2: true },
              'payment_gateway_response'
            ]
          }
        ]}
        columns={[
          { label: 'ID', data: 'id' },
          { label: 'Outlet', data: 'name', through: ['outlet'] },
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
          { label: 'Ref', data: 'payment_ref' },
          { label: 'Amount', data: 'amount' },
          {
            label: 'Status',
            data: 'status',
            isBadge: true,

            color: [
              {
                key: 'pending_payment',
                value: 'destructive'
              },

              {
                key: 'complete',
                value: 'default'
              }
            ]
          
          }
        ]}
      />

     
    </div>
  )
}