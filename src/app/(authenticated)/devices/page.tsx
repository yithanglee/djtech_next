'use client';
import DataTable from "@/components/data/table"
import { useToast } from "@/hooks/use-toast";
import ModelProvider from "@/lib/provider";
export default function DevicesPage() {
  let { toast } = useToast()
  function hrefFn(data: any) {
    console.log(data)
    return '/devices/' + data.id + '/details';
  }

  function clickFn(data: any, name: string) {
    console.log(name)
    console.log(data)
    toast({
      title: `${name} Completed`,
      description: `Your action on ${data.name} was successful!`,
    })
    return null;
  }

  return (
    <ModelProvider modelName="devices">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Devices</h2>

        </div>
      

        <DataTable canDelete={true}
          showNew={true}
          model={'Device'}
          preloads={['outlet', 'executor_board', 'organization']}
          buttons={[{ name: 'Clear Logs', onclickFn: clickFn },
          { name: 'Website', onclickFn: clickFn },
          { name: 'Regen QR', onclickFn: clickFn },
          { name: 'Control', onclickFn: clickFn, href: hrefFn }]}
          search_queries={['a.name']}
          customCols={
            [
              {
                title: 'General',
                list: [
                  { label: 'id', alt_class: 'hidden' },
                 
                  { label:  'name', alt_class: 'w-full lg:w-2/3 mx-4 my-2' },
                  'short_name',
                  'default_io_pin',
                  'default_delay',
                  'format',

                  // { label: 'organization_id', hidden: true, value: data.organization_id },

                  {
                    label: 'outlet_id',
                    selection: 'Outlet',
                    alt_class: 'w-full lg:w-1/3 mx-4 my-2',
                    customCols: null,
                    // search_queries: current_search_queries,
                    newData: 'name',
                    title_key: 'name'
                  },

                  {
                    label: 'organization_id',
                    selection: 'Organization',
                    customCols: null,
                    search_queries: ['a.name'],
                    newData: 'name',
                    title_key: 'name'
                  },




                ]
              },
              {
                title: 'Details',
                list: [{ label: 'id', alt_class: 'hidden' },
                { label: 'record_wifi_time', boolean: true },

                { label: 'is_cloridge', boolean: true },
                  'cloridge_device_uid',
                {
                  label: 'executor_board_id',
                  selection: 'Device',
                  customCols: null,
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                },

                { label: 'skip_first', boolean: true },
                { label: 'is_active', boolean: true }

                ]
              }
            ]
          }
          columns={[

            { label: 'Label', data: 'label', subtitle: {label: 'name', data: 'name'} },
            { label: 'Timestamp', data: 'inserted_at', offset: 8, formatDateTime: true },
            {
              label: 'In service?', data: 'is_active', color: [
                {
                  key: false,
                  value: 'destructive'
                },

                {
                  key: true,
                  value: 'default'
                }
              ]
            },
            { label: 'Outlet', data: 'name', through: ['outlet'] },
            { label: 'Organization', data: 'name', through: ['organization'] },
          ]}


        />
      </div>
    </ModelProvider>
  )
}