import DataTable from "@/components/data/table"

export default function SellersPage() {

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reading Conversions</h2>
      </div>
      <DataTable canDelete={true}
        showNew={true}
        model={'ReadingConversion'}
        preloads={[]}
        search_queries={['a.id']}

        customCols={[
          {
            title: 'General',
            list: [
              { label: 'id', alt_class: 'hidden' },
              { label: 'reading_start', },
              { label: 'reading_end', },
              { label: 'converted_data', },

            ]
          }
        ]}
        columns={[
          { label: 'ID', data: 'id' },
          { label: 'Reading Start', data: 'reading_start' },
          { label: 'Reading End', data: 'reading_end' },
          { label: 'Converted Data', data: 'converted_data' },
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },

        ]}
      />


    </div>
  )
}