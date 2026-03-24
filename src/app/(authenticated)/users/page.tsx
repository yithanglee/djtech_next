'use client';
import DataTable from "@/components/data/table"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants"
import { postData } from "@/lib/svt_utils"


export default function MembersPage() {

  // This is a placeholder for future implementation

  function clickFn(data: any, name: string) {
    postData({
      data: { id: data.id, scope: 'set_organization_id_null' },
      endpoint: `${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook`,
      successCallback: () => {
        window.location.reload();
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Admins</h2>

      </div>

      <DataTable
        preloads={['organization', 'role']}
        showNew={true}
        model={'Staff'}
        search_queries={['a.name']}
        buttons={[
          { name: 'Set Null', onclickFn: clickFn },
        ]}
        customCols={
          [
            {
              title: 'General',
              list: [
                'id', 'username', 'name', 'password', 'email', 'phone',
                {
                  label: 'role_id',
                  customCols: null,
                  selection: 'Role',
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                },
                {
                  label: 'organization_id',
                  customCols: null,
                  selection: 'Organization',
                  search_queries: ['a.name'],
                  newData: 'name',
                  title_key: 'name'
                }
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
          { label: 'Organization', data: 'name', through: ['organization'] },
          { label: 'Name', data: 'name' },
          { label: 'Username', data: 'username' },
          { label: 'Email', data: 'email' },
          { label: 'Phone', data: 'phone' }

        ]}


      />
    </div>
  )
}