import { defineComponent } from "vue"

export default defineComponent({
    name: "RouterLinkStub",
    props: {
        to: {
            type: [String, Object],
            required: true,
        },
    },
    template: `
    <a :href="typeof to === 'string' ? to : to.path">
      <slot />
    </a>
  `,
})
