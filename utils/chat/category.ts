const topicKeywords = {
  tech: ['기술', '스택', 'tech', '언어', '프레임워크', '도구', '라이브러리'],
  projects: ['프로젝트', '커리어', 'project', '개발한', '만든', '경험'],
  values: ['가치', '협업', '태도', '스타일', '마인드', '철학', '일하는 방식'],
  basic: ['소개', '누구', '자기소개', '본인', '당신', '경력'],
  personality: ['성격', '인성', '대인관계', '팀워크', '사람', '성향'],
};
export function detectCategory(text: string) {
  const lower = text.toLowerCase(); // toLowerCase()로 소문자 변환

  return (Object.keys(topicKeywords) as Array<keyof typeof topicKeywords>) // obj의 key만 추려서 타입으로 만들어줌
    .filter((key) => topicKeywords[key].some((kw) => lower.includes(kw))); //some() : 하나라도 만족하면 true 반환, filter() : 조건 만족하는 key들만 배열로 반환
}
