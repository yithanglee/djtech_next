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

    const wsUrl = PHX_ENDPOINT
    const socket = new Socket(`${PHX_WS_PROTOCOL}${wsUrl}/socket`)
    socket.connect()

    const fetchColInputs = async () => {
        const inputs = await genInputs(url, 'Device');
        setColInputs(inputs);
    };

    const fetchCurrentData = () => {
        fetch(`${url}/svt_api/webhook?scope=get_role_app_routes&id=${id}`).then((response: any) => {
            console.log(response)
            if (response.ok) {
                response.json().then((res: any) => {
                    localStorage.setItem('roleAppRoutesData', JSON.stringify([res]))
                    setData([res])
                });

            }

        })
    }

    useEffect(() => {
        fetchColInputs();
        const storedData = localStorage.getItem('roleAppRoutesData');  // Replace 'modelData' with your key
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


    return (
        <>
            <div className="space-y-6">
                <BreadcrumbHelper items={[
                    { link: '/roles', title: 'Roles' },
                    { link: `/roles/${filteredData.id}/app_routes`, title: `${filteredData.name}` },
                ]} />

                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-3">Role App Routes</h2>
                    <DataTable canDelete={true}
                        showNew={true}
                        appendQueries={{ role_id: id }}
                        model={'RoleAppRoute'}
                        preloads={['app_route']}
                        // search_queries={['a.uuid']}
                        customCols={
                            [
                                {
                                    title: 'General',
                                    list: [
                                        'id',
                                        'role_id',
                                        {
                                            label: 'app_route_id',
                                            selection: 'AppRoute',
                                            multiSelection: true,
                                            dataList: [],
                                            parentId: id,
                                            alt_class: 'w-full lg:w-1/3 mx-4 my-2',
                                            customCols: null,
                                            newData: 'name',
                                            title_key: 'name'
                                        },



                                        
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
                            { label: 'App Route', data: 'name', through: ['app_route'] },
                            { label: 'App Route', data: 'route', through: ['app_route'] },
                            { label: 'Timestamp', data: 'inserted_at', formatDateTime: true, offset: 8 }
                        ]}


                    />
                </div>

            </div>
        </>
    )
}