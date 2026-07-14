'use client';

import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Typography } from '@/components/ui/typography';
import type { CalendarSchedule } from '@/features/calendar/calendar-data';

interface ScheduleDetailModalProps {
  schedule: CalendarSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ScheduleDetailModal({
  schedule,
  open,
  onOpenChange,
}: ScheduleDetailModalProps) {
  if (!schedule) {
    return null;
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="일정 상세"
      description="Sprint 4에서는 조회용 Modal만 제공합니다."
      confirmLabel="닫기"
    >
      <div className="grid gap-4">
        <DetailRow label="기업명" value={schedule.companyName} />
        <DetailRow label="공고명" value={schedule.postingTitle} />
        <div className="grid gap-2">
          <Typography variant="caption" tone="secondary">
            일정 유형
          </Typography>
          <div>
            <Badge variant="primary">{schedule.type}</Badge>
          </div>
        </div>
        <DetailRow
          label="날짜"
          value={schedule.date ?? schedule.approximateText ?? '미정'}
        />
        <DetailRow label="시간" value={schedule.time ?? '시간 없음'} />
      </div>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2">
      <Typography variant="caption" tone="secondary">
        {label}
      </Typography>
      <Typography variant="body">{value}</Typography>
    </div>
  );
}

export { ScheduleDetailModal };
