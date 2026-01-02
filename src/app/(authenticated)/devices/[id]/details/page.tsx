'use client';
import DataTable from "@/components/data/table"
import SimpleTable from "@/components/data/simpleTable"
import { useEffect, useRef, useState } from "react";
import { BreadcrumbHelper } from "@/components/data/breadcrumbHelper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL, PHX_WS_PROTOCOL } from "@/lib/constants";
import { genInputs, postData } from "@/lib/svt_utils";
import DynamicForm from "@/components/data/dynaform";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Script from "next/dist/client/script";
import { Socket, Channel } from "phoenix";
import { useAuth } from "@/lib/auth";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
declare global {
    interface Window {
        JSC: any
    }
}

interface DevicePayload {
    status: string;
    timestamp: string;
}

interface OtaStatusPayload {
    status: string;
    progress: number;
    current_version?: string;
    target_version?: string;
    update_available?: boolean;
    timestamp?: number;
}

export default function DetailsPage({ params }: { params: { id: string } }) {
    const { user, isLoading: isAuthLoading } = useAuth();

    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const id = params.id
    const [colInputs, setColInputs] = useState<any[]>([])
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
    const [filteredData, setFilteredData] = useState<any>({ id: 0, name: 0, outlet: { name: '' } });
    let { toast } = useToast()

    const [isConnected, setIsConnected] = useState(false)
    const wsUrl = PHX_ENDPOINT
    const socketRef = useRef<Socket | null>(null)
    const channelRef = useRef<Channel | null>(null)
    const offlineTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [otaStatus, setOtaStatus] = useState<OtaStatusPayload | null>(null)
    const [otaLastUpdatedAt, setOtaLastUpdatedAt] = useState<number | null>(null)
    const [wifiGroupedRows, setWifiGroupedRows] = useState<any[]>([])
    const [wifiGroupedLoading, setWifiGroupedLoading] = useState<boolean>(false)
    const [wifiPage, setWifiPage] = useState<number>(1)
    const [wifiTotalPages, setWifiTotalPages] = useState<number>(1)
    const wifiPerPage = 24
    const [wifiDate, setWifiDate] = useState<string>(() => {
        // YYYY-MM-DD
        return new Date().toISOString().slice(0, 10)
    })

    const [wifiWeeklyRows, setWifiWeeklyRows] = useState<any[]>([])
    const [wifiWeeklyLoading, setWifiWeeklyLoading] = useState<boolean>(false)
    const [wifiMonth, setWifiMonth] = useState<string>(() => {
        // YYYY-MM
        return new Date().toISOString().slice(0, 7)
    })


    // Function to reset the offline timeout
    const resetOfflineTimeout = () => {
        if (offlineTimeoutRef.current) {
            clearTimeout(offlineTimeoutRef.current)
        }
        offlineTimeoutRef.current = setTimeout(() => {
            setIsConnected(false)
        }, 4900) // 4 seconds timeout
    }

    const fetchColInputs = async () => {
        const inputs = await genInputs(url, 'Device');

        setColInputs(inputs);
    };
    const chartRef = useRef<HTMLDivElement>(null)
    const [isJSChartingLoaded, setIsJSChartingLoaded] = useState(false)

    const handleJsChartingLoad = () => {
        alert("!")
        setIsJSChartingLoaded(true)
    }
    const fetchCurrentData = () => {
        fetch(`${url}/svt_api/webhook?scope=get_device&id=${id}`).then((response: any) => {
            console.log(response)
            if (response.ok) {
                response.json().then((res: any) => {
                    localStorage.setItem('devicesData', JSON.stringify([res]))
                    setData([res])
                });

            }

        })
    }


    function clickFn(data: any, name: string) {
        console.log(name)
        console.log(data)
        const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

        const currentDevice = localStorage.getItem('devicesData')
        const currentDeviceData = JSON.parse(currentDevice || '[]')[0]



        const mapFunction: any = {
            'Update Firmware': () => {
                console.log("Update Firmware")
                postData({

                    data: { id: data.id, name: currentDeviceData.name, firmware_version: data.version, scope: 'ota_update' },
                    endpoint: `${url}/svt_api/webhook?scope=ota_update`,
                    successCallback: () => {
                        toast({
                            title: `${name} Completed`,
                            description: `Your action on ${data.name} was successful!`,
                        })
                    }

                })

            },

        }

        mapFunction[name]()
        return null;
    }

    useEffect(() => {
        fetchColInputs();

        const storedData = localStorage.getItem('devicesData');  // Replace 'modelData' with your key
        if (storedData) {
            let d = JSON.parse(storedData);
            console.log("stored",d);

            if (d.id == id) {
                setData(d);  // Parse and set the data in state
            } else {
                fetchCurrentData()
            }

        } else {
            fetchCurrentData()
        }


    }, []);

    const [title, setTitle] = useState<string>('');
    const [subtitle, setSubtitle] = useState<string>('');

    useEffect(() => {
        let filteredResult = data.filter((v, i) => {
            return v.id == id
        })[0]


        console.log(filteredResult)
        if (filteredResult) {
            setFilteredData(filteredResult)
            setTitle((filteredResult.outlet ? filteredResult.outlet.name : '') + ' Device');
            setSubtitle(filteredResult.name);

        }

    }, [data])

    useEffect(() => {
        if (filteredData.name && filteredData.name !== "0") {
            // Initialize socket if it doesn't exist
            if (!socketRef.current) {
                socketRef.current = new Socket(`${PHX_WS_PROTOCOL}${wsUrl}/socket`, {
                    heartbeatIntervalMs: 30000,  // Set heartbeat interval to 30 seconds
                    params: {
                        device: filteredData.name
                    }
                })
                socketRef.current.connect()
            }

            // Create and join channel
            const channel = socketRef.current.channel(`user:${filteredData.name}`, {})
            channelRef.current = channel

            // Set initial state to offline
            setIsConnected(false)

            channel.join()
                .receive('ok', () => {
                    console.log(`Successfully joined device channel ${filteredData.name}`)
                    // Don't set isConnected here, wait for i_am_online event
                })
                .receive('error', (resp: { reason?: string }) => {
                    console.error('Unable to join device channel', resp)
                    setIsConnected(false)
                })

            channel.on('i_am_online', (payload: DevicePayload) => {
                console.info('Device online status update:', payload)
                setIsConnected(true)
                resetOfflineTimeout() // Start/reset the 4-second timeout
            })

            channel.on('ota_status', (payload: OtaStatusPayload) => {
                console.info('OTA status update:', payload)
                setOtaStatus(payload)
                setOtaLastUpdatedAt(Date.now())
            })

            // Cleanup function
            return () => {
                if (offlineTimeoutRef.current) {
                    clearTimeout(offlineTimeoutRef.current)
                }
                if (channel) {
                    // Best-effort remove listeners before leaving
                    try {
                        const anyChannel: any = channel
                        if (anyChannel.off) {
                            anyChannel.off('ota_status')
                            anyChannel.off('i_am_online')
                        }
                    } catch {}
                    channel.leave()
                }
                if (socketRef.current) {
                    socketRef.current.disconnect()
                    socketRef.current = null
                }
                channelRef.current = null
            }
        }
        setIsJSChartingLoaded(true)

    }, [filteredData.name]) // Only depend on device name

    const sendCustomCommand = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement

        const formData = new FormData(form)

        const formObject: Record<string, any> = {};

        formData.append(
            'item_name',
            `Send ` + formData.get('value') + ` reps (shorter ` + formData.get('delay') + `)`
        );

        formData.forEach((value, key) => {
            // Handle multiple values (like checkboxes)
            if (formObject[key]) {
                formObject[key] = Array.isArray(formObject[key])
                    ? [...formObject[key], value]
                    : [formObject[key], value];
            } else {
                formObject[key] = value;
            }
        });

        formObject["delay"] = Number(formObject["delay"])

        postData({
            endpoint: `${url}/svt_api/webhook`,
            data: formObject,
            isFormData: false,
            successCallback: () => {
                toast({
                    title: `Completed`,
                    description: `Your action was successful!`,
                })
            }
        })
    }
    const formatData = (data: any) => {

        console.log(data)
        if (data) {
            return data.map((d: any) => {
                const date = new Date(d[0]);
                // Offset the date by +8 hours (28800000 milliseconds)
                date.setTime(date.getTime() + 8 * 60 * 60 * 1000);

                return {
                    x: date,
                    y: 1, // Use a constant y-value if you want a simple time series heatmap.
                    z: d[1] // Assuming z value is the same as the call count for heatmap intensity
                };
            });
        } else {
            return []
        }

    }
    useEffect(() => {
        if (isJSChartingLoaded && chartRef.current) {
            let chart: any;
            fetch(url + '/svt_api/webhook?scope=get_wifi_logs&id=' + id, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {

                response.json().then((wifi_time_logs) => {
                    let formattedData: [] = formatData(wifi_time_logs);
                    if (formattedData.length > 0) {
                        if (chart) {
                            chart.destroy()
                        }
                        chart = new window.JSC.Chart(chartRef.current, {
                            debug: true,
                            type: 'heatmap',
                            series: [
                                {
                                    points: formattedData
                                }
                            ],
                            xAxis: {
                                label_text: 'Time',
                                defaultTick_label_text: (val: any) => {
                                    const date = new Date(val);
                                    return date.toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false
                                    });
                                }
                            },
                            yAxis: {
                                label_text: 'Wifi Online/5 sec Count'
                            },
                            title_label_text: 'Wifi Online Heatmap'
                        });
                    }
                })


            })

            return () => {
                chart.destroy()
            }
        }
    }, [
        isJSChartingLoaded
    ])

    useEffect(() => {
        // grouped wifi logs table (minute bucket + count)
        setWifiGroupedLoading(true)
        const start = wifiPerPage * (wifiPage - 1)
        fetch(`${url}/svt_api/webhook?scope=datatable_device_wifi_logs&id=${id}&date=${wifiDate}&length=${wifiPerPage}&start=${start}&draw=${wifiPage}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((r) => r.json())
            .then((res) => {
                const rows = Array.isArray(res?.data) ? res.data : []
                setWifiGroupedRows(rows)
                const total = typeof res?.recordsFiltered === 'number' ? res.recordsFiltered : (typeof res?.recordsTotal === 'number' ? res.recordsTotal : 0)
                setWifiTotalPages(Math.max(1, Math.ceil(total / wifiPerPage)))
            })
            .catch(() => setWifiGroupedRows([]))
            .finally(() => setWifiGroupedLoading(false))
    }, [id, wifiDate, wifiPage])

    useEffect(() => {
        // weekly grouped wifi logs (within selected month)
        setWifiWeeklyLoading(true)
        fetch(`${url}/svt_api/webhook?scope=datatable_device_wifi_logs_weekly_month&id=${id}&month=${wifiMonth}&length=10&start=0&draw=1`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((r) => r.json())
            .then((res) => {
                const rows = Array.isArray(res?.data) ? res.data : []
                setWifiWeeklyRows(rows)
            })
            .catch(() => setWifiWeeklyRows([]))
            .finally(() => setWifiWeeklyLoading(false))
    }, [id, wifiMonth])




    return (
        <>

            <Script src="/vendor/js_charting/js_charting.js"

            />
            <div className="space-y-6">

                <BreadcrumbHelper items={[
                    { link: '/devices', title: 'Devices' },
                    { link: `/devices/${filteredData.id}/details`, title: `${filteredData.name}` },
                ]} />
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex justify-between items-start flex-col">
                        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                        <div className="text-gray-600 text-sm">{subtitle}</div>
                    </div>
                    <Badge variant={isConnected ? 'default' : 'destructive'}>{isConnected ? 'Online' : 'Offline'}</Badge>
                </div>

                <div className="container">
                    <div ref={chartRef} style={{ width: '100%', height: '180px' }}></div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-3">Device WiFi Logs</h2>
                    <Tabs defaultValue="hourly" className="w-full">
                        <TabsList>
                            <TabsTrigger value="hourly">Hourly</TabsTrigger>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        </TabsList>

                        <TabsContent value="hourly">
                            <div className="flex flex-col gap-3 mb-3">
                                <div className="flex flex-wrap items-end gap-2">
                                    <div className="grid gap-1.5">
                                        <Label>Day</Label>
                                        <Input
                                            type="date"
                                            value={wifiDate}
                                            onChange={(e) => {
                                                setWifiPage(1)
                                                setWifiDate(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const d = new Date(wifiDate + 'T00:00:00Z')
                                            d.setUTCDate(d.getUTCDate() - 1)
                                            setWifiPage(1)
                                            setWifiDate(d.toISOString().slice(0, 10))
                                        }}
                                    >
                                        Prev Day
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const d = new Date(wifiDate + 'T00:00:00Z')
                                            d.setUTCDate(d.getUTCDate() + 1)
                                            setWifiPage(1)
                                            setWifiDate(d.toISOString().slice(0, 10))
                                        }}
                                    >
                                        Next Day
                                    </Button>
                                </div>
                            </div>
                            <SimpleTable
                                isLoading={wifiGroupedLoading}
                                data={wifiGroupedRows}
                                columns={[
                                    { label: 'Hour', data: 'hour', formatDateTime: true, offset: 8 },
                                    { label: 'Count', data: 'call_count' }
                                ]}
                            />
                            <div className="mt-3 flex justify-end">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setWifiPage((p) => Math.max(1, p - 1))
                                                }}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" onClick={(e) => e.preventDefault()} isActive>
                                                {wifiPage} / {wifiTotalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setWifiPage((p) => Math.min(wifiTotalPages, p + 1))
                                                }}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </TabsContent>

                        <TabsContent value="weekly">
                            <div className="flex flex-col gap-3 mb-3">
                                <div className="flex flex-wrap items-end gap-2">
                                    <div className="grid gap-1.5">
                                        <Label>Month</Label>
                                        <Input
                                            type="month"
                                            value={wifiMonth}
                                            onChange={(e) => setWifiMonth(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const d = new Date(wifiMonth + '-01T00:00:00Z')
                                            d.setUTCMonth(d.getUTCMonth() - 1)
                                            setWifiMonth(d.toISOString().slice(0, 7))
                                        }}
                                    >
                                        Prev Month
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const d = new Date(wifiMonth + '-01T00:00:00Z')
                                            d.setUTCMonth(d.getUTCMonth() + 1)
                                            setWifiMonth(d.toISOString().slice(0, 7))
                                        }}
                                    >
                                        Next Month
                                    </Button>
                                </div>
                            </div>
                            <SimpleTable
                                isLoading={wifiWeeklyLoading}
                                data={wifiWeeklyRows}
                                columns={[
                                    { label: 'Week Start', data: 'week_start', formatDateTime: true, offset: 8 },
                                    { label: 'Week End', data: 'week_end', formatDateTime: true, offset: 8 },
                                    { label: 'Count', data: 'call_count' }
                                ]}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <div>
                    <div className="grid grid-cols-8 gap-4">

                        <div className="col-span-12 lg:col-span-3">

                            <h2 className="text-2xl font-bold tracking-tight mb-3">Device Settings</h2>
                            {filteredData.name != "0" && <>
                                <DynamicForm
                                    module={'Device'}
                                    data={filteredData}
                                    inputs={colInputs}
                                    customCols={[
                                        {
                                            title: 'General',
                                            list: [{ label: 'id', alt_class: 'hidden w-1/3  mx-4 my-2 ' },
                                            { label: 'label', alt_class: 'w-full mx-4 my-2 lg:w-2/3' },
                                                'reading_pin',
                                                'default_io_pin',
                                            ...(user?.userStruct?.role?.name == 'admin' ? [
                                                'default_delay',
                                                'format',
                                            ] : []),
                                            { label: 'record_wifi_time', boolean: true },
                                            { label: 'is_round_down', boolean: true },
                                            { label: 'keep_pending_task', boolean: true },
                                            { label: 'is_active', boolean: true },
                                            { label: 'is_rs232', boolean: true }
                                            ]
                                        }
                                    ]}
                                    postFn={function (): void {
                                        console.log('postfn')
                                        localStorage.removeItem('devicesData');
                                        fetchCurrentData()

                                    }}>

                                </DynamicForm>
                            </>}

                        </div>
                        <div className="col-span-12 lg:col-span-2 mt-8 lg:mt-0">
                            <h2 className="text-2xl font-bold tracking-tight mb-3">Controls</h2>
                            <Card>
                                <CardHeader >

                                    <div>Custom Commands </div>

                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={sendCustomCommand} className="flex flex-col items-start gap-4">
                                        <Input type="hidden" name={"name"} value={filteredData.name}></Input>
                                        <Input type="hidden" name={"scope"} value={'start_pwm'}></Input>
                                        <Input type="hidden" name={"action"} value={'start'}></Input>
                                        {user?.userStruct?.role?.name == 'admin' && (
                                            <>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Label >Delay</Label>
                                                    <Input type="number" step="0.1" name={"delay"}></Input>
                                                </div>
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Label >Format</Label>
                                                    <Input type="text" name={"format"} ></Input>
                                                </div>
                                            </>
                                        )}
                                        {user?.userStruct?.role?.name != 'admin' && (
                                            <>
                                                <Input type="number" className="hidden" value={filteredData.default_delay} step="0.1" name={"delay"}></Input>


                                            </>
                                        )}
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label >Reps</Label>
                                            <Input type="number" name={"value"}></Input>
                                        </div>
                                        <Button>Submit</Button>
                                    </form>

                                </CardContent>
                            </Card>


                        </div>



                        {otaStatus && (
                            <div className="col-span-12 lg:col-span-2 mt-8 lg:mt-0">
                                <Card className="mt-4">
                                    <CardHeader>
                                        <div>OTA Status</div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-gray-600 mb-2">{otaStatus.status}</div>
                                        <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-4"
                                                style={{ width: `${Math.max(0, Math.min(100, otaStatus.progress ?? 0))}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>{Math.max(0, Math.min(100, otaStatus.progress ?? 0))}%</span>
                                            {otaLastUpdatedAt && (
                                                <span>Updated {new Date(otaLastUpdatedAt).toLocaleTimeString()}</span>
                                            )}
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                            {otaStatus.current_version && (
                                                <div>
                                                    <span className="text-gray-500">Current:</span> {otaStatus.current_version}
                                                </div>
                                            )}
                                            {otaStatus.target_version && (
                                                <div>
                                                    <span className="text-gray-500">Target:</span> {otaStatus.target_version}
                                                </div>
                                            )}
                                            {typeof otaStatus.update_available === 'boolean' && (
                                                <div className="col-span-2">
                                                    <span className="text-gray-500">Update Available:</span> {otaStatus.update_available ? 'Yes' : 'No'}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            )}


                        {filteredData.name != "0" && filteredData.qr_code_data && <div className="col-span-12 lg:col-span-3 mt-8 lg:mt-0 lg:ml-2 ">
                            <div className="w-full flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-bold tracking-tight mb-3">DuitNow QR</h2>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=ec2f66&data=${encodeURIComponent(filteredData.qr_code_data)}`}
                                    alt="QR Code"
                                    width={150}
                                    height={150}
                                    style={{
                                        display: 'block',
                                        WebkitUserSelect: 'none',
                                        margin: 'auto',
                                        backgroundColor: 'hsl(0, 0%, 90%)',
                                        transition: 'background-color 300ms',
                                    }}
                                />
                                <p  >Print this qrcode</p>
                            </div>

                        </div>}
                    </div>
                </div>
                {user?.userStruct?.role?.name == 'admin' && (
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-3">Firmwares</h2>
                        <DataTable canDelete={true}
                            showNew={true}
                            // appendQueries={{ device_id: id }}
                            buttons={[{ name: 'Update Firmware', onclickFn: clickFn },
                            ]}
                            model={'Firmware'}
                            search_queries={['a.version']}
                            customCols={
                                [
                                    {
                                        title: 'General',
                                        list: [
                                            'id',
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
                                { label: 'ID', data: 'id' },
                                { label: 'Version', data: 'version' },
                                { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                            ]}
                        />
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-3">Job History</h2>
                    <DataTable
                        // canDelete={user?.userStruct?.role?.name == 'admin'}
                        canDelete={true}
                        showNew={user?.userStruct?.role?.name == 'admin'}
                        appendQueries={{ device_id: id }}
                        model={'DeviceLog'}
                        search_queries={['a.uuid']}
                        customCols={
                            [
                                {
                                    title: 'General',
                                    list: [
                                        'id',
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
                            { label: 'ID', data: 'id' },
                            {
                                label: 'ID', data: 'remarks', formatMessage: true, replaceFn: (v: string) => {
                                    const match = v.match(/sales id:(\d+)/);
                                    const pinMatch = v.match(/on pin (\d+)/);
                                    const pwmMatch = pinMatch ? v.match(/Send (\d+) reps/) : null;
                                    console.log('match', match)
                                    console.log('pwmMatch', pwmMatch)
                                    console.log('pinMatch', pinMatch)
                                    if (match) return `sales id: ${match[1]}`;
                                    if (pwmMatch && pinMatch) {
                                        return `manual start Send ${pwmMatch[1]} reps on pin ${pinMatch[1]}`;
                                    }
                                    return v;
                                }
                            },
                            ...(user?.userStruct?.role?.name == 'admin'
                                ? [{ label: 'Remarks', data: 'remarks', subtitle: { label: 'ref', data: 'uuid' } }]
                                : [{ label: 'Ref', data: 'uuid' }]
                            ),
                            { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                        ]}
                    />
                </div>

                {user?.userStruct?.role?.name == 'admin' && (
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-3">Pin Readings</h2>
                        <DataTable canDelete={true}
                            showNew={true}
                            appendQueries={{ device_id: id }}
                            model={'IoReading'}
                            search_queries={['a.log']}
                            customCols={
                                [
                                    {
                                        title: 'General',
                                        list: [
                                            'id',
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
                                { label: 'ID', data: 'id' },
                                { label: 'Remarks', data: 'log' },
                                { label: 'Final Data', data: 'final_data' },
                                { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                            ]}
                        />
                    </div>
                )}


            </div>
        </>
    )
}