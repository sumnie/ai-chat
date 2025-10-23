import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from '../ui/button';


interface SubmitProps extends ButtonProps {
  hasError?: boolean; // ✅ 에러 상태 전달
}

// ...others 나머지 props를 다 모아서 하나의 객체로 받는 문법”**.
// TypeScript 문법이 아니라 **JavaScript의 구조 분해 문법(Spread Syntax)**.
export function Submit({ children, hasError = false, ...others }: SubmitProps ) {
    
  const { pending } = useFormStatus();
  const disabled = pending || hasError; // ✅ 둘 중 하나라도 true면 비활성화
  return (
    <Button
        type="submit"
        aria-label="Submit"
        disabled={disabled }
      {...others}
    >
      {children}
    </Button>
  );
}
