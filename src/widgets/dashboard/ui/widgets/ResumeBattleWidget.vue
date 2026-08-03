<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { mdiCreationOutline, mdiSwordCross, mdiTrophyOutline } from '@mdi/js'

import type {
  DashboardCommand,
  DashboardResumeBattle,
  DashboardResumeReadiness,
} from '@/features/dashboard'
import './widgetShared.css'

const props = defineProps<{
  battle: DashboardResumeBattle | null
  resume: DashboardResumeReadiness | null
  busyCommand: DashboardCommand['type'] | null
  actionError: string | null
}>()

const emit = defineEmits<{
  command: [command: DashboardCommand]
}>()

const activeRound = ref(0)
const isLocalReplay = ref(false)
const prefersReducedMotion = ref(false)
const announcement = ref('')
let motionQuery: MediaQueryList | null = null
let timers: number[] = []

const isGatewayBusy = computed(() => props.busyCommand === 'run-resume-battle')
const isRunning = computed(() => isGatewayBusy.value || isLocalReplay.value)
const hasResult = computed(() => props.battle?.status === 'completed' && !isRunning.value)
const winnerIsOriginal = computed(() => hasResult.value && props.battle?.winner === 'original')
const winnerIsTurbo = computed(() => hasResult.value && props.battle?.winner === 'sofi-turbo')
const winnerName = computed(() => {
  if (props.battle?.winner === 'original') return 'Резюме Софии'
  if (props.battle?.winner === 'sofi-turbo') return props.battle.challengerName
  return null
})
const winnerScore = computed(() => {
  if (props.battle?.winner === 'original') return props.resume?.score ?? null
  if (props.battle?.winner === 'sofi-turbo') return props.battle.challenger.score
  return null
})
const scoreDelta = computed(() =>
  props.resume && props.battle ? Math.abs(props.battle.challenger.score - props.resume.score) : 0,
)

const rounds = computed(() => {
  if (!props.resume || !props.battle) return []

  return [
    {
      label: 'ATS',
      original: props.resume.atsScore,
      challenger: props.battle.challenger.atsScore,
    },
    {
      label: 'Ключевые слова',
      original: props.resume.keywordsScore,
      challenger: props.battle.challenger.keywordsScore,
    },
    {
      label: 'Достижения',
      original: props.resume.achievementsScore,
      challenger: props.battle.challenger.achievementsScore,
    },
  ]
})

const visibleStatus = computed(() => {
  if (isRunning.value) {
    const round = rounds.value[Math.max(0, activeRound.value - 1)]
    return round ? `Раунд ${activeRound.value} из 3 · ${round.label}` : 'Готовим арену…'
  }

  if (hasResult.value) {
    return winnerName.value
      ? `${winnerName.value} побеждает · разница ${scoreDelta.value} баллов`
      : 'Сравнение завершено'
  }

  return 'Три раунда: ATS, ключевые слова и достижения'
})

function clearTimers(): void {
  timers.forEach((timer) => window.clearTimeout(timer))
  timers = []
}

function announceRound(round: number): void {
  activeRound.value = round
  const metric = rounds.value[round - 1]
  announcement.value = metric ? `Раунд ${round}: ${metric.label}` : ''
}

function startRoundSequence(isReplay: boolean): void {
  clearTimers()

  if (prefersReducedMotion.value) {
    activeRound.value = 3
    if (isReplay) {
      isLocalReplay.value = false
      announcement.value = winnerName.value
        ? `Повтор завершён. Победитель — ${winnerName.value}, ${winnerScore.value} из 100.`
        : 'Повтор завершён. Победитель не определён.'
    } else {
      announcement.value = 'Сравнение выполняется без анимации.'
    }
    return
  }

  announceRound(1)
  timers.push(window.setTimeout(() => announceRound(2), 420))
  timers.push(window.setTimeout(() => announceRound(3), 840))

  if (isReplay) {
    timers.push(
      window.setTimeout(() => {
        isLocalReplay.value = false
        announcement.value = winnerName.value
          ? `${winnerName.value} побеждает с результатом ${winnerScore.value} из 100.`
          : 'Повтор завершён. Победитель не определён.'
      }, 1260),
    )
  }
}

function runBattle(): void {
  if (!props.battle || !props.resume || isRunning.value) return
  emit('command', { type: 'run-resume-battle', battleId: props.battle.id })
}

function replayBattle(): void {
  if (!hasResult.value || isRunning.value) return
  isLocalReplay.value = true
  startRoundSequence(true)
}

function updateMotionPreference(event: MediaQueryListEvent | MediaQueryList): void {
  prefersReducedMotion.value = event.matches
}

watch(isGatewayBusy, (isBusy, wasBusy) => {
  if (isBusy) {
    startRoundSequence(false)
    return
  }

  if (wasBusy) {
    clearTimers()
    activeRound.value = props.battle?.status === 'completed' ? 3 : 0
    announcement.value =
      props.battle?.status === 'completed'
        ? winnerName.value
          ? `${winnerName.value} побеждает с результатом ${winnerScore.value} из 100.`
          : 'Сравнение завершено. Победитель не определён.'
        : 'Битва не завершена.'
  }
})

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreference(motionQuery)
  motionQuery.addEventListener('change', updateMotionPreference)
})

