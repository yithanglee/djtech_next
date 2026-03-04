'use client';
import DataTable from "@/components/data/table"
import { useAuth } from "@/lib/auth";

export default function SubscriptionsPage() {
    const { user, isLoading } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
            </div>

            <DataTable
                canDelete={true}
                showNew={true}
                model={'Subscription'}
                search_queries={['a.name']}
                customCols={[
                    {
                        title: 'General',
                        list: [
                            { label: 'id', alt_class: 'hidden' },
                            'name',
                            { label: 'amount' },
                            { label: 'duration_in_months' },
                            { label: 'description', editor2: true }
                        ]
                    }
                ]}
                columns={[
                    { label: 'ID', data: 'id' },
                    { label: 'Name', data: 'name' },
                    {
                        label: 'Amount',
                        data: 'amount'
                    },
                    { label: 'Duration (Months)', data: 'duration_in_months' },
                    { label: 'Description', data: 'description' },
                    { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                ]}
            />
        </div>
    )
}
