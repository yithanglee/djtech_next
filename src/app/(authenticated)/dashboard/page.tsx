"use client"

import React, { useEffect } from 'react'
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DataTable from '@/components/data/table'
export default function LibraryManagementSystem() {

  const { user, isLoading } = useAuth();
  console.log(user)
  const { toast } = useToast()
  const url = `${PHX_HTTP_PROTOCOL}/${PHX_ENDPOINT}`
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
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="outlets">Outlets</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your sales data and analytics.</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <DataTable canDelete={false}
                appendQueries={{ organization_id: user?.userStruct?.organization_id }}
                showNew={false}
                canEdit={false}
                model={'Sale'}
                preloads={['outlet', 'device']}
                search_queries={['a.id|b.name']}
                join_statements={[{ device: 'device' }]}
                customCols={[
                  {
                    title: 'General',
                    list: [
                      'id', 'status',
                      {
                        label: 'status',
                        selection: ['pending_payment', 'complete']
                      },

                    ]
                  },
                  {
                    title: 'Details',
                    list: [
                      { label: 'id', alt_class: 'hidden' },

                    ]
                  }
                ]}
                columns={[
                  { label: 'ID', data: 'id' },
                  { label: 'Outlet', data: 'name', through: ['outlet'] },
                  { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 },
                  { label: 'Ref', data: 'payment_ref' },
                  { label: 'Amount', data: 'amount' },
                  {
                    label: 'Status',
                    data: 'status',
                    isBadge: true,

                    color: [
                      {
                        key: 'pending_payment',
                        value: 'destructive'
                      },

                      {
                        key: 'complete',
                        value: 'default'
                      }
                    ]

                  }
                ]}
              />}

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Devices Management</CardTitle>
              <CardDescription>Manage and monitor your connected devices.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable canDelete={false}
                canEdit={false}
                appendQueries={{ organization_id: user?.userStruct?.organization_id }}
                showNew={true}
                model={'Device'}
                preloads={['outlet', 'executor_board', 'organization']}
                buttons={[{ name: 'Clear Logs', onclickFn: clickFn },
                { name: 'Regen QR', onclickFn: clickFn },
                { name: 'Control', onclickFn: clickFn, href: hrefFn }

                ]}
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

                  { label: 'Label', data: 'label', subtitle: { label: 'name', data: 'name' } },
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outlets">
          <Card>
            <CardHeader>
              <CardTitle>Outlets Information</CardTitle>
              <CardDescription>View and manage your outlet locations.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}