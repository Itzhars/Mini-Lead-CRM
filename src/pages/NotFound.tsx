import React from "react"
import { Link } from "react-router-dom"
import { Compass, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-primary/10 p-6 rounded-3xl text-primary animate-bounce mb-6">
        <Compass className="h-16 w-16" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        404 - Page Not Found
      </h1>
      
      <p className="mt-4 text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        The resource you are looking for has been moved, renamed, or is temporarily unavailable. Let's get you back on track!
      </p>
      
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button asChild className="gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
export default NotFound
