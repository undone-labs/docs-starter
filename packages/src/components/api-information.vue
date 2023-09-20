<template>
  <div v-if="headers || queryParameters || responseCodes" class="api-information">

    <!-- =========================================================== headers -->
    <div v-if="headers" class="headers section">
      <div class="heading">
        Headers
      </div>
      <div
        v-for="(header, key) in props.headers"
        :key="key"
        class="entry">
        <div class="metadata">
          <div class="key">
            {{ key }}
          </div>
          <div class="type">
            {{ header.type }}
          </div>
        </div>
        <MarkdownParser :markdown="header.description" class="description" />
      </div>
    </div>

    <!-- ================================================== query parameters -->
    <div v-if="queryParameters" class="query-parameters section">
      <div class="heading">
        Query Parameters
      </div>
      <div
        v-for="(parameter, key) in props.queryParameters"
        :key="key"
        class="entry">
        <div class="metadata">
          <div class="key">
            {{ key }}
          </div>
          <div class="type">
            {{ parameter.type }}
          </div>
        </div>
        <MarkdownParser :markdown="parameter.description" class="description" />
      </div>
    </div>

    <!-- ==================================================== response codes -->
    <div v-if="responseCodes" class="response-codes section">
      <div class="heading">
        HTTP Response Status Codes
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(description, code) in props.responseCodes"
            :key="code">
            <td>
              <div class="http-code">
                {{ code }}
              </div>
            </td>
            <td>
              <MarkdownParser :markdown="description" class="description" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  headers: {
    type: Object,
    required: false,
    default: undefined
  },
  queryParameters: {
    type: Object,
    required: false,
    default: undefined
  },
  responseCodes: {
    type: Object,
    required: false,
    default: undefined
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.api-information {
  margin-top: 3rem;
}

.section {
  &:not(:first-child) {
    margin-top: 3rem;
  }
}

.heading {
  @include h4;
  margin-bottom: toRem(4);
  padding-bottom: toRem(4);
  border-bottom: 1px solid var(--divider);
  transition: color 500ms, border-color 500ms;
}

.entry {
  margin-bottom: 1rem;
  padding-top: 1rem;
  transition: border-color 500ms;
  &:not(:nth-child(2)) {
    border-top: 1px solid var(--divider);
  }
}

.metadata {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.key {
  @include inlineCode;
  line-height: 1;
  font-weight: 700;
  margin-right: 0.5rem;
  transition: color 500ms, background-color 500ms;
}

.type {
  font-weight: 500;
  transition: color 500ms;
}

:deep(.description) {
  margin-top: 0.5rem;
  p {
    margin-bottom: 0;
    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }
}

table {
  width: 100%;
}

tbody {
  tr {
    border-top: 1px solid var(--divider);
    transition: border-color 500ms;
  }
}

.http-code,
th {
  transition: color 500ms;
}

th {
  text-align: left;
  padding-top: 1.5rem;
  padding-bottom: toRem(8);
  &:first-child {
    padding-right: 3rem;
  }
}

td {
  padding: toRem(4) 0;
  &:first-child {
    font-weight: 500;
  }
  .markdown {
    margin-top: 0;
  }
}
</style>
