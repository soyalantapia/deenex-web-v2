<template>
  <label class="block">
    <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">
      {{ label }}
      <span v-if="required" class="text-primary">·</span>
    </span>
    <div class="relative">
      <input
        v-if="type !== 'textarea'"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :name="name"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        class="w-full px-4 py-3 rounded-xl bg-white border-2 text-base text-slate-900 placeholder-slate-300 transition-colors focus:outline-none"
        :class="error
          ? 'border-rose-300 focus:border-rose-500'
          : 'border-slate-200 focus:border-primary'"
      />
      <span v-if="prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
        {{ prefix }}
      </span>
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-rose-500 font-medium">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-slate-400 font-medium">{{ hint }}</p>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  prefix: { type: String, default: '' },
  inputmode: { type: String, default: undefined },
  autocomplete: { type: String, default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  name: { type: String, default: undefined },
})

defineEmits(['update:modelValue', 'blur'])
</script>
