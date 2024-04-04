import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
import { IconButton } from "./IconButton"
import { Table } from "./table/Table"
import { TableHeader } from "./table/TableHeader"
import { TableCell } from "./table/TableCell"
import { TableRow } from "./table/TableRow"
import { ChangeEvent, useEffect, useState } from "react"
import dayjs from "dayjs"
import realtiveTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(realtiveTime)
dayjs.locale('pt-br')

interface AtteendeeProps {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {
    const [ search, setSearch ] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('search')) {
            return url.searchParams.get('search') ?? ''
        }

        return ''
    })
    const [ page, setPage ] = useState(() => {
        const url = new URL(window.location.toString())

        if(url.searchParams.has('page')) {
            return Number(url.searchParams.get('page'))
        }

        return 1
    })
    const [ attendees, setAttendees ] = useState<AtteendeeProps[]>([])
    const [ total, setTotal ] = useState(0)


    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

        url.searchParams.set('pageIndex', String(page - 1))

        if(search.length > 1) {
            url.searchParams.set('query', search)
        }


        fetch(url)
            .then(response => response.json())
            .then(data => {
                setAttendees(data.attendees)
                setTotal(data.total)
            })
    }, [page, search])

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)
        window.history.pushState({}, '', url)

        setSearch(search)
    }

    const totalPages = Math.ceil(total / 10)

    function setCurrentPage(page:number) {
        const url = new URL(window.location.toString())
        url.searchParams.set('page', String(page))
        window.history.pushState({}, '', url)

        setPage(page)
    }

    function onSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(e.target.value)
        setCurrentPage(1)
    }

    function goToNextPage() {
        setCurrentPage(page + 1)
    }

    function goPreviousNextPage() {
        setCurrentPage(page - 1)
    }

    function goToFistPage() {
        setCurrentPage(1)
    }

    function goToLastPage() {
        setCurrentPage(totalPages)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 py-1.5 border border-white/10 rounded-lg text-sm w-72 flex items-center gap-3">
                    <Search className="size-4 text-emerald-300"/>
                    <input 
                        onChange={onSearchInputChange} 
                        value={search}
                        type="text" placeholder="Buscar participantes..." 
                        className="bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm focus:ring-0"
                    />
                </div>

            </div>

            <Table>
                <thead>
                    <TableRow>
                        <TableHeader style={{ width: 48 }}>
                            <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 "/>
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }}></TableHeader>
                    </TableRow>
                </thead>

                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} className="hover:bg-white/5">
                                <TableCell>
                                    <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10 checked:"/>
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-white">{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {dayjs().to(attendee.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {attendee.checkedInAt === null ? <span className="text-zinc-400">Não fez check-in</span> : dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent={true}>
                                        <MoreHorizontal className="size-4"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>

                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>Mostrando {attendees.length} de {total} itens</TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>Pagina {page} de {totalPages}</span>
                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFistPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4"/>
                                    </IconButton>
                                    <IconButton onClick={goPreviousNextPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4"/>
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4"/>
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4"/>
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
            
        </div>
    )
}