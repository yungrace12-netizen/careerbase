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
                현재 버전에서는 관련 기능 화면에서 데이터를 관리합니다.
              </Typography>
            </CardContent>
          </Card>
        </ContentWrapper>
      </Container>
    </PageWrapper>
  );
}

export { PlaceholderPage };
