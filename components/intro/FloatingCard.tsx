import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type Props = {
    title?: string;
    description?: string;
    children: React.ReactNode
}

export function FloatingCard({title, description, children}: Props){
    return <Card
        className={cn(
          "w-[90%] lg:w-[500px] border-0",
          "shadow-[0_48px_100px_0_rgba(17,12,46,0.15)]"
        )}>

        <CardHeader>
          <CardTitle className="font-normal text-lg sm:text-2xl">{title}</CardTitle>          
          <CardDescription className="text-md sm:text-xl text-gray-500">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between space-x-2">
            {children}
        </CardContent>

      </Card>
}