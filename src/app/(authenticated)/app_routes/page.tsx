import DataTable from "@/components/data/table"


export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">App Routes</h2>
        
      </div>

      <DataTable 
        showNew={true}
        model={'AppRoute'}
        // preloads={['organization']}
     
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'route',
               
                // {
                //   label: 'organization_id',
                //   customCols: null,
                //   selection: 'Organization',
                //   search_queries: ['a.name'],
                //   newData: 'name',
                //   title_key: 'name'
                // }
              ]
            },
            {
              title: 'Detail',
              list: [
            
              ]
            },
          ]
        }
        columns={[
          // { label: 'Organization', data: 'name', through: ['organization'] },
          { label: 'ID', data: 'id' },
          { label: 'Name', data: 'name' },
          { label: 'Route', data: 'route' },

        ]}


      />
    </div>
  )
}