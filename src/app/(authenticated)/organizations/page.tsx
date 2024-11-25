import DataTable from "@/components/data/table"

export default function SellersPage() {

  // This is a placeholder for future implementation

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>

      </div>

      <DataTable canDelete={true}
        showNew={true}
        model={'Organization'}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id',
                'name',
                'desc',
                'address',
                'email', 'phone',
                { label: 'img_url', upload: true },



              ]
            },
            {
              title: 'Detail',
              list: [ 'id',
                'host_name',

                { label: 'background_img_url', upload: true },
                { label: 'opening_hours', editor2: true }
              ]
            },
          ]
        }
        columns={[

          { label: 'Name', data: 'name' },
          { label: 'Address', data: 'address' },
          { label: 'Host', data: 'host_name' },


        ]}


      />
    </div>
  )
}