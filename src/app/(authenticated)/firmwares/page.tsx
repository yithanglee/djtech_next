import DataTable from "@/components/data/table"

export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Firmwares</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Firmware'}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
          
                'version',
                { label: 'url', upload: true },
                { label: 'metadata', editor2: true },



              ]
            },
            {
              title: 'Detail',
              list: [ 'id',
            
              ]
            },
          ]
        }
        columns={[

          { label: 'Name', data: 'name' },
          { label: 'Url', data: 'url' },
          { label: 'Version', data: 'version' },


        ]}


      />
    </div>
  )
}