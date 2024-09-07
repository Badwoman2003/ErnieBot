<template>
  <div class="question-box">
    <input ref="inputRef" class="question-box_input" type="text" placeholder="请输入你的问题" v-model="question" autofocus />
    <t-button :loading :disabled class="question-box_button" @click="submit">提问</t-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onUnmounted, ref, onMounted } from 'vue';

const emit = defineEmits<{
  (e: 'submit', value: string): void;
}>();
const props = defineProps<{
  loading?: boolean;
}>();
const question = ref('');
const inputRef = ref<HTMLInputElement>();

const disabled = computed(() => question.value.length === 0 || props.loading);

function submit() {
  emit('submit', question.value);
  question.value = '';
}

function submitOnEnter(e: KeyboardEvent) {
  if (!disabled.value && e.key === 'Enter') {
    submit();
  }
}

onMounted(() => {
  inputRef.value?.addEventListener('keypress', submitOnEnter);
});
onUnmounted(() => {
  inputRef.value?.removeEventListener('keypress', submitOnEnter);
});


</script>

<style scoped lang="scss">
.question-box {
  @include flex(row, flex-start, center);
  @include padding(0 1.6rem);
  flex-shrink: 0;
  background: #fafafa;
  width: calc(100% - 3.2rem);
  max-width: $pad;
  height: 5.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1);
  gap: 0.8rem;

  &_input {
    flex: 1 0;
    outline: none;
    border: none;
    background: unset;

    &:focus {
      outline: none;
    }
  }
  &_button {
    flex-shrink: 0;
  }
}
</style>
