'use client';
import DataTable from "@/components/data/table"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import ModelProvider from "@/lib/provider";
import { postData } from "@/lib/svt_utils";
import { useRouter } from "next/navigation";
export default function DevicesPage() {
  const router = useRouter();
  let { toast } = useToast()

  const { user, isLoading } = useAuth();
  function hrefFn2(data: any) {
    console.log(data)
    return '/devices/' + data.id + '/details';
  }

  function hrefFn(data: any) {
    console.log(data)
    const subdomain = data.outlet != null ? data.outlet?.subdomain : "";
    // return 'http://localhost:5126?d=' + data.name + '&location=' + subdomain;

    return 'https://iot.djtech4u.com?d=' + data.name + '&location=' + subdomain;
  }

  function clickFn(data: any, name: string) {
    console.log(name)
    console.log(data)
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

    const mapFunction: any = {
      'Clear Logs': () => {
        console.log("Clear Logs")
        postData({

          data: { id: data.id, device_id: data.id, scope: 'delete_all_device_log' },
          endpoint: `${url}/svt_api/webhook?scope=delete_all_device_log`,
          successCallback: () => {
            toast({
              title: `${name} Completed`,
              description: `Your action on ${data.name} was successful!`,
            })
          }

        })

      },
      'Website': () => {
        console.log("Website")
      },
      'Regen QR': () => {

        postData({

          data: { id: data.id, name: data.name, scope: 'gen_static_qr' },
          endpoint: `${url}/svt_api/webhook?scope=gen_static_qr`,
          successCallback: () => {
            toast({
              title: `${name} Completed`,
              description: `Your action on ${data.name} was successful!`,
            })
          }

        })


        console.log("Regen QR")
      },
      'Control': () => {
        console.log("Control")
        router.push('/devices/' + data.id + '/details')
      },
    }

    mapFunction[name]()
    return null;
  }

  let current_search_queries = ['a.name|a.organization_id=' + user?.userStruct?.organization_id];

  if (user?.userStruct?.organization_id == null) {
    current_search_queries = ['a.name'];
  }


  return (
    <ModelProvider modelName="devices">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Devices</h2>

        </div>


        <DataTable
          canDelete={user?.userStruct?.role.name == 'admin' ? true : false}
          appendQueries={{ organization_id: user?.userStruct?.organization_id }}
          showNew={true}
          model={'Device'}
          preloads={['outlet', 'executor_board', 'organization']}
          buttons={[
            { name: 'Clear Logs', onclickFn: clickFn, showCondition: (data: any) => user?.userStruct?.role.name == 'admin' },
            { name: 'Regen QR', onclickFn: clickFn, showCondition: (data: any) => user?.userStruct?.role.name == 'admin' },
            // { name: 'Website', onclickFn: clickFn, href: hrefFn },
            { name: 'Control', onclickFn: clickFn }]}
          search_queries={['a.name']}
          customCols={
            [
              {
                title: 'General',
                list: [
                  { label: 'id', alt_class: 'hidden' },

                  { label: 'name', alt_class: 'w-full lg:w-2/3 mx-4 my-2' },
                  'short_name',
                  'default_io_pin',
                  'default_delay',
                  'format',


                  {
                    label: 'outlet_id',
                    selection: 'Outlet',
                    alt_class: 'w-full lg:w-1/3 mx-4 my-2',
                    customCols: null,
                    search_queries: current_search_queries,
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

                  { label: 'skip_first', boolean: true },
                  { label: 'is_active', boolean: true },
                  { label: 'record_wifi_time', boolean: true },
                  { label: 'is_cloridge', boolean: true },
                  { label: 'is_round_down', alt_class: 'hidden' }


                ]
              },
              {
                title: 'Details',
                list: [{ label: 'id', alt_class: 'hidden' },
                { label: 'skip_first', boolean: true },
                { label: 'is_active', boolean: true },
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




                ]
              }
            ]
          }
          columns={[
            { label: 'id', data: 'id', subtitle: { label: 'label', data: 'label' }, altClass: 'font-bold capitalize' },
            { label: 'Device', data: 'name' },
            { label: 'Firmware', data: 'current_firmware_version' },
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
              ], altClass: 'mt-2'
            },
            { label: 'Outlet', data: 'name', through: ['outlet'], altClass: 'lg:mt-0 mt-2' },
            { label: 'Organization', data: 'name', through: ['organization'], altClass: '' },
          ]}


        />
      </div>
    </ModelProvider>
  )
}