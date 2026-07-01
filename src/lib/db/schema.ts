import {
  pgTable, uuid, text, integer, boolean,
  timestamp, date, jsonb, uniqueIndex, index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── schools ────────────────────────────────────────────────────────────────
export const schools = pgTable('schools', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(), // e.g. 'mattos', 'sinnott'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ─── school_schedule ─────────────────────────────────────────────────────────
// One row per day per school — defines which subject runs on which day
export const schoolSchedule = pgTable('school_schedule', {
  id:         uuid('id').primaryKey().defaultRandom(),
  schoolId:   uuid('school_id').notNull().references(() => schools.id, { onDelete: 'cascade' }),
  dayOfWeek:  integer('day_of_week').notNull(), // 1=Mon … 5=Fri
  subject:    text('subject').notNull(),         // 'science'|'coding'|'build'|'math'|'arts'|'public_speaking'|'free_build'
})

// ─── classrooms ─────────────────────────────────────────────────────────────
export const classrooms = pgTable('classrooms', {
  id:          uuid('id').primaryKey().defaultRandom(),
  schoolId:    uuid('school_id').references(() => schools.id),
  teacherId:   uuid('teacher_id'),
  name:        text('name').notNull(),
  gradeLevel:  text('grade_level').notNull(), // '1','2','3','4'
  gradeBand:   text('grade_band').notNull(),  // 'g1-2' | 'g3-4'
  accessCode:  text('access_code').notNull().unique(), // 6-char code e.g. KEEN42
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

// ─── users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  schoolId:     uuid('school_id').references(() => schools.id, { onDelete: 'set null' }),
  classroomId:  uuid('classroom_id').references(() => classrooms.id, { onDelete: 'set null' }),
  name:         text('name').notNull(),
  displayName:  text('display_name'),
  role:         text('role').notNull(), // 'student' | 'teacher' | 'admin'
  avatarId:     integer('avatar_id').default(1), // 1-20
  pinHash:      text('pin_hash'),       // students only (bcrypt of 4-digit PIN)
  email:        text('email').unique(), // teachers/admins only
  passwordHash: text('password_hash'), // teachers/admins only
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at'),
  deletedAt:    timestamp('deleted_at'), // soft delete
})

// ─── curriculum ──────────────────────────────────────────────────────────────
// Pre-built by KeenKids. Teachers assign, don't create.
export const curriculum = pgTable('curriculum', {
  id:            uuid('id').primaryKey().defaultRandom(),
  title:         text('title').notNull(),        // e.g. "Week 1 — Exploring Forces"
  gradeBand:     text('grade_band').notNull(),   // 'g1-2' | 'g3-4'
  weekNumber:    integer('week_number').notNull(), // 1-36
  theme:         text('theme'),                  // e.g. "Structures & Materials"
  isActive:      boolean('is_active').default(true).notNull(), // KeenKids controls availability
  createdAt:     timestamp('created_at').defaultNow().notNull(),
})

// ─── classroom_curriculum ────────────────────────────────────────────────────
// Which week a teacher has assigned to their classroom
export const classroomCurriculum = pgTable('classroom_curriculum', {
  id:            uuid('id').primaryKey().defaultRandom(),
  classroomId:   uuid('classroom_id').notNull().references(() => classrooms.id, { onDelete: 'cascade' }),
  curriculumId:  uuid('curriculum_id').notNull().references(() => curriculum.id),
  assignedBy:    uuid('assigned_by').references(() => users.id),
  weekStartDate: date('week_start_date').notNull(),
  assignedAt:    timestamp('assigned_at').defaultNow().notNull(),
}, (t) => ({
  uniqueClassroomWeek: uniqueIndex('uq_classroom_week').on(t.classroomId, t.weekStartDate),
}))

// ─── curriculum_days ─────────────────────────────────────────────────────────
export const curriculumDays = pgTable('curriculum_days', {
  id:           uuid('id').primaryKey().defaultRandom(),
  curriculumId: uuid('curriculum_id').notNull().references(() => curriculum.id, { onDelete: 'cascade' }),
  dayOfWeek:    integer('day_of_week').notNull(), // 1=Mon … 5=Fri
  subject:      text('subject').notNull(),        // 'science'|'coding'|'build'|'math'|'arts'|'reading'|'creativity'
  theme:        text('theme'),                    // e.g. "Paper Bridges"
})

// ─── content_items ───────────────────────────────────────────────────────────
export const contentItems = pgTable('content_items', {
  id:            uuid('id').primaryKey().defaultRandom(),
  subject:       text('subject').notNull(),
  type:          text('type').notNull(), // 'illustrated-steps'|'activity'|'puzzle'|'sandbox'|'experiment'|'canvas'
  title:         text('title').notNull(),
  description:   text('description'),
  thumbnailUrl:  text('thumbnail_url'),  // R2 key or external URL
  contentUrl:    text('content_url'),    // R2 prefix for step images, or external URL
  durationMins:  integer('duration_mins'),
  ageMin:        integer('age_min').default(6),
  ageMax:        integer('age_max').default(10),
  gradeBand:     text('grade_band').notNull(), // 'g1-2' | 'g3-4' | 'both'
  difficulty:    integer('difficulty').default(1), // 1-3
  tags:          text('tags').array(),
  stepCount:     integer('step_count'),    // for illustrated-steps type
  metadata:      jsonb('metadata'),        // type-specific data e.g. { questions: [...] } for math
  isAiGenerated: boolean('is_ai_generated').default(false),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
})

// ─── curriculum_content ──────────────────────────────────────────────────────
export const curriculumContent = pgTable('curriculum_content', {
  id:               uuid('id').primaryKey().defaultRandom(),
  curriculumDayId:  uuid('curriculum_day_id').notNull().references(() => curriculumDays.id, { onDelete: 'cascade' }),
  contentItemId:    uuid('content_item_id').notNull().references(() => contentItems.id),
  orderIndex:       integer('order_index').default(0),
})

// ─── student_sessions ────────────────────────────────────────────────────────
export const studentSessions = pgTable('student_sessions', {
  id:            uuid('id').primaryKey().defaultRandom(),
  studentId:     uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  contentItemId: uuid('content_item_id').notNull().references(() => contentItems.id),
  startedAt:     timestamp('started_at').defaultNow().notNull(),
  lastActiveAt:  timestamp('last_active_at'),
  progressPct:   integer('progress_pct').default(0), // 0-100
  lastStepIndex: integer('last_step_index').default(0),
  completed:     boolean('completed').default(false),
  completedAt:   timestamp('completed_at'),
  sessionData:   jsonb('session_data'),  // freeform: quiz answers, last step, etc.
}, (t) => ({
  uniqueStudentContent: uniqueIndex('uq_student_content').on(t.studentId, t.contentItemId),
  idxStudentCompleted:  index('idx_student_completed').on(t.studentId, t.completed),
}))

// ─── coding_projects ─────────────────────────────────────────────────────────
export const codingProjects = pgTable('coding_projects', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  studentId:            uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  curriculumContentId:  uuid('curriculum_content_id').references(() => curriculumContent.id),
  title:                text('title').default('My Project'),
  language:             text('language').notNull(), // 'scratch' | 'python' | 'blocks'
  r2Key:                text('r2_key').unique(),    // path in R2
  thumbnailR2Key:       text('thumbnail_r2_key'),
  lastSavedAt:          timestamp('last_saved_at').defaultNow().notNull(),
  createdAt:            timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  idxStudentProjects: index('idx_student_projects').on(t.studentId),
}))