onBeforeUnmount(() => {
  clearTimers()
  motionQuery?.removeEventListener('change', updateMotionPreference)
})
</script>

<template>
  <div class="dashboard-widget-content resume-battle">
    <template v-if="battle && resume">
      <div class="resume-battle__meta">
        <span class="resume-battle__badge">
          <v-icon :icon="mdiCreationOutline" size="15" aria-hidden="true" />
          Демо-эксперимент
        </span>
        <span class="resume-battle__vacancy">{{ battle.vacancyTitle }} · {{ battle.company }}</span>
      </div>

      <div
        class="resume-battle__arena"
        :class="{
          'resume-battle__arena--running': isRunning,
          'resume-battle__arena--completed': hasResult,
        }"
        :aria-label="`Сравнение исходного резюме с ${battle.challengerName}`"
      >
        <article
          class="resume-battle__contender resume-battle__contender--original"
          :class="{ 'resume-battle__contender--winner': winnerIsOriginal }"
        >
          <span class="resume-battle__contender-label">Оригинал</span>
          <strong>Резюме Софии</strong>
          <span class="resume-battle__score">{{ resume.score }}<small>/100</small></span>
          <v-icon
            v-if="winnerIsOriginal"
            class="resume-battle__trophy"
            :icon="mdiTrophyOutline"
            size="22"
            aria-label="Победитель"
          />
        </article>

        <span class="resume-battle__versus" aria-hidden="true">
          <v-icon :icon="mdiSwordCross" size="22" />
          <b>VS</b>
        </span>

        <article
          class="resume-battle__contender resume-battle__contender--turbo"
          :class="{ 'resume-battle__contender--winner': winnerIsTurbo }"
        >
          <span class="resume-battle__contender-label">AI-версия</span>
          <strong>{{ battle.challengerName }}</strong>
          <span class="resume-battle__score">{{ battle.challenger.score }}<small>/100</small></span>
          <v-icon
            v-if="winnerIsTurbo"
            class="resume-battle__trophy"
            :icon="mdiTrophyOutline"
            size="22"
            aria-label="Победитель"
          />
        </article>
      </div>

      <ol class="resume-battle__rounds" aria-label="Результаты трёх раундов">
        <li
          v-for="(round, index) in rounds"
          :key="round.label"
          class="resume-battle__round"
          :class="{
            'resume-battle__round--active': isRunning && activeRound === index + 1,
            'resume-battle__round--revealed': hasResult || activeRound > index,
          }"
        >
          <span>Раунд {{ index + 1 }} · {{ round.label }}</span>
          <strong v-if="hasResult || (isRunning && activeRound >= index + 1)">
            {{ round.original }} : {{ round.challenger }}
          </strong>
          <strong v-else aria-label="Результат пока скрыт">— : —</strong>
        </li>
      </ol>

      <div class="resume-battle__footer">
        <div class="resume-battle__result">
          <strong>{{ visibleStatus }}</strong>
          <span>Игровая симуляция, а не реальный прогноз.</span>
        </div>

        <v-btn
          v-if="hasResult"
          class="dashboard-widget-button resume-battle__button"
          color="primary"
          variant="flat"
          :disabled="isRunning"
          @click="replayBattle"
        >
          Повторить шоу
        </v-btn>
        <v-btn
          v-else
          class="dashboard-widget-button resume-battle__button"
          color="primary"
          variant="flat"
          :loading="isGatewayBusy"
          :disabled="isRunning"
          @click="runBattle"
        >
          Начать баттл
        </v-btn>
      </div>

      <p
        v-if="actionError"
        class="dashboard-widget-action-error"
        role="alert"
        aria-live="assertive"
      >
        {{ actionError }}
      </p>
      <span class="resume-battle__sr-only" aria-live="polite">{{ announcement }}</span>
    </template>

    <div v-else class="dashboard-widget-empty" role="status">
      <span class="resume-battle__empty-icon" aria-hidden="true">VS</span>
      <strong>Для баттла нужно резюме</strong>
      <p>Добавьте резюме, чтобы сравнить оригинал с фантазийной AI-версией.</p>
    </div>
  </div>
</template>

<style scoped>
.resume-battle {
  position: relative;
  gap: 10px;
  isolation: isolate;
}

.resume-battle::before,
.resume-battle::after {
  position: absolute;
  z-index: -1;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  content: '';
  filter: blur(48px);
  opacity: 0.2;
  pointer-events: none;
}

.resume-battle::before {
  top: 0;
  right: 8%;
  background: var(--color-demo-pink);
}

.resume-battle::after {
  bottom: 0;
  left: 12%;
  background: var(--color-demo-cyan);
}

