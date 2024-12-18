'use client';
import DataTable from "@/components/data/table"
import ModelProvider from "@/lib/provider"


export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <ModelProvider modelName="roleAppRoutes">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
        
      </div>

      <DataTable 
        showNew={true}
        model={'Role'}
        // preloads={['organization']}
     
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'desc',
               
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
     
          { label: 'Desc', data: 'desc' },

        ]}


      />
    </div>
    </ModelProvider>
  )
}