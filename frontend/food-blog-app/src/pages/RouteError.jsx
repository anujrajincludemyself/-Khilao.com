import React from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'Please refresh the page or try again in a moment.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || 'Error'}`
    message = typeof error.data === 'string' ? error.data : message
  } else if (error instanceof Error) {
    message = error.message || message

    if (message.toLowerCase().includes('network error')) {
      title = 'Backend Not Reachable'
      message = 'Could not connect to API. Start backend on http://localhost:5000 and retry.'
    }
  }

  return (
    <div className="min-h-[70vh] w-[92%] max-w-2xl mx-auto flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">{title}</h1>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-md transition"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
