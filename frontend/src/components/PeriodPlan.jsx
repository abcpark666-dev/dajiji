// Calendar dates from the reusable fixed week, with one-day changes through the existing
// day sheet. Kept inside Plan so closing that sheet returns to the same week or month.
import { useState } from 'react'
import { todayISO, isoOf, fmtDate, weekStartOf } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { periodPlan, periodRange } from '../lib/period-plan.js'
import { printPeriodPlan } from '../lib/plan-share.js'
import { dayOverrideSheet } from '../sheets.jsx'
import { Button, Segmented } from './ui.jsx'
import Icon from './Icon.jsx'
import { tappable } from '../lib/use-sheet-keyboard.js'

const moved = (iso, period, direction) => {
  const d = new Date(iso + 'T12:00:00')
  if (period === 'month') { d.setDate(1); d.setMonth(d.getMonth() + direction) }
  else d.setDate(d.getDate() + direction * 7)
  return isoOf(d)
}

export default function PeriodPlan({ S, owner = '', initialDate = todayISO(), today = todayISO(), onReport }) {
  const [period, setPeriod] = useState('week')
  const [anchor, setAnchor] = useState(initialDate)
  const currentFrom = periodRange(period, today, weekStartOf(S)).from
  const selectedFrom = periodRange(period, anchor, weekStartOf(S)).from
  const validAnchor = selectedFrom < currentFrom ? today : anchor
  const plan = periodPlan(S, period, validAnchor, today)
  const atCurrent = plan.current
  const title = period === 'week' ? t('Week of {0}', fmtDate(plan.from, false, true))
    : t('Month of {0}', plan.from.slice(0, 7))
  const exportPDF = () => printPeriodPlan(S, owner, { period, anchor: validAnchor, today })

  return <div className="plan-period">
    <div className="small muted" style={{ margin: '10px 2px' }}>
      {t('Pick a date to change its session. The weekly schedule fills the other dates.')}
    </div>
    <Segmented value={period} onChange={setPeriod} options={[
      { value: 'week', label: t('Week') }, { value: 'month', label: t('Month') },
    ]} />
    <div className="row between" style={{ margin: '12px 0 8px', gap: 8 }}>
      <button className="iconbtn" type="button" disabled={atCurrent} onClick={() => setAnchor(moved(validAnchor, period, -1))}
        aria-label={t('Previous period')}><Icon name="chevronLeft" /></button>
      <strong>{title}</strong>
      <button className="iconbtn" type="button" onClick={() => setAnchor(moved(validAnchor, period, 1))}
        aria-label={t('Next period')}><Icon name="chevronRight" /></button>
    </div>
    <div style={{ textAlign: 'center', marginBottom: 10 }}>
      <Button size="sm" variant="ghost" onClick={() => setAnchor(today)}>{t('Today')}</Button>
    </div>
    {atCurrent && <p className="small muted" data-plan-caveat>{t('Generated from the current plan. Past dates may differ from the schedule at that time.')}</p>}
    {plan.rotation && <p className="small muted">{t('Rotation sessions follow their order and have no fixed future dates. The calendar shows your fixed-day sessions and date changes.')}</p>}
    <Button variant="primary" icon="note" data-plan-export onClick={exportPDF}
      style={{ marginBottom: 8 }}>{t('Export this period as PDF')}</Button>
    {onReport && <Button variant="tinted" icon="chart" data-plan-report onClick={onReport}
      style={{ marginBottom: 14 }}>{t('View past training report')}</Button>}
    <div className="list plan-calendar-days">
      {plan.days.map(day => {
        const names = day.routines.map(r => r.name)
        const minutes = day.routines.map(r => Number(r.targetDurationMin) || 0).filter(n => n > 0)
        const time = minutes.length ? t('{0} min planned', minutes.reduce((a, b) => a + b, 0)) : ''
        return <div key={day.iso} className="item plan-calendar-day" data-plan-day={day.iso}
          {...tappable(() => dayOverrideSheet(day.iso))}>
          <span className="plan-day-n">{fmtDate(day.iso, true, true)}</span>
          <div className="grow">
            <div className="tt">{names.length ? names.join(' + ') : t('Rest day')}</div>
            {time && <div className="ss">{time}</div>}
          </div>
          <Icon name="chevronRight" className="chev" />
        </div>
      })}
    </div>
  </div>
}
