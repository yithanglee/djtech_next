'use client';

import { useState } from "react";
import DataTable from "@/components/data/table";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from "@/lib/constants";
import { api_get, postData } from "@/lib/svt_utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

export default function SubscriptionsPage() {
    const { user, isLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const isAdmin = user?.userStruct?.role?.name === "admin";

    const [subscribeOpen, setSubscribeOpen] = useState(false);
    const [planRow, setPlanRow] = useState<Record<string, unknown> | null>(null);
    const [devices, setDevices] = useState<{ id: number; short_name?: string; name?: string }[]>([]);
    const [deviceId, setDeviceId] = useState<string>("");
    const [devicesLoading, setDevicesLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [refreshTable, setRefreshTable] = useState<(() => void) | null>(null);

    async function loadDevices() {
        const orgId = user?.userStruct?.organization_id;
        if (orgId == null) return;
        setDevicesLoading(true);
        try {
            const resp = await api_get(url, {
                scope: "datatable",
                model: "Device",
                additional_search: JSON.stringify([
                    { column: 'organization_id', value: orgId, prefix: 'a', operator: '=' },
                ]),
                length: 500,
                start: 0,
            });
            setDevices(Array.isArray(resp?.data) ? resp.data : []);
        } catch (e) {
            console.error(e);
            toast({
                title: "Error",
                description: "Could not load devices for your organization.",
                variant: "destructive",
            });
        } finally {
            setDevicesLoading(false);
        }
    }

    function openSubscribe(data: Record<string, unknown>, refreshData: () => void) {
        // Must use updater form: setState(fn) would otherwise treat `refreshData` as a React state updater.
        setRefreshTable(() => refreshData);
        setPlanRow(data);
        setDeviceId("");
        setSubscribeOpen(true);
        void loadDevices();
    }

    async function confirmSubscribe() {
        const orgId = user?.userStruct?.organization_id;
        const subId = planRow?.id as number | undefined;
        if (subId == null || !deviceId || orgId == null) {
            toast({
                title: "Missing selection",
                description: "Choose a device for this subscription.",
                variant: "destructive",
            });
            return;
        }
        setSubmitting(true);
        try {
            const res = await postData({
                data: {
                    scope: "operator_subscribe_plan",
                    organization_id: orgId,
                    subscription_id: subId,
                    device_id: Number(deviceId),
                },
                endpoint: `${url}/svt_api/webhook`,
            });
            if (res?.status === "ok") {
                toast({
                    title: "Invoice created",
                    description: `Reference ${res.ref_no ?? res.invoice_id}. Open Invoices to pay.`,
                });
                setSubscribeOpen(false);
                setPlanRow(null);
                refreshTable?.();
                router.push("/invoices");
            } else {
                toast({
                    title: "Could not subscribe",
                    description: typeof res?.reason === "string" ? res.reason : "Request failed.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            console.error(e);
            toast({
                title: "Error",
                description: "Network or server error.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    }

    function clickFn(data: Record<string, unknown>, name: string, refreshData: () => void) {
        if (name === "Subscribe") {
            openSubscribe(data, refreshData);
        }
    }

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
            </div>

            {isAdmin && (
                <DataTable
                    canDelete={true}
                    showNew={true}
                    model={"Subscription"}
                    search_queries={["a.name"]}
                    customCols={[
                        {
                            title: "General",
                            list: [
                                { label: "id", alt_class: "hidden" },
                                "name",
                                { label: "amount" },
                                { label: "duration_in_months" },
                                { label: "description", editor2: true },
                            ],
                        },
                    ]}
                    columns={[
                        { label: "ID", data: "id" },
                        { label: "Name", data: "name" },
                        { label: "Amount", data: "amount" },
                        { label: "Duration (Months)", data: "duration_in_months" },
                        { label: "Description", data: "description" },
                        { label: "Timestamp", data: "inserted_at", formatDateTime: true, offset: 8 },
                    ]}
                />
            )}

            {!isAdmin && (
                <>
                    <DataTable
                        canDelete={false}
                        showNew={false}
                        canEdit={false}
                        model={"Subscription"}
                        search_queries={["a.name"]}
                        buttons={[{ name: "Subscribe", onclickFn: clickFn }]}
                        customCols={[
                            {
                                title: "General",
                                list: [{ label: "id", alt_class: "hidden" }],
                            },
                        ]}
                        columns={[
                            { label: "ID", data: "id" },
                            { label: "Name", data: "name" },
                            { label: "Amount", data: "amount" },
                            { label: "Duration (Months)", data: "duration_in_months" },
                            { label: "Description", data: "description" },
                            { label: "Timestamp", data: "inserted_at", formatDateTime: true, offset: 8 },
                        ]}
                    />

                    <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Subscribe</DialogTitle>
                                <DialogDescription>
                                    Choose which device this plan applies to. An invoice and outlet subscription line
                                    will be created for your organization.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                                <p className="text-sm">
                                    <span className="font-medium">Plan: </span>
                                    {planRow?.name != null ? String(planRow.name) : "—"}
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="subscribe-device">Device</Label>
                                    {devicesLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading devices…
                                        </div>
                                    ) : devices.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No devices found for your organization. Add a device first.
                                        </p>
                                    ) : (
                                        <Select value={deviceId} onValueChange={setDeviceId}>
                                            <SelectTrigger id="subscribe-device">
                                                <SelectValue placeholder="Select a device" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {devices.map((d) => (
                                                    <SelectItem key={d.id} value={String(d.id)}>
                                                        {d.short_name || d.name || `Device #${d.id}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button type="button" variant="outline" onClick={() => setSubscribeOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => void confirmSubscribe()}
                                    disabled={submitting || !deviceId || devices.length === 0}
                                >
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm subscribe
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
