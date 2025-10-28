'use client';

import { useModelStore } from "@/store/useModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function Model() {
    const { model : currentModel , updateModel} = useModelStore();
    const MODELS = ['gpt-3.5-turbo', "gpt-4", "gpt-4o"]
    const handleChange = (selectModel: string) =>{
        updateModel(selectModel)
    }
  return (
    <>
    {/* 현재 선택된 model이 value, 선택한 value 저장 */}
      <Select value={currentModel} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="모델 선택" />
        </SelectTrigger>
        <SelectContent>
            {MODELS.map((model) => (
                <SelectItem key={model} value={model} disabled={model===currentModel}>{model}</SelectItem>
            ))}
        </SelectContent>
      </Select>
    </>
  );
}