// ─── achievements ────────────────────────────────────────────────────────────
export const achievements = pgTable('achievements', {
  id:        uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeType: text('badge_type').notNull(), // e.g. 'first_code','science_star','5_day_streak'
  earnedAt:  timestamp('earned_at').defaultNow().notNull(),
  metadata:  jsonb('metadata'),
})

// ─── Relations ───────────────────────────────────────────────────────────────
export const classroomsRelations = relations(classrooms, ({ many }) => ({
  users:                many(users),
  classroomCurriculum:  many(classroomCurriculum),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  classroom:      one(classrooms, { fields: [users.classroomId], references: [classrooms.id] }),
  sessions:       many(studentSessions),
  codingProjects: many(codingProjects),
  achievements:   many(achievements),
}))

export const curriculumRelations = relations(curriculum, ({ many }) => ({
  days:                many(curriculumDays),
  classroomCurriculum: many(classroomCurriculum),
}))

export const curriculumDaysRelations = relations(curriculumDays, ({ one, many }) => ({
  curriculum: one(curriculum, { fields: [curriculumDays.curriculumId], references: [curriculum.id] }),
  content:    many(curriculumContent),
}))

// ─── Types ───────────────────────────────────────────────────────────────────
export type Classroom        = typeof classrooms.$inferSelect
export type User             = typeof users.$inferSelect
export type Curriculum       = typeof curriculum.$inferSelect
export type CurriculumDay    = typeof curriculumDays.$inferSelect
export type ContentItem      = typeof contentItems.$inferSelect
export type CurriculumContent = typeof curriculumContent.$inferSelect
export type StudentSession   = typeof studentSessions.$inferSelect
export type CodingProject    = typeof codingProjects.$inferSelect
export type Achievement      = typeof achievements.$inferSelect

export type Role      = 'student' | 'teacher' | 'admin'
export type Subject   = 'science' | 'coding' | 'build' | 'math' | 'arts' | 'reading' | 'creativity' | 'public_speaking' | 'free_build'
export type GradeBand = 'g1-2' | 'g3-4' | 'both'
export type Language  = 'scratch' | 'python' | 'blocks'

export type School         = typeof schools.$inferSelect
export type SchoolSchedule = typeof schoolSchedule.$inferSelect
