'use client'

import { api } from '@/lib/api'
import { useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Cookie from 'js-cookie'
import Image from 'next/image'
import dayjs from 'dayjs'
import Link from 'next/link'

interface Memory {
  coverUrl: string
  content: string
  createdAt: string
}

export default async function ShowMemory() {
  const params = useParams()
  const { id } = params

  const token = Cookie.get('token')
  const response = await api.get(`/memories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data as Memory

  return (
    <div className="flex flex-col gap-10 p-8">
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
      </time>

      <Image
        src={memory.coverUrl}
        width={592}
        height={280}
        className="aspect-video w-full rounded-lg object-cover"
        alt=""
      />

      <p className="text-lg leading-relaxed text-gray-100">{memory.content}</p>

      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        back to timeline
      </Link>
    </div>
  )
}
