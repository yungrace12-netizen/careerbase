import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import {
  Container,
  ContentWrapper,
  PageHeader,
  PageWrapper,
} from '@/components/layout';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <PageHeader title={title} description={description} />
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body" tone="secondary">
                Sprint 2에서는 레이아웃과 네비게이션 뼈대만 제공합니다.
              </Typography>
            </CardContent>
          </Card>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}

export { PlaceholderPage };
