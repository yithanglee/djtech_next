'use client';
import DataTable from "@/components/data/table"
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
import Image from 'next/image';
import { Socket } from "phoenix";
declare global {
    interface Window {
        JSC: any
    }
}
export default function DetailsPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const id = params.id
    const [colInputs, setColInputs] = useState<any[]>([])
    const url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;
    const [filteredData, setFilteredData] = useState<any>({ id: 0, name: 0, outlet: { name: '' } });
    let { toast } = useToast()





    const [isConnected, setIsConnected] = useState(false)
    const wsUrl = PHX_ENDPOINT


    const socket = new Socket(`${PHX_WS_PROTOCOL}${wsUrl}/socket`)
    socket.connect()



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

    useEffect(() => {
        fetchColInputs();

        const storedData = localStorage.getItem('devicesData');  // Replace 'modelData' with your key
        if (storedData) {
            setData(JSON.parse(storedData));  // Parse and set the data in state

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

        console.log('filteredData')
        console.log(filteredData)
        console.log(colInputs)
        console.log(filteredData.name)

        if (filteredData.name != "0") {
            const channel = socket.channel('user:' + filteredData.name, {})

            channel.join()
                .receive('ok', () => {
                    console.log(`Successfully joined channel ${filteredData.name}`)
                    setIsConnected(true)
                })
                .receive('error', (resp) => {
                    console.error('Unable to join channel', resp)
                })

            channel.on('i_am_online', (payload) => {
                console.info(payload);
                setIsConnected(true);
            });

            setInterval(() => {
                console.log('set offline');
                setIsConnected(false)
            }, 11000);
            return () => {

                channel.leave()
                socket.disconnect()
            }
        }

        setIsJSChartingLoaded(true)

    }, [filteredData, colInputs])


    const sendCustomCommand = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)


        formData.append(
            'item_name',
            `Send ` + formData.get('value') + ` reps (shorter ` + formData.get('delay') + `)`
        );



        postData({
            endpoint: `${url}/svt_api/webhook`,
            data: formData,
            isFormData: true,
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
                                                'default_io_pin',
                                                'default_delay',
                                                'format',
                                        
                                         
                                            { label: 'record_wifi_time', boolean: true },
                                            { label: 'is_active', boolean: true }
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
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label >Delay</Label>
                                            <Input type="text" name={"delay"}></Input>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label >Reps</Label>
                                            <Input type="number" name={"value"}></Input>
                                        </div>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label >Format</Label>
                                            <Input type="text" name={"format"} ></Input>
                                        </div>
                                        <Button>Submit</Button>
                                    </form>

                                </CardContent>
                            </Card>

                        </div>


                        {filteredData.name != "0" && filteredData.qr_code_data && <div className="col-span-12 lg:col-span-3 mt-8 lg:mt-0 lg:ml-2 ">
                            <div className="w-full flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-bold tracking-tight mb-3">DuitNow QR</h2>
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=ec2f66&data=${filteredData.qr_code_data}`}
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

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-3">Job History</h2>
                    <DataTable canDelete={true}
                        showNew={true}
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
                            { label: 'Remarks', data: 'remarks', subtitle: { label: 'ref', data: 'uuid' } },
                            // { label: 'Ref', data: 'uuid' },
                            { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                        ]}


                    />
                </div>

            </div>
        </>
    )
}