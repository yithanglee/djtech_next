'use client';
import DataTable from "@/components/data/table"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import ModelProvider from "@/lib/provider";
import { postData } from "@/lib/svt_utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function OutletSubscriptionsPage() {
    const { user, isLoading } = useAuth();
    let { toast } = useToast()
    const router = useRouter();
    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }
    console.log(user)
    let organization_id = user?.organization_id
    function clickFn(data: any, name: string) {
        console.log(name)
        console.log(data)
        const serverUrl = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

        const mapFunction: any = {

            'Pay': () => {

                // postData({

                //     data: { id: data.id, name: data.name, scope: 'gen_static_qr' },
                //     endpoint: `${url}/svt_api/webhook?scope=gen_static_qr`,
                //     successCallback: () => {
                //         toast({
                //             title: `${name} Completed`,
                //             description: `Your action on ${data.name} was successful!`,
                //         })
                //     }

                // })


                console.log("Getting payment url")

                const chan = 'fpx';
                const amt = (data.amount * 1);
                const ref_no = `SUBS${data.id}`;
                const url = `${serverUrl}/subscription_payment?chan=${chan}&amt=${amt}&ref_no=${ref_no}`;

                router.push(url)


            },

        }

        mapFunction[name]()
        return null;
    }



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Outlet Subscriptions</h2>
            </div>

            <DataTable
                canDelete={true}
                showNew={true}
                model={'OutletSubscription'}
                preloads={['outlet']}
                search_queries={['a.ref_no']}
                buttons={[
                    { name: 'Pay', onclickFn: clickFn },

                ]}
                customCols={[
                    {
                        title: 'General',
                        list: [
                            { label: 'id', alt_class: 'hidden' },

                            {
                                label: 'invoice_id',
                                customCols: null,
                                selection: 'Invoice',
                                search_queries: ['a.ref_no'],
                                newData: 'ref_no',
                                title_key: 'ref_no'
                            },
                            {
                                label: 'device_id',
                                customCols: null,
                                selection: 'Device',
                                search_queries: ['a.short_name|a.organization_id=' + organization_id],
                                newData: 'short_name',
                                title_key: 'short_name'
                            },
                            { label: 'amount' },
                            {
                                label: 'subscription_id',
                                customCols: null,
                                selection: 'Subscription',
                                search_queries: ['a.name'],
                                newData: 'name',
                                title_key: 'name'
                            },
                            { label: 'start_date', date: true },
                            { label: 'end_date', date: true },
                            // { label: 'ref_no' },
                            // { label: 'payment_url' },
                            // { label: 'webhook_details', editor2: true }
                        ]
                    }
                ]}
                columns={[
                    { label: 'ID', data: 'id' },
                    { label: 'Outlet', data: 'name', through: ['outlet'] },
                    {
                        label: 'Status', color: [
                            {
                                key: 'pending',
                                value: 'destructive'
                            },

                            {
                                key: 'paid',
                                value: 'default'
                            }
                        ], data: 'status',
                    },
                    { label: 'Amount', data: 'amount' },
                    { label: 'Start Date', data: 'start_date' },
                    { label: 'End Date', data: 'end_date' },
                    { label: 'Ref No', data: 'ref_no' },
                    { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                ]}
            />
        </div>
    )
}