.resume-battle__meta,
.resume-battle__footer {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.resume-battle__badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  color: #5b2dcc;
  font-size: 11px;
  font-weight: 750;
  background: rgb(109 59 255 / 11%);
  border: 1px solid rgb(109 59 255 / 18%);
  border-radius: 999px;
  text-transform: uppercase;
}

.resume-battle__vacancy {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resume-battle__arena {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 54px minmax(0, 1fr);
  align-items: stretch;
  gap: 10px;
}

.resume-battle__contender {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) auto;
  align-content: center;
  gap: 1px 12px;
  min-height: 78px;
  padding: 11px 13px;
  overflow: hidden;
  background: rgb(255 255 255 / 74%);
  border: 1px solid rgb(44 44 44 / 8%);
  border-radius: 14px;
}

.resume-battle__contender--turbo {
  border-color: rgb(109 59 255 / 25%);
  background: linear-gradient(135deg, rgb(255 255 255 / 88%), rgb(239 233 255 / 85%));
}

.resume-battle__contender--winner {
  border-color: rgb(109 59 255 / 55%);
  box-shadow: 0 8px 24px rgb(109 59 255 / 18%);
}

.resume-battle__contender-label {
  grid-column: 1;
  color: var(--color-text-muted);
  font-size: 11px;
  text-transform: uppercase;
}

.resume-battle__contender strong {
  min-width: 0;
  grid-column: 1;
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resume-battle__score {
  display: flex;
  grid-column: 2;
  grid-row: 1 / span 2;
  align-items: baseline;
  align-self: center;
  color: var(--color-text);
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.resume-battle__contender--turbo .resume-battle__score {
  color: #5b2dcc;
}

.resume-battle__score small {
  color: var(--color-text-muted);
  font-size: 10px;
  letter-spacing: 0;
}

.resume-battle__versus {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #5b2dcc;
  font-size: 11px;
}

.resume-battle__trophy {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #d88a00;
}

.resume-battle__rounds {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  list-style: none;
}

.resume-battle__round {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 7px 9px;
  color: var(--color-text-muted);
  font-size: 11px;
  background: rgb(255 255 255 / 58%);
  border: 1px solid rgb(44 44 44 / 7%);
  border-radius: 10px;
  opacity: 0.72;
}

.resume-battle__round span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resume-battle__round strong {
  flex: 0 0 auto;
  color: var(--color-text);
}

.resume-battle__round--active,
.resume-battle__round--revealed {
  border-color: rgb(109 59 255 / 28%);
  opacity: 1;
}

.resume-battle__round--active {
  background: rgb(109 59 255 / 10%);
  box-shadow: 0 0 0 3px rgb(109 59 255 / 6%);
  transform: translateY(-2px);
}

.resume-battle__result {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.resume-battle__result strong {
  font-size: 13px;
}

.resume-battle__result span {
  color: var(--color-text-muted);
  font-size: 11px;
}

.resume-battle__button {
  flex: 0 0 auto;
  box-shadow: 0 8px 20px rgb(0 87 255 / 20%);
}

.resume-battle__arena--running .resume-battle__versus {
  animation: resume-battle-pulse 0.72s ease-in-out infinite alternate;
}

.resume-battle__arena--running .resume-battle__contender--turbo::after {
  position: absolute;
  inset: -80% -30%;
  background: linear-gradient(90deg, transparent 35%, rgb(255 255 255 / 72%) 50%, transparent 65%);
  content: '';
  transform: translateX(-55%) rotate(14deg);
  animation: resume-battle-scan 0.9s linear infinite;
  pointer-events: none;
}

.resume-battle__empty-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  color: #5b2dcc;
  font-weight: 850;
  background: rgb(109 59 255 / 11%);
  border-radius: 17px;
}

.resume-battle__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes resume-battle-pulse {
  to {
    filter: drop-shadow(0 0 8px rgb(109 59 255 / 55%));
    transform: scale(1.08);
  }
}

@keyframes resume-battle-scan {
  to {
    transform: translateX(55%) rotate(14deg);
  }
}

@container dashboard-widget (max-width: 480px) {
  .resume-battle__arena {
    grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr);
    gap: 5px;
  }

  .resume-battle__contender {
    display: flex;
    min-height: 96px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1px;
    padding: 9px;
    text-align: center;
  }

  .resume-battle__score {
    font-size: 23px;
  }

  .resume-battle__rounds {
    grid-template-columns: minmax(0, 1fr);
  }

  .resume-battle__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .resume-battle__button {
    width: 100%;
  }
}

@container dashboard-widget (max-width: 390px) {
  .resume-battle__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .resume-battle__vacancy {
    max-width: 100%;
  }

  .resume-battle__arena {
    grid-template-columns: minmax(0, 1fr);
  }

  .resume-battle__versus {
    min-height: 34px;
    flex-direction: row;
    gap: 5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .resume-battle__arena--running .resume-battle__versus,
  .resume-battle__arena--running .resume-battle__contender--turbo::after {
    animation: none;
  }

  .resume-battle__round--active {
    transform: none;
  }
}
</style>
