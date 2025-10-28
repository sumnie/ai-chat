import { Model } from "./Model";
import { Theme } from "./Theme";

export function Header(){
    return <div className="flex justify-between items-center py-3">
        <Model />
        <Theme />
    </div>
}