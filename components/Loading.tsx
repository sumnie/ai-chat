import { Loader2 } from "lucide-react";

export function Loading() {
    return (        
      <div className="flex flex-col justify-center items-center min-h-[100vh] max-h-[100vh] overflow-y-auto bg-zinc-100">
        <Loader2 className="animate-spin mb-3" size={28} />
        <span className="text-gray-500">세션을 확인하는 중입니다...</span>
      </div>
    )
}