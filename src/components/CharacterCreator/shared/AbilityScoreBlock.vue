&lt;template&gt;
&lt;v-row no-gutters&gt;
&lt;v-col v-for=&quot;(ability, index) in abilityScores&quot; :key=&quot;ability.name&quot; cols=&quot;12&quot;
sm=&quot;6&quot; md=&quot;4&quot; class=&quot;pa-2&quot;&gt;
&lt;v-card variant=&quot;outlined&quot; :class=&quot;{'ability-card': true, 'focused': focusedAbility ===
ability.name}&quot;&gt;
&lt;v-card-title class=&quot;d-flex justify-space-between align-center pa-3&quot;&gt;
&lt;div class=&quot;text-subtitle-1&quot;&gt;{{ ability.name }}&lt;/div&gt;
&lt;v-chip size=&quot;small&quot; :color=&quot;getModifierColor(ability.modifier)&quot;&gt;
{{ formatModifier(ability.modifier) }}
&lt;/v-chip&gt;
&lt;/v-card-title&gt;

&lt;v-card-text class=&quot;pt-0 pb-3 px-3&quot;&gt;
&lt;div class=&quot;d-flex align-center justify-space-between&quot;&gt;
&lt;v-btn-group divided&gt;
&lt;v-btn size=&quot;small&quot; variant=&quot;text&quot; :disabled=&quot;!canDecrement(ability)&quot;
@click=&quot;decrementScore(ability)&quot;&gt;
&lt;v-icon&gt;mdi-minus&lt;/v-icon&gt;
&lt;/v-btn&gt;
&lt;v-btn size=&quot;small&quot; variant=&quot;text&quot; class=&quot;score-display&quot;&gt;
{{ ability.score }}
&lt;/v-btn&gt;
&lt;v-btn size=&quot;small&quot; variant=&quot;text&quot; :disabled=&quot;!canIncrement(ability)&quot;
@click=&quot;incrementScore(ability)&quot;&gt;
&lt;v-icon&gt;mdi-plus&lt;/v-icon&gt;
&lt;/v-btn&gt;
&lt;/v-btn-group&gt;

&lt;v-menu v-if=&quot;ability.racialBonus&quot;&gt;
&lt;template v-slot:activator=&quot;{ props }&quot;&gt;
&lt;v-chip
size=&quot;small&quot;
variant=&quot;outlined&quot;
color=&quot;primary&quot;
v-bind=&quot;props&quot;
class=&quot;ms-2&quot;
&gt;
+{{ ability.racialBonus }}
&lt;/v-chip&gt;
&lt;/template&gt;
&lt;v-card min-width=&quot;200&quot;&gt;
&lt;v-card-text&gt;
&lt;div class=&quot;text-caption&quot;&gt;Racial Bonus from {{ character.race }}&lt;/div&gt;
&lt;/v-card-text&gt;
&lt;/v-card&gt;
&lt;/v-menu&gt;
&lt;/div&gt;

&lt;div class=&quot;text-caption text-grey mt-2&quot;&gt;
{{ getAbilityDescription(ability.name) }}
&lt;/div&gt;
&lt;/v-card-text&gt;
&lt;/v-card&gt;
&lt;/v-col&gt;
&lt;/v-row&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { computed, ref } from 'vue'

const props = defineProps({
character: {
type: Object,
required: true
},
abilityScores: {
type: Array,
required: true
},
pointBuy: {
type: Boolean,
default: false
},
remainingPoints: {
type: Number,
default: 27
}
})

const emit = defineEmits(['update:ability-scores'])

const focusedAbility = ref(null)

const costTable = {
8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
}

function formatModifier(modifier) {
return modifier >= 0 ? `+${modifier}` : `${modifier}`
}

function getModifierColor(modifier) {
if (modifier > 0) return 'success'
if (modifier < 0) return 'error' return 'grey' } function canIncrement(ability) { if (!props.pointBuy) return
  ability.score < 20 const currentCost=costTable[ability.score] || 0 const nextCost=costTable[ability.score + 1] || 0
  const pointDifference=nextCost - currentCost return ability.score < 15 && props.remainingPoints>= pointDifference
  }

  function canDecrement(ability) {
  return props.pointBuy ? ability.score > 8 : ability.score > 1
  }

  function incrementScore(ability) {
  if (!canIncrement(ability)) return

  const newScores = props.abilityScores.map(score => {
  if (score.name === ability.name) {
  return { ...score, score: score.score + 1 }
  }
  return score
  })

  emit('update:ability-scores', newScores)
  }

  function decrementScore(ability) {
  if (!canDecrement(ability)) return

  const newScores = props.abilityScores.map(score => {
  if (score.name === ability.name) {
  return { ...score, score: score.score - 1 }
  }
  return score
  })

  emit('update:ability-scores', newScores)
  }

  function getAbilityDescription(abilityName) {
  const descriptions = {
  'Strength': 'Raw physical power and athletic ability',
  'Dexterity': 'Agility, reflexes, and balance',
  'Constitution': 'Health, stamina, and vital force',
  'Intelligence': 'Mental acuity, information recall, analytical skill',
  'Wisdom': 'Awareness, intuition, and insight',
  'Charisma': 'Force of personality, persuasiveness, leadership'
  }
  return descriptions[abilityName] || ''
  }
  &lt;/script&gt;

  &lt;style scoped&gt;
  .ability-card {
  transition: all 0.3s ease;
  height: 100%;
  }

  .ability-card:hover {
  border-color: var(--v-primary-base);
  }

  .ability-card.focused {
  border-color: var(--v-primary-base);
  box-shadow: 0 0 0 1px var(--v-primary-base);
  }

  .score-display {
  min-width: 48px;
  }
  &lt;/style&gt;
