import Container from "@/components/layout/Container/Container";


type Custom404Props = {}

const Custom404 = ({}: Custom404Props) => {
  return (
    <Container>
      <h1 className="py-1">페이지를 찾을 수 없습니다</h1>
    </Container>
  );
};

export default Custom404;
