'use client';
import React, { useState, useCallback, useEffect } from 'react';
import DataTable from "@/components/data/table"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { postData, buildQueryString, api_get } from "@/lib/svt_utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";

const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

interface OutletSubscription {
    id: number;
    ref_no: string;
    amount: number;
    status: string;
    start_date: string;
    end_date: string;
    invoice_id: number | null;
    outlet?: { name: string };
}

export default function InvoicesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Inline subscription panel state
    const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [subscriptions, setSubscriptions] = useState<OutletSubscription[]>([]);
    const [selectedSubIds, setSelectedSubIds] = useState<Set<number>>(new Set());
    const [originalSubIds, setOriginalSubIds] = useState<Set<number>>(new Set());
    const [subsPage, setSubsPage] = useState(1);
    const [subsTotalPages, setSubsTotalPages] = useState(0);
    const [subsSearch, setSubsSearch] = useState('');
    const [subsLoading, setSubsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const SUBS_PER_PAGE = 10;

    useEffect(() => {
        if (user?.userStruct?.role.name == 'admin') {
            setIsAdmin(true);
        }
    }, [user]);

    // Fetch outlet subscriptions for the inline panel
    const fetchSubscriptions = useCallback(async (page: number, search: string) => {
        setSubsLoading(true);
        try {
            const [outletSubscriptionsResp] = await Promise.all([api_get(url, {
                scope: 'datatable', model: 'OutletSubscription',
                preloads: JSON.stringify(['outlet']),
                additional_joins: JSON.stringify([
                    // { join_suffix: 'a', assoc: 'merchant', prefix: 'b' }
                ]),

                additional_search: JSON.stringify([
                    // { column: 'invoice_id', value: invoiceId, prefix: 'a', operator: '=' },
                    // { column: 'name', value: true, prefix: 'a', operator: 'not_null' }
                ]),
                length: SUBS_PER_PAGE,
                start: (page - 1) * SUBS_PER_PAGE
            }).catch(() => [])]);

            console.log('outletSubscriptionsResp', outletSubscriptionsResp)
            const items = outletSubscriptionsResp.data || [];
            const total = outletSubscriptionsResp.recordsTotal || 0;

            setSubscriptions(items);
            setSubsTotalPages(Math.ceil(total / SUBS_PER_PAGE));
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast({
                title: "Error",
                description: "Failed to load outlet subscriptions.",
                variant: "destructive",
            });
        } finally {
            setSubsLoading(false);
        }
    }, [toast]);

    // Open inline panel for an invoice
    const openSubsPanel = useCallback(async (invoiceId: number) => {
        // If clicking the same invoice, toggle the panel
        if (currentInvoiceId === invoiceId && panelOpen) {
            setPanelOpen(false);
            setCurrentInvoiceId(null);
            return;
        }

        setCurrentInvoiceId(invoiceId);
        setSubsPage(1);
        setSubsSearch('');
        setSearchInput('');
        setSelectedSubIds(new Set());
        setOriginalSubIds(new Set());
        setPanelOpen(true);

        // Fetch all subscriptions linked to this invoice to pre-check them
        try {
            const [outletSubscriptionsResp] = await Promise.all([api_get(url, {
                scope: 'datatable', model: 'OutletSubscription',

                additional_joins: JSON.stringify([]),

                additional_search: JSON.stringify([
                    { column: 'invoice_id', value: invoiceId, prefix: 'a', operator: '=' },
                ]),
                length: 1000,
                start: 0
            }).catch(() => [])]);

            console.log('outletSubscriptionsResp', outletSubscriptionsResp)

            if (outletSubscriptionsResp.data) {
                const items = outletSubscriptionsResp.data || [];
                const linkedIds = new Set<number>(items.map((s: any) => s.id));
                setSelectedSubIds(linkedIds);
                setOriginalSubIds(new Set(linkedIds));
            }
        } catch (e) {
            console.error('Error fetching linked subscriptions:', e);
        }
    }, [currentInvoiceId, panelOpen]);

    // Re-fetch subscriptions when page or search changes
    useEffect(() => {
        if (panelOpen) {
            fetchSubscriptions(subsPage, subsSearch);
        }
    }, [panelOpen, subsPage, subsSearch, fetchSubscriptions]);

    // Toggle a subscription checkbox
    const toggleSubscription = (id: number) => {
        setSelectedSubIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Save the subscription linkages
    const saveSubscriptions = async () => {
        if (currentInvoiceId === null) return;
        setSaving(true);

        try {
            const toLink = Array.from(selectedSubIds).filter(id => !originalSubIds.has(id));
            const toUnlink = Array.from(originalSubIds).filter(id => !selectedSubIds.has(id));

            const promises: Promise<any>[] = [];

            for (const id of toLink) {
                const formData = new FormData();
                formData.append('OutletSubscription[invoice_id]', currentInvoiceId.toString());
                promises.push(
                    fetch(`${url}/svt_api/OutletSubscription/${id}`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'authorization': `Basic ${user?.token}`,
                        },
                    })
                );
            }

            for (const id of toUnlink) {
                const formData = new FormData();
                formData.append('OutletSubscription[invoice_id]', '');
                promises.push(
                    fetch(`${url}/svt_api/OutletSubscription/${id}`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'authorization': `Basic ${user?.token}`,
                        },
                    })
                );
            }

            await Promise.all(promises);

            toast({
                title: "Saved",
                description: `Updated ${toLink.length + toUnlink.length} subscription(s).`,
            });

            setOriginalSubIds(new Set(selectedSubIds));
        } catch (error) {
            console.error('Error saving subscriptions:', error);
            toast({
                title: "Error",
                description: "Failed to save subscription changes.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    // DataTable button handlers
    function clickFn(data: any, name: string, refreshData: () => void) {
        const mapFunction: any = {
            'Pay': () => {
                const serverUrl = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
                const chan = 'fpx';
                const amt = (data.grand_total || data.amount || 0) * 1;
                const ref_no = `SUBS${data.id}`;
                const generatedUrl = `${serverUrl}/subscription_payment?chan=${chan}&amt=${amt}&ref_no=${ref_no}`;
                const finalUrl = data.payment_url || generatedUrl;

                if (finalUrl) {
                    window.open(finalUrl, '_blank', 'noopener,noreferrer');
                } else {
                    toast({
                        title: "Payment URL missing",
                        description: "No payment URL found for this invoice.",
                        variant: "destructive",
                    });
                }
            },
            'Manage Subscriptions': () => {
                openSubsPanel(data.id);
            },
            'Show PDF': () => {
                const serverUrl = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
                const finalUrl = `${serverUrl}/pdf?id=${data.id}&type=invoice`;
                window.open(finalUrl, '_blank', 'noopener,noreferrer');
            },
        };

        if (mapFunction[name]) {
            mapFunction[name]();
        }
    }

    // Search with debounce
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setSubsSearch(searchInput);
            setSubsPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
            </div>
            {isAdmin && (
                <DataTable
                    canDelete={true}
                    showNew={true}
                    model={'Invoice'}
                    search_queries={['a.ref_no']}
                    buttons={[
                        { name: 'Pay', onclickFn: clickFn },
                        { name: 'Manage Subscriptions', onclickFn: clickFn },
                        { name: 'Show PDF', onclickFn: clickFn },
                    ]}
                    customCols={[
                        {
                            title: 'General',
                            list: [
                                { label: 'id', alt_class: 'hidden' },
                                {
                                    label: 'organization_id',
                                    customCols: null,
                                    selection: 'Organization',
                                    search_queries: ['a.name'],
                                    newData: 'name',
                                    title_key: 'name'
                                },

                                { label: 'ref_no' },
                                { label: 'due_date', date: true },
                                { label: 'payment_url' },
                                { label: 'remarks', editor2: true },
                            ]
                        }
                    ]}
                    columns={[
                        { label: 'ID', data: 'id' },
                        { label: 'Ref No', data: 'ref_no' },
                        { label: 'Due Date', data: 'due_date' },
                        { label: 'Total', data: 'grand_total' },
                        {
                            label: 'Status', data: 'status', color: [
                                { key: 'paid', value: 'green' },
                                { key: 'unpaid', value: 'red' },
                                { key: 'partial', value: 'yellow' },
                            ]
                        },
                        { label: 'Payment URL', data: 'payment_url' },
                        { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                    ]}
                />
            )}
            {isAdmin != true && (
                <DataTable
                    canDelete={false}
                    showNew={false}
                    model={'Invoice'}
                    search_queries={['a.ref_no', `a.organization_id=${user?.userStruct?.organization_id}`]}
                    buttons={[
                        { name: 'Pay', onclickFn: clickFn },
                        // { name: 'Manage Subscriptions', onclickFn: clickFn },
                        { name: 'Show PDF', onclickFn: clickFn },
                    ]}
                    customCols={[
                        {
                            title: 'General',
                            list: [
                                { label: 'id', alt_class: 'hidden' },

                                { label: 'remarks', editor2: true },
                            ]
                        }
                    ]}
                    columns={[
                        { label: 'ID', data: 'id' },
                        // { label: 'Ref No', data: 'ref_no' },
                        { label: 'Due Date', data: 'due_date' },
                        { label: 'Total', data: 'grand_total' },
                        {
                            label: 'Status', data: 'status', color: [
                                { key: 'paid', value: 'green' },
                                { key: 'unpaid', value: 'red' },
                                { key: 'partial', value: 'yellow' },
                            ]
                        },
                        { label: 'Payment URL', data: 'payment_url' },
                        { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                    ]}
                />
            )}

            {/* Inline Outlet Subscriptions Panel */}
            {panelOpen && currentInvoiceId && (
                <div className="border rounded-lg bg-white shadow-sm">
                    {/* Panel header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-lg">
                                Outlet Subscriptions for Invoice #{currentInvoiceId}
                            </h3>
                            <Badge variant="outline" className="ml-2">
                                {selectedSubIds.size} selected
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setPanelOpen(false); setCurrentInvoiceId(null); }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="p-4 pb-2">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by ref no..."
                                className="pl-9"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Subscriptions table */}
                    <div className="px-4">
                        {subsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : subscriptions.length === 0 ? (
                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                No outlet subscriptions found.
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-2 text-left w-[50px]"></th>
                                        <th className="py-2 px-2 text-left w-[60px]">ID</th>
                                        <th className="py-2 px-2 text-left">Ref No</th>
                                        <th className="py-2 px-2 text-left">Outlet</th>
                                        <th className="py-2 px-2 text-left">Amount</th>
                                        <th className="py-2 px-2 text-left">Status</th>
                                        <th className="py-2 px-2 text-left">Start Date</th>
                                        <th className="py-2 px-2 text-left">End Date</th>
                                        <th className="py-2 px-2 text-left">Linked Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className={`border-b cursor-pointer transition-colors ${selectedSubIds.has(sub.id)
                                                ? 'bg-primary/5'
                                                : 'hover:bg-muted/50'
                                                }`}
                                            onClick={() => toggleSubscription(sub.id)}
                                        >
                                            <td className="py-2 px-2">
                                                <Checkbox
                                                    checked={selectedSubIds.has(sub.id)}
                                                    onCheckedChange={() => toggleSubscription(sub.id)}
                                                />
                                            </td>
                                            <td className="py-2 px-2 text-sm">{sub.id}</td>
                                            <td className="py-2 px-2 text-sm">{sub.ref_no || '-'}</td>
                                            <td className="py-2 px-2 text-sm">{sub.outlet?.name || '-'}</td>
                                            <td className="py-2 px-2 text-sm">
                                                {sub.amount != null ? `RM ${sub.amount.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="py-2 px-2">
                                                <Badge
                                                    variant={sub.status === 'active' ? 'default' : 'destructive'}
                                                    className="capitalize text-xs"
                                                >
                                                    {sub.status || 'pending'}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-2 text-sm">{sub.start_date || '-'}</td>
                                            <td className="py-2 px-2 text-sm">{sub.end_date || '-'}</td>
                                            <td className="py-2 px-2 text-sm">
                                                {sub.invoice_id ? (
                                                    <Badge
                                                        variant={sub.invoice_id === currentInvoiceId ? 'default' : 'outline'}
                                                        className="text-xs"
                                                    >
                                                        #{sub.invoice_id}
                                                    </Badge>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination + Save */}
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                        <div className="flex items-center gap-4">
                            {subsTotalPages > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setSubsPage(Math.max(1, subsPage - 1))}
                                                className={subsPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: Math.min(5, subsTotalPages) }, (_, i) => {
                                            let page: number;
                                            if (subsTotalPages <= 5) {
                                                page = i + 1;
                                            } else if (subsPage <= 3) {
                                                page = i + 1;
                                            } else if (subsPage >= subsTotalPages - 2) {
                                                page = subsTotalPages - 4 + i;
                                            } else {
                                                page = subsPage - 2 + i;
                                            }
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        isActive={page === subsPage}
                                                        onClick={() => setSubsPage(page)}
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setSubsPage(Math.min(subsTotalPages, subsPage + 1))}
                                                className={subsPage === subsTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                            {subsTotalPages > 1 && (
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    Page {subsPage} of {subsTotalPages}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                {selectedSubIds.size} subscription(s) selected
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setPanelOpen(false); setCurrentInvoiceId(null); }}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={saveSubscriptions} disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
