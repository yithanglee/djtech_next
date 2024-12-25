'use client';
import DataTable from "@/components/data/table"
import { toast } from "@/hooks/use-toast";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import ModelProvider from "@/lib/provider"
import { postData } from "@/lib/svt_utils";


export default function SellersPage() {

  function hrefFn(data: any) {
    console.log(data)
    return '/roles/' + data.id + '/app_routes';
  }

  function clickFn(data: any, name: string) {
    console.log(name)
    console.log(data)
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

    const mapFunction: any = {
      'Control': () => {
        console.log("Control")
      },

    }

    Object.keys(mapFunction).forEach(key => {
      if (key === name) {
        mapFunction[key]()
      }
    })

   
    return null;
  }

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
          buttons={[

            { name: 'App Routes', onclickFn: clickFn, href: hrefFn }


          ]}
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