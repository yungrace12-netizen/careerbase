import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import {
  Container,
  ContentWrapper,
  PageWrapper,
} from '@/components/layout';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

function PlaceholderPage({ description }: PlaceholderPageProps) {
  return (
    <PageWrapper>
      <Container>
        <ContentWrapper>
          <Card>
            <CardContent>
              <Typography variant="body" tone="secondary" className="mb-3">
                {description}
              </Typography>
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
