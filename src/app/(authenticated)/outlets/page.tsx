'use client';
import DataTable from "@/components/data/table"
import { useAuth } from "@/lib/auth";

export default function SellersPage() {

  // This is a placeholder for future implementation

  const { user, isLoading } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Outlet</h2>

      </div>

      <DataTable canDelete={true}
        appendQueries={{ organization_id: user?.userStruct?.organization_id }}
        showNew={true}
        model={'Outlet'}
        preloads={['organization']}
        search_queries={['a.name']}
        customCols={
          [
            {
              title: 'General',
              list: [
                { label: 'id', alt_class: 'hidden' },
                'name',
                'uid', 'mcode', 'mkey', 'subdomain', 'currency',
                {
                  label: 'organization_id',
                  customCols: null,
                  selection: 'Organization',
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                },
                { label: 'price_per_minutes' },
                { label: 'payment_gateway', selection: ['RM', 'ipay88', 'fiuu'] },



              ]
            },
            {
              title: 'Detail',
              list: [{ label: 'id', alt_class: 'hidden' },
              { label: 'address', editor2: true },
                'block_reason',
              { label: 'is_blocked', boolean: true }
              ]
            },
          ]
        }
        columns={[
          { label: 'ID', data: 'id' },
          { label: 'Organization', data: 'name', through: ['organization'] },
          { label: 'Name', data: 'name', subtitle: { label: 'address', data: 'address' } },
          { label: 'Subdomain', data: 'subdomain' },
          { label: 'Ref', data: 'uid' },
          { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
          {
            label: 'Blocked?',
            data: 'is_blocked',
            isBadge: true,
            color: [
              {
                key: true,
                value: 'red'
              },
              {
                key: false,
                value: 'green'
              }
            ]
          }


        ]}


      />
    </div>
  )
}