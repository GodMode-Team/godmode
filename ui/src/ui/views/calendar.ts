/**
 * Calendar Component — Week / Day / Month views
 * Used in Today tab full-screen calendar mode
 */

import { html, nothing } from "lit";

// ===== Types =====

export type CalendarEvent = {
  id: string;
  title: string;
  startTime: Date;
  duration: number; // minutes
  location?: string;
  calendarName?: string;
};

export type DayTask = {
  id: string;
  name: string;
  status: "pending" | "complete";
  priority: "high" | "medium" | "low";
  project?: string | null;
  dueDate?: string | null;
  carryOver?: boolean;
};

export type CalendarViewMode = "week" | "day" | "month";

export type CalendarProps = {
  events: CalendarEvent[];
  tasks: DayTask[];
  viewMode: CalendarViewMode;
  startDate: Date; // The anchor date (start of week, selected day, or start of month)
  onViewModeChange?: (mode: CalendarViewMode) => void;
  onNavigate?: (direction: "prev" | "next" | "today") => void;
};

// ===== Helpers =====

function formatHourLabel(hour: number): string {
  if (hour === 0) {
    return "12 AM";
  }
  if (hour < 12) {
    return `${hour} AM`;
  }
  if (hour === 12) {
    return "12 PM";
  }
  return `${hour - 12} PM`;
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekDates(anchor: Date): Date[] {
  const start = new Date(anchor);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function getMonthDates(anchor: Date): Date[][] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

  const weeks: Date[][] = [];
  let current = new Date(startDate);
  while (current <= lastDay || current.getDay() !== 0) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) {
      break;
    } // Max 6 weeks display
  }
  return weeks;
}

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getHeaderLabel(viewMode: CalendarViewMode, startDate: Date): string {
  if (viewMode === "day") {
    return `${DAY_NAMES_SHORT[startDate.getDay()]}, ${MONTH_NAMES[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
  }
  if (viewMode === "month") {
    return `${MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()}`;
  }
  // Week view: show range
  const weekDates = getWeekDates(startDate);
  const first = weekDates[0];
  const last = weekDates[6];
  if (first.getMonth() === last.getMonth()) {
    return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
  }
  return `${MONTH_NAMES[first.getMonth()].slice(0, 3)} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()].slice(0, 3)} ${last.getDate()}, ${last.getFullYear()}`;
}

// ===== Render: Week View =====

function renderWeekView(events: CalendarEvent[], tasks: DayTask[], startDate: Date) {
  const weekDates = getWeekDates(startDate);
  const today = new Date();
  const startHour = 6;
  const endHour = 22;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalMinutes = (endHour - startHour) * 60;

  // Current time indicator
  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowPercent =
    nowHour >= startHour && nowHour < endHour
      ? (((nowHour - startHour) * 60 + nowMinute) / totalMinutes) * 100
      : -1;

  // Map events to day columns
  const eventsByDay = weekDates.map((date) => events.filter((e) => isSameDay(e.startTime, date)));

  // Map tasks with due dates to day columns
  const tasksByDay = weekDates.map((date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return tasks.filter((t) => t.dueDate === dateStr && t.status === "pending");
  });

  return html`
    <div class="cal-week">
      <!-- Day headers -->
      <div class="cal-week-header">
        <div class="cal-hour-gutter"></div>
        ${weekDates.map(
          (date, i) => html`
          <div class="cal-day-header ${isSameDay(date, today) ? "today" : ""}">
            <span class="cal-day-name">${DAY_NAMES_SHORT[i]}</span>
            <span class="cal-day-number ${isSameDay(date, today) ? "today" : ""}">${date.getDate()}</span>
            ${
              tasksByDay[i].length > 0
                ? html`<span class="cal-task-count">${tasksByDay[i].length} task${tasksByDay[i].length > 1 ? "s" : ""}</span>`
                : nothing
            }
          </div>
        `,
        )}
      </div>

      <!-- Time grid -->
      <div class="cal-week-body">
        <!-- Hour labels -->
        <div class="cal-hour-gutter">
          ${hours.map(
            (hour) => html`
            <div class="cal-hour-label" style="height: ${100 / hours.length}%">
              <span>${formatHourLabel(hour)}</span>
            </div>
          `,
          )}
        </div>

        <!-- Day columns -->
        ${weekDates.map(
          (date, dayIdx) => html`
          <div class="cal-day-col ${isSameDay(date, today) ? "today" : ""}">
            <!-- Hour grid lines -->
            ${hours.map(
              () =>
                html`
                  <div class="cal-hour-line"></div>
                `,
            )}

            <!-- Events -->
            ${eventsByDay[dayIdx].map((event) => {
              const h = event.startTime.getHours();
              const m = event.startTime.getMinutes();
              if (h < startHour || h >= endHour) {
                return nothing;
              }
              const top = (((h - startHour) * 60 + m) / totalMinutes) * 100;
              const height = Math.max(((event.duration || 30) / totalMinutes) * 100, 1.5);
              return html`
                <div
                  class="cal-event"
                  style="top: ${top}%; height: ${Math.min(height, 100 - top)}%"
                  title="${formatTime(event.startTime)} — ${event.title}"
                >
                  <div class="cal-event-time">${formatTime(event.startTime)}</div>
                  <div class="cal-event-title">${event.title}</div>
                </div>
              `;
            })}

            <!-- Now indicator (only on today column) -->
            ${
              isSameDay(date, today) && nowPercent >= 0
                ? html`<div class="cal-now-line" style="top: ${nowPercent}%"></div>`
                : nothing
            }
          </div>
        `,
        )}
      </div>
    </div>
  `;
}

// ===== Render: Day View =====

function renderDayView(events: CalendarEvent[], tasks: DayTask[], startDate: Date) {
  const today = new Date();
  const startHour = 6;
  const endHour = 22;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalMinutes = (endHour - startHour) * 60;

  const dayEvents = events.filter((e) => isSameDay(e.startTime, startDate));
  const dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
  const dayTasks = tasks.filter((t) => t.dueDate === dateStr && t.status === "pending");

  const now = new Date();
  const nowPercent =
    isSameDay(startDate, today) && now.getHours() >= startHour && now.getHours() < endHour
      ? (((now.getHours() - startHour) * 60 + now.getMinutes()) / totalMinutes) * 100
      : -1;

  return html`
    <div class="cal-day">
      <div class="cal-day-body">
        <!-- Hour labels -->
        <div class="cal-hour-gutter">
          ${hours.map(
            (hour) => html`
            <div class="cal-hour-label" style="height: ${100 / hours.length}%">
              <span>${formatHourLabel(hour)}</span>
            </div>
          `,
          )}
        </div>

        <!-- Single day column -->
        <div class="cal-day-col today-full">
          ${hours.map(
            () =>
              html`
                <div class="cal-hour-line"></div>
              `,
          )}

          ${dayEvents.map((event) => {
            const h = event.startTime.getHours();
            const m = event.startTime.getMinutes();
            if (h < startHour || h >= endHour) {
              return nothing;
            }
            const top = (((h - startHour) * 60 + m) / totalMinutes) * 100;
            const height = Math.max(((event.duration || 30) / totalMinutes) * 100, 2);
            return html`
              <div
                class="cal-event"
                style="top: ${top}%; height: ${Math.min(height, 100 - top)}%"
                title="${formatTime(event.startTime)} — ${event.title}"
              >
                <div class="cal-event-time">${formatTime(event.startTime)}</div>
                <div class="cal-event-title">${event.title}</div>
                ${event.location ? html`<div class="cal-event-location">${event.location}</div>` : nothing}
              </div>
            `;
          })}

          ${
            nowPercent >= 0
              ? html`<div class="cal-now-line" style="top: ${nowPercent}%"></div>`
              : nothing
          }
        </div>
      </div>

      <!-- Task sidebar for the day -->
      ${
        dayTasks.length > 0
          ? html`
            <div class="cal-day-tasks">
              <div class="cal-day-tasks-header">Tasks due</div>
              ${dayTasks.map(
                (task) => html`
                <div class="cal-day-task-item">
                  <span class="cal-task-dot priority-${task.priority}"></span>
                  <span class="cal-task-name">${task.name}</span>
                </div>
              `,
              )}
            </div>
          `
          : nothing
      }
    </div>
  `;
}

// ===== Render: Month View =====

function renderMonthView(events: CalendarEvent[], tasks: DayTask[], startDate: Date) {
  const today = new Date();
  const weeks = getMonthDates(startDate);
  const currentMonth = startDate.getMonth();

  // Index events by date string for quick lookup
  const eventIndex: Record<string, CalendarEvent[]> = {};
  for (const e of events) {
    const key = `${e.startTime.getFullYear()}-${String(e.startTime.getMonth() + 1).padStart(2, "0")}-${String(e.startTime.getDate()).padStart(2, "0")}`;
    if (!eventIndex[key]) {
      eventIndex[key] = [];
    }
    eventIndex[key].push(e);
  }

  const taskIndex: Record<string, DayTask[]> = {};
  for (const t of tasks) {
    if (t.dueDate) {
      if (!taskIndex[t.dueDate]) {
        taskIndex[t.dueDate] = [];
      }
      taskIndex[t.dueDate].push(t);
    }
  }

  return html`
    <div class="cal-month">
      <!-- Day name headers -->
      <div class="cal-month-header">
        ${DAY_NAMES_SHORT.map((name) => html`<div class="cal-month-day-name">${name}</div>`)}
      </div>

      <!-- Week rows -->
      ${weeks.map(
        (week) => html`
        <div class="cal-month-week">
          ${week.map((date) => {
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const dayEvents = eventIndex[dateStr] ?? [];
            const dayTasks = taskIndex[dateStr] ?? [];
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = isSameDay(date, today);

            return html`
              <div class="cal-month-cell ${isCurrentMonth ? "" : "other-month"} ${isToday ? "today" : ""}">
                <div class="cal-month-date ${isToday ? "today" : ""}">${date.getDate()}</div>
                <div class="cal-month-items">
                  ${dayEvents.slice(0, 3).map(
                    (e) => html`
                    <div class="cal-month-event" title="${formatTime(e.startTime)} ${e.title}">
                      <span class="cal-month-event-dot"></span>
                      <span class="cal-month-event-text">${e.title}</span>
                    </div>
                  `,
                  )}
                  ${
                    dayEvents.length > 3
                      ? html`<div class="cal-month-more">+${dayEvents.length - 3} more</div>`
                      : nothing
                  }
                  ${dayTasks
                    .filter((t) => t.status === "pending")
                    .slice(0, 2)
                    .map(
                      (t) => html`
                    <div class="cal-month-task" title="${t.name}">
                      <span class="cal-task-dot priority-${t.priority}"></span>
                      <span class="cal-month-event-text">${t.name}</span>
                    </div>
                  `,
                    )}
                </div>
              </div>
            `;
          })}
        </div>
      `,
      )}
    </div>
  `;
}

// ===== Main Render =====

export function renderCalendar(props: CalendarProps) {
  const { events, tasks, viewMode, startDate, onViewModeChange, onNavigate } = props;
  const headerLabel = getHeaderLabel(viewMode, startDate);

  return html`
    <div class="cal-container">
      <!-- Calendar Header -->
      <div class="cal-header">
        <div class="cal-nav">
          <button class="cal-nav-btn" @click=${() => onNavigate?.("prev")} title="Previous">‹</button>
          <button class="cal-nav-btn cal-today-btn" @click=${() => onNavigate?.("today")}>Today</button>
          <button class="cal-nav-btn" @click=${() => onNavigate?.("next")} title="Next">›</button>
        </div>
        <h2 class="cal-header-label">${headerLabel}</h2>
        <div class="cal-view-switcher">
          <button
            class="cal-view-btn ${viewMode === "day" ? "active" : ""}"
            @click=${() => onViewModeChange?.("day")}
          >Day</button>
          <button
            class="cal-view-btn ${viewMode === "week" ? "active" : ""}"
            @click=${() => onViewModeChange?.("week")}
          >Week</button>
          <button
            class="cal-view-btn ${viewMode === "month" ? "active" : ""}"
            @click=${() => onViewModeChange?.("month")}
          >Month</button>
        </div>
      </div>

      <!-- Calendar Body -->
      <div class="cal-body">
        ${viewMode === "week" ? renderWeekView(events, tasks, startDate) : nothing}
        ${viewMode === "day" ? renderDayView(events, tasks, startDate) : nothing}
        ${viewMode === "month" ? renderMonthView(events, tasks, startDate) : nothing}
      </div>
    </div>
  `;
}
