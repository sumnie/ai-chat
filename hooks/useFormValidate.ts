// hooks 폴더는 React 프로젝트에서 거의 표준처럼 쓰이는 개념
// 여러 컴포넌트에서 공통적으로 사용할 로직을 모아두는 곳. 커스텀 훅 형태로 만들어 씀.
// 표준적인 형태는 useSomething()

// .ts인 이유?
// tsx는 “JSX 문법(리턴에 HTML-like 코드)”이 들어갈 때, >마크업코드
// ts는 “로직만 있는 순수 TypeScript 코드”일 때.

import { useState } from "react";
import { ZodObject, ZodRawShape } from "zod";
 
// 여러 필드면 z.object 
 
export function useFormValidate<T>(schema: ZodObject<ZodRawShape>){
    const [ errors, setErrors ] = useState<Partial<T>>() 
    // Partial<T>는 T타입의 모든 속성을 선택적으로 만드는 타입 도우미.
    // 즉 form에서 아직 입력하지 않은 값 -> 에러가 아직 없는 필드는 생략 가능하도록.
    // 에러가 있는 필드만 담을 수 있게 만드는 타입적 안전장치

    const validateField = (name: string, value: string) => {
        setErrors({...errors, [name]:undefined});//에러초기화. 사용자가 입력 바꿀때마다 name이라는 키값을 undefined으로 덮어 씌움. 이전에 뜬 에러메시지 지워주는 코드
        const parsedValue = schema.pick ({ [name]: true}).safeParse({ [name] : value})
        //.pick()은 Zod의 부분 스키마 추출 함수. [동적변수]로 필드 하나만 추출해서 검증 .safeParse()는 검증 중 에러가 나도 에러 대신 객체 형태로 반환해서 앱이 멈추지 않게 해주는 안전장치

        if (!parsedValue.success){
            setErrors({...errors, ...parsedValue.error.flatten().fieldErrors})
            // Zod의 에러 객체(ZodError)를 사람이 보기 좋은 평평한(flat) 구조로 바꿔줍니다. fieldErrors 객체의 각 필드는  배열 string[]형태. name: ["이름은 필수입니다.", "이름은 10자 이하로 입력해주세요."], 이렇게 하나의 필드에 여러 에러메시지가 붙을수도 있다고 가정하기 때문.
        }
    }
    return { errors, validateField }
}