import DataTable from "@/components/data/table"

export default function SellersPage() {

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Messaging Devices</h2>
      </div>
      <DataTable canDelete={true}
        showNew={true}
        model={'MessagingDevice'} 
        preloads={['staff']}
        search_queries={['a.uuid|b.name']}
        join_statements={[{staff: 'staff'}]}
        customCols={[
          {
            title: 'General',
            list: [
              { label: 'id', alt_class: 'hidden' },
             
            ]
          }
        ]}
        columns={[
          { label: 'ID', data: 'id' },
          { label: 'Staff', data: 'name', through: ['staff'] },
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
         
        ]}
      />

     
    </div>
  )
}